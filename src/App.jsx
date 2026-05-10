import React, { useMemo, useState } from "react";
import { DATA } from "./data";

const ASSETS = [
  { key: "sp500", label: "S&P 500", start: 1928 },
  { key: "small_cap", label: "US Small Cap", start: 1928 },
  { key: "tbills", label: "T-Bills", start: 1928 },
  { key: "bond10", label: "10Y Treasury Bonds", start: 1928 },
  { key: "gold", label: "Gold", start: 1928 },
];

const HORIZONS = [1, 3, 5, 10, 15, 20, 30, 40];

function total(p) {
  return Object.values(p).reduce((a, b) => a + Number(b || 0), 0);
}
function valid(p) { return total(p) === 100; }

function realReturn(nominal, inflation) {
  return (1 + nominal) / (1 + inflation) - 1;
}

function portfolioAnnualReturns(portfolio, mode) {
  return DATA.map((row) => {
    const r = Object.entries(portfolio).reduce((sum, [asset, weight]) => {
      const nominal = row[asset] ?? 0;
      const value = mode === "Real" ? realReturn(nominal, row.inflation) : nominal;
      return sum + (Number(weight || 0) / 100) * value;
    }, 0);
    return { year: row.year, return: r };
  });
}

function rollingCagr(annualReturns, horizon) {
  const out = [];
  for (let i = 0; i <= annualReturns.length - horizon; i++) {
    const slice = annualReturns.slice(i, i + horizon);
    const growth = slice.reduce((g, r) => g * (1 + r.return), 1);
    out.push(Math.pow(growth, 1 / horizon) - 1);
  }
  return out;
}

function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}

function boxStats(values) {
  const s = [...values].sort((a, b) => a - b);
  return { low: s[0], q1: quantile(s, 0.25), med: quantile(s, 0.5), q3: quantile(s, 0.75), high: s[s.length - 1], n: s.length };
}

function portfolioBox(portfolio, horizon, mode) {
  return boxStats(rollingCagr(portfolioAnnualReturns(portfolio, mode), horizon));
}

function formatMetric(v) { return `${(v * 100).toFixed(1)}%`; }

function FakeAd({ type = "display", label = "Advertisement" }) {
  return (
    <div className={`rounded-xl border border-dashed border-slate-300 bg-slate-50/80 text-slate-400 grid place-items-center ${type === "leaderboard" ? "h-[90px]" : "h-[250px]"}`}>
      <div className="text-center px-4">
        <div className="text-[10px] uppercase tracking-[0.18em] mb-2">{label}</div>
        <div className="text-sm text-slate-500">Fake ad preview</div>
      </div>
    </div>
  );
}

function Row({ asset, data, setData, color = "blue" }) {
  const v = data[asset.key] || 0;
  const sliderColor = color === "green" ? "#2f6b55" : "#224b75";
  return (
    <div className="py-2 border-b border-slate-100">
      <div className="flex justify-between text-sm mb-1">
        <span>{asset.label}</span>
        <span className="text-slate-500">{v}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={v}
        onChange={(e) => setData({ ...data, [asset.key]: Number(e.target.value) })}
        className="clean-slider w-full"
        style={{ background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${v}%, #e5e7eb ${v}%, #e5e7eb 100%)` }}
      />
    </div>
  );
}

function Card({ title, data, setData, onNormalize }) {
  const t = total(data);
  const ok = t === 100;
  const isA = title.includes("A");
  return (
    <div className="bg-white/90 rounded-2xl border border-slate-200 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="flex justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: isA ? "#224b75" : "#2f6b55" }} />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${ok ? "text-emerald-600" : "text-red-500"}`}>Total {t}%</span>
          {!ok && (
            <button
              onClick={onNormalize}
              className="text-[11px] rounded-full border border-red-200 bg-red-50 text-red-600 px-2 py-1 hover:bg-red-100"
            >
              Normalize
            </button>
          )}
        </div>
      </div>
      {ASSETS.map((a) => <Row key={a.key} asset={a} data={data} setData={setData} color={isA ? "blue" : "green"} />)}
    </div>
  );
}

function getScale(boxes) {
  const vals = boxes.flatMap((b) => [b.low, b.high]).filter(Number.isFinite);
  const min = Math.min(...vals, -0.05);
  const max = Math.max(...vals, 0.05);
  const range = max - min || 0.1;

  // Tighter padding so the largest boxplot fills more of the chart area.
  // Same scale is still used for both horizons.
  const pad = range * 0.04;
  const scaleMin = min - pad;
  const scaleMax = max + pad;

  return {
    min: scaleMin,
    max: scaleMax,
    ticks: Array.from({ length: 5 }, (_, i) => scaleMax - ((scaleMax - scaleMin) / 4) * i),
  };
}

function BoxPlot({ h, scale, dataA, dataB }) {
  const { min, max, ticks } = scale;
  const y = (v) => 255 - ((v - min) / (max - min)) * 235;
  const Box = ({ d, x, color, fill }) => (
    <g>
      <line x1={x} x2={x} y1={y(d.low)} y2={y(d.high)} stroke={color} strokeWidth="1.15" opacity="0.72" />
      <line x1={x - 12} x2={x + 12} y1={y(d.low)} y2={y(d.low)} stroke={color} strokeWidth="1.15" opacity="0.72" />
      <line x1={x - 12} x2={x + 12} y1={y(d.high)} y2={y(d.high)} stroke={color} strokeWidth="1.15" opacity="0.72" />
      <rect x={x - 24} y={y(d.q3)} width="48" height={Math.max(1, y(d.q1) - y(d.q3))} rx="3" fill={fill} stroke={color} strokeWidth="1.1" opacity="0.72" />
      <line x1={x - 24} x2={x + 24} y1={y(d.med)} y2={y(d.med)} stroke={color} strokeWidth="1.8" />
    </g>
  );
  return (
    <svg viewBox="0 0 360 300" className="w-full h-full">
      {ticks.map((t) => (
        <g key={t}>
          <line x1="48" x2="330" y1={y(t)} y2={y(t)} stroke="#dbe3ec" strokeDasharray="4 6" opacity="0.8" />
          <text x="38" y={y(t) + 4} textAnchor="end" fontSize="10" fill="#64748b">{Math.round(t * 100)}%</text>
        </g>
      ))}
      <Box d={dataA} x={145} color="#224b75" fill="#dbeafe" />
      <Box d={dataB} x={215} color="#2f6b55" fill="#d8e7e0" />
      <text x="180" y="294" textAnchor="middle" fontSize="13" fill="#0f172a">{h} year</text>
    </svg>
  );
}

function Chart({ a, b, h1, h2, mode, setMode }) {
  const horizons = [h1, h2].sort((x, y) => x - y);
  const boxes = useMemo(() => horizons.map((h) => ({ h, a: portfolioBox(a, h, mode), b: portfolioBox(b, h, mode) })), [a, b, h1, h2, mode]);
  const scale = getScale(boxes.flatMap((x) => [x.a, x.b]));

  return (
    <div className="bg-white/90 rounded-2xl border border-slate-200 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 text-sm mb-6">
        <span>Comparison window 1928–2025</span>

        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {["Nominal", "Real"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-1 rounded-md ${mode === m ? "bg-slate-900 text-white" : "text-slate-500"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <span>{horizons[0]}Y · {horizons[1]}Y · CAGR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {boxes.map(({ h, a: boxA, b: boxB }) => (
          <div key={h} className="border border-slate-100 rounded-xl p-2 md:p-4 relative h-[300px] md:h-[330px]">
            <div className="absolute left-4 top-3 text-xs text-slate-500 font-medium z-10">{mode} CAGR</div>

            <BoxPlot h={h} scale={scale} dataA={boxA} dataB={boxB} />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <FakeAd type="leaderboard" label="Result area AdSense slot" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {boxes.map(({ h, a: pa, b: pb }) => (
          <div key={h} className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 text-sm font-medium bg-slate-50">
              {h} year · {mode} CAGR
            </div>

            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Value</th>
                  <th className="text-right px-4 py-2 font-medium">Portfolio A</th>
                  <th className="text-right px-4 py-2 font-medium">Portfolio B</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["High", pa.high, pb.high],
                  ["Upper quartile", pa.q3, pb.q3],
                  ["Median", pa.med, pb.med],
                  ["Lower quartile", pa.q1, pb.q1],
                  ["Low", pa.low, pb.low],
                  ["Periods", pa.n, pb.n],
                ].map((r) => (
                  <tr key={r[0]} className="border-b last:border-b-0 border-slate-100">
                    <td className="px-4 py-2 text-slate-500">{r[0]}</td>
                    <td className="px-4 py-2 text-right text-slate-500">
                      {r[0] === "Periods" ? r[1] : formatMetric(r[1])}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-500">
                      {r[0] === "Periods" ? r[2] : formatMetric(r[2])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function AffiliateBlock() {
  return (
    <div className="mt-6 bg-white/90 rounded-2xl border border-slate-200 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">Open affiliate area</div>
          <h3 className="text-lg font-medium">Put this portfolio to work</h3>
          <p className="text-sm text-slate-500 mt-1">Native partner placement below the result. Designed to feel helpful, not intrusive.</p>
        </div>
        <span className="text-[11px] text-slate-400 border border-slate-200 rounded-full px-2 py-1">Sponsored</span>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {[["Broker partner", "Open account"], ["ETF screener", "Find funds"], ["Portfolio tool", "Compare fees"]].map(([title, cta]) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 mb-3 grid place-items-center text-slate-400 text-xs">Ad</div>
            <div className="text-sm font-medium mb-1">{title}</div>
            <div className="text-xs text-slate-500 mb-3">Relevant finance offer based on user intent.</div>
            <button className="text-xs rounded-lg bg-slate-900 text-white px-3 py-2">{cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodologyBlock() {
  return (
    <section className="mt-6 bg-white/90 rounded-2xl border border-slate-200 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)] text-slate-600">
      <h2 className="text-base font-medium text-slate-900 mb-4">Methodology, Data &amp; Acknowledgements</h2>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">Methodology</h3>
          <ul className="space-y-1.5 text-sm leading-6">
            <li>Portfolios are rebalanced annually to target weights</li>
            <li>Real returns are adjusted for inflation using U.S. CPI data</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">Data</h3>
          <p className="text-sm leading-6">
            Market return data is based on historical datasets compiled by Aswath Damodaran at New York University Stern School of Business.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">Acknowledgements</h3>
          <p className="text-sm leading-6">
            Huge thanks to Aswath Damodaran for making long-term historical market data publicly available and accessible to investors, students, and researchers around the world.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [a, setA] = useState({ sp500: 100, small_cap: 0, tbills: 0, bond10: 0, gold: 0 });
  const [b, setB] = useState({ sp500: 60, small_cap: 0, tbills: 0, bond10: 40, gold: 0 });
  const [selectedHorizons, setSelectedHorizons] = useState([10, 30]);
  const [h1, h2] = selectedHorizons.length === 2 ? selectedHorizons : [selectedHorizons[0], selectedHorizons[0]];
  const [mode, setMode] = useState("Real");
  const normalizePortfolio = (p) => {
    const sum = total(p);
    if (!sum) return p;

    const normalized = {};
    let running = 0;

    ASSETS.forEach((asset, i) => {
      if (i === ASSETS.length - 1) {
        normalized[asset.key] = 100 - running;
      } else {
        const value = Math.round((p[asset.key] / sum) * 100);
        normalized[asset.key] = value;
        running += value;
      }
    });

    return normalized;
  };

  const ok = valid(a) && valid(b);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 pb-24">
      <style>{`:root{--slider-color:#224b75;} .portfolio-b{--slider-color:#2f6b55;} .clean-slider{appearance:none;height:8px;border-radius:999px;outline:none;} .clean-slider::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:999px;background:#fff;border:2.5px solid var(--slider-color);cursor:pointer;} .clean-slider::-moz-range-thumb{width:22px;height:22px;border-radius:999px;background:#fff;border:2.5px solid var(--slider-color);cursor:pointer;}`}</style>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">Two portfolios. Two horizons. <span className="text-emerald-600">One clear perspective.</span></h1>
        <p className="text-slate-500 mb-8">Build and compare portfolios — and see how time reduces short-term risk.</p>
        <div className="mb-6"><FakeAd type="leaderboard" label="Top AdSense slot" /></div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div><Card title="Portfolio A" data={a} setData={setA} onNormalize={() => setA(normalizePortfolio(a))} /></div>
          <div className="portfolio-b"><Card title="Portfolio B" data={b} setData={setB} onNormalize={() => setB(normalizePortfolio(b))} /></div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
          {HORIZONS.map((h) => {
            const selected = h === h1 || h === h2;
            return (
              <button
                key={h}
                onClick={() => {
                  if (selected) {
                    const next = selectedHorizons.filter((x) => x !== h);
                    setSelectedHorizons(next.length ? next : [h]);
                    return;
                  }

                  if (selectedHorizons.length === 1) {
                    setSelectedHorizons([selectedHorizons[0], h].sort((x, y) => x - y));
                    return;
                  }

                  setSelectedHorizons([h]);
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition ${
                  selected
                    ? "bg-[#173b68] text-white border-[#173b68] shadow-[0_8px_20px_rgba(23,59,104,0.16)]"
                    : "bg-white/90 text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {h}Y
              </button>
            );
          })}
        </div>
        {ok && selectedHorizons.length === 2 ? (
          <Chart a={a} b={b} h1={h1} h2={h2} mode={mode} setMode={setMode} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 h-[380px] grid place-items-center text-slate-400 text-sm">
            {ok ? "Select two investment horizons" : "Set both portfolios to 100%"}
          </div>
        )}
        <AffiliateBlock />
        <MethodologyBlock />
        <div className="h-[100px]" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-3 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl h-[64px] rounded-2xl border border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] grid place-items-center text-center">
          <div><div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Sticky bottom ad</div><div className="text-xs text-slate-500">Fake AdSense preview · 320x50 / responsive</div></div>
        </div>
      </div>
    </main>
  );
}
