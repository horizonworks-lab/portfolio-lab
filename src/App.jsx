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

  return {
    low: s[0],
    p5: quantile(s, 0.05),
    q1: quantile(s, 0.25),
    med: quantile(s, 0.5),
    q3: quantile(s, 0.75),
    p95: quantile(s, 0.95),
    high: s[s.length - 1],
    n: s.length,
  };
}
function portfolioBox(portfolio, horizon, mode) {
  return boxStats(rollingCagr(portfolioAnnualReturns(portfolio, mode), horizon));
}

function formatMetric(v) { return `${(v * 100).toFixed(1)}%`; }

function portfolioToParam(portfolio) {
  return ASSETS.map((asset) => Number(portfolio[asset.key] || 0)).join(",");
}

function paramToPortfolio(value) {
  if (!value) return null;

  const parts = value.split(",").map((part) => Number(part));

  if (
    parts.length !== ASSETS.length ||
    parts.some((part) => !Number.isFinite(part) || part < 0 || part > 100)
  ) {
    return null;
  }

  return Object.fromEntries(
    ASSETS.map((asset, index) => [asset.key, parts[index]])
  );
}

function buildShareUrl({ a, b, horizons, mode }) {
  const url = new URL(window.location.href);

  url.searchParams.set("a", portfolioToParam(a));
  url.searchParams.set("b", portfolioToParam(b));
  url.searchParams.set("h", horizons.join(","));
  url.searchParams.set("m", mode.toLowerCase());

  return url.toString();
}

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

function Card({ title, data, setData, onNormalize, validationAttempted }) {
  const t = total(data);
  const ok = t === 100;
  const isA = title.includes("A");
  const showError = validationAttempted && !ok;

  return (
    <div className="bg-white/90 rounded-2xl border border-slate-200 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="flex justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: isA ? "#224b75" : "#2f6b55" }} />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${showError ? "text-red-500" : ok ? "text-emerald-600" : "text-slate-400"}`}>Total {t}%</span>
          {!ok && (
            <button
              onClick={onNormalize}
              className="text-[11px] rounded-full border border-slate-200 bg-slate-50 text-slate-500 px-2 py-1 hover:bg-slate-100"
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

  if (!vals.length) {
    return { min: -0.02, max: 0.02, ticks: [0.02, 0.01, 0, -0.01, -0.02] };
  }

  const min = Math.min(...vals);
  const max = Math.max(...vals);

  // Shared scale across both charts, based on the lowest low and highest high
  // across all displayed boxplots. Rounded to nearest even whole percent.
  let scaleMin = Math.floor((min * 100) / 2) * 2 / 100;
  let scaleMax = Math.ceil((max * 100) / 2) * 2 / 100;

  if (scaleMin === scaleMax) {
    scaleMin -= 0.02;
    scaleMax += 0.02;
  }

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
      <line x1={x} x2={x} y1={y(d.p5)} y2={y(d.p95)} stroke={color} strokeWidth="1.15" opacity="0.72" />
      <line x1={x - 12} x2={x + 12} y1={y(d.p5)} y2={y(d.p5)} stroke={color} strokeWidth="1.15" opacity="0.72" />
      <line x1={x - 12} x2={x + 12} y1={y(d.p95)} y2={y(d.p95)} stroke={color} strokeWidth="1.15" opacity="0.72" />

      <rect x={x - 24} y={y(d.q3)} width="48" height={Math.max(1, y(d.q1) - y(d.q3))} rx="3" fill={fill} stroke={color} strokeWidth="1.1" opacity="0.72" />
      <line x1={x - 24} x2={x + 24} y1={y(d.med)} y2={y(d.med)} stroke={color} strokeWidth="1.8" />

      <text x={x} y={y(d.high) + 4} textAnchor="middle" fontSize="16" fill={color} opacity="0.78">*</text>
      <text x={x} y={y(d.low) + 4} textAnchor="middle" fontSize="16" fill={color} opacity="0.78">*</text>
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


function Chart({
  a,
  b,
  h1,
  h2,
  mode,
  draftMode,
  setDraftMode,
  chartAdKey,
  isUpdating,
  toastMessage,
  copyLink,
}) {
  const horizons = [h1, h2].sort((x, y) => x - y);
  const boxes = useMemo(() => horizons.map((h) => ({ h, a: portfolioBox(a, h, mode), b: portfolioBox(b, h, mode) })), [a, b, h1, h2, mode]);
  const scale = getScale(boxes.flatMap((x) => [x.a, x.b]));

  return (
    <div className={`relative bg-white/90 rounded-2xl border border-slate-200 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.035)] transition duration-200 ${isUpdating ? "ring-2 ring-slate-200 opacity-90" : ""}`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 text-sm mb-6">
        <div className="flex items-center gap-3">
          <span>Comparison window 1928–2025</span>

           <button
            onClick={copyLink}
            className="text-xs text-slate-400 hover:text-slate-700 transition"
           >
            ↗ Copy link
           </button>

        </div>

        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            {["Nominal", "Real"].map((m) => (
              <button
                key={m}
                onClick={() => setDraftMode(m)}
                className={`px-2.5 py-1 rounded-md ${draftMode === m ? "bg-slate-900 text-white" : "text-slate-500"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <span>{horizons[0]}Y · {horizons[1]}Y · CAGR</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        With a random historical starting year, your outcome would fall within this range.<br />
        Whiskers represent the 5th–95th percentile range, * marks historical min & max
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {boxes.map(({ h, a: boxA, b: boxB }) => (
          <div key={h} className="border border-slate-100 rounded-xl p-2 md:p-4 relative h-[300px] md:h-[330px]">
            <div className="absolute left-4 top-3 text-xs text-slate-500 font-medium z-10">{mode} CAGR</div>

            <BoxPlot h={h} scale={scale} dataA={boxA} dataB={boxB} />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <FakeAd key={chartAdKey} type="leaderboard" label="Result area AdSense slot" />
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
                  ["Max", pa.high, pb.high],
                  ["P95", pa.p95, pb.p95],
                  ["P75", pa.q3, pb.q3],
                  ["Median", pa.med, pb.med],
                  ["P25", pa.q1, pb.q1],
                  ["P5", pa.p5, pb.p5],
                  ["Min", pa.low, pb.low],
                ].map((r) => (
                  <tr key={r[0]} className="border-b last:border-b-0 border-slate-100">
                    <td className="px-4 py-2 text-slate-500">{r[0]}</td>
                    <td className="px-4 py-2 text-right text-slate-500">
                      {formatMetric(r[1])}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-500">
                      {formatMetric(r[2])}
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

function FooterInfo({ activeSection, setActiveSection }) {
  const contactEmail = "mikael.strommer@gmail.com";

  const sections = {
    about: {
      title: "About",
      content: (
        <p>
          HorizonWorks Lab is an independent portfolio research and visualization project. The tool helps users compare historical portfolio outcomes across different investment horizons using long-term market data.
        </p>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-3">
          <p>
            This website may use cookies and third-party services, including Google AdSense, to display ads and help support the site. Third-party vendors, including Google, may use cookies to serve ads based on a user’s prior visits to this or other websites. Users can manage ad personalization through their Google ad settings.
          </p>
          <p>
            This site does not require user accounts and does not intentionally collect personal financial information. Basic usage data may be processed by third-party services used for hosting, analytics, advertising, or site performance.
          </p>
          <p>
            For questions about privacy, contact: {contactEmail}.
          </p>
        </div>
      ),
    },
    contact: {
      title: "Contact",
      content: (
        <p>
          For questions, feedback, or corrections, contact: {contactEmail}.
        </p>
      ),
    },
  };

  const active = activeSection ? sections[activeSection] : null;

  return (
    <footer className="mt-8 text-sm text-slate-500">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-200 pt-5">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSection(activeSection === key ? null : key)}
            className={`transition hover:text-slate-900 ${activeSection === key ? "text-slate-900" : "text-slate-500"}`}
          >
            {section.title}
          </button>
        ))}
      </nav>

      {active && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-5 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
          <h2 className="mb-3 text-sm font-medium text-slate-900">{active.title}</h2>
          <div className="text-sm leading-6">{active.content}</div>
        </section>
      )}
    </footer>
  );
}

export default function App() {
  const initialA = { sp500: 100, small_cap: 0, tbills: 0, bond10: 0, gold: 0 };
  const initialB = { sp500: 60, small_cap: 0, tbills: 0, bond10: 40, gold: 0 };
  const initialHorizons = [10, 30];
  const initialMode = "Real";

  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);

    const urlA = paramToPortfolio(params.get("a"));
    const urlB = paramToPortfolio(params.get("b"));
    const urlHorizons = (params.get("h") || "")
      .split(",")
      .map(Number)
      .filter((h) => HORIZONS.includes(h))
      .sort((a, b) => a - b);

    const urlMode = params.get("m")?.toLowerCase() === "nominal" ? "Nominal" : "Real";

    if (urlA && urlB && valid(urlA) && valid(urlB) && urlHorizons.length === 2) {
      return { a: urlA, b: urlB, horizons: urlHorizons, mode: urlMode };
    }

    return { a: initialA, b: initialB, horizons: initialHorizons, mode: initialMode };
  };

  const initialState = getInitialState();

  const [draftA, setDraftA] = useState(initialState.a);
  const [draftB, setDraftB] = useState(initialState.b);
  const [draftSelectedHorizons, setDraftSelectedHorizons] = useState(initialState.horizons);
  const [draftMode, setDraftMode] = useState(initialState.mode);

  const [appliedA, setAppliedA] = useState(initialState.a);
  const [appliedB, setAppliedB] = useState(initialState.b);
  const [appliedSelectedHorizons, setAppliedSelectedHorizons] = useState(initialState.horizons);
  const [appliedMode, setAppliedMode] = useState(initialState.mode);

  const [validationAttempted, setValidationAttempted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [buttonSuccess, setButtonSuccess] = useState(false);
  const [chartAdKey, setChartAdKey] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeFooterSection, setActiveFooterSection] = useState(null);

  const [draftH1, draftH2] = draftSelectedHorizons.length === 2
    ? draftSelectedHorizons
    : [draftSelectedHorizons[0], draftSelectedHorizons[0]];

  const [appliedH1, appliedH2] = appliedSelectedHorizons.length === 2
    ? appliedSelectedHorizons
    : [appliedSelectedHorizons[0], appliedSelectedHorizons[0]];

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

  const updateChart = () => {
    setValidationAttempted(true);
    setCopySuccess(false);
    setIsUpdating(true);
    setToastMessage("");

    if (!valid(draftA) || !valid(draftB)) {
      setValidationMessage("Set both portfolios to 100% before updating the chart.");
      return;
    }

    if (draftSelectedHorizons.length !== 2) {
      setValidationMessage("Select two investment horizons before updating the chart.");
      return;
    }

    setAppliedA(draftA);
    setAppliedB(draftB);
    setAppliedSelectedHorizons(draftSelectedHorizons);
    setAppliedMode(draftMode);
    setValidationMessage("");
    setChartAdKey((current) => current + 1);

    setButtonSuccess(true);

setTimeout(() => {
  setButtonSuccess(false);
}, 1500);
    
    setTimeout(() => {
      setIsUpdating(false);
      setToastMessage("✓ Chart updated · Share comparison →");
    }, 220);
  };

  const copyLink = async () => {
    const url = buildShareUrl({
      a: appliedA,
      b: appliedB,
      horizons: appliedSelectedHorizons,
      mode: appliedMode,
    });

    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);

      return successful;
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const successful = fallbackCopy();
        if (!successful) throw new Error("Fallback copy failed");
      }

      setCopySuccess(true);
      setValidationMessage("");

      setTimeout(() => {
        setCopySuccess(false);
      }, 1800);
    } catch {
      setValidationAttempted(true);
      setValidationMessage("Could not copy the link. Please copy it from the address bar.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 pb-24">
      <style>{`:root{--slider-color:#224b75;} .portfolio-b{--slider-color:#2f6b55;} .clean-slider{appearance:none;height:8px;border-radius:999px;outline:none;} .clean-slider::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:999px;background:#fff;border:2.5px solid var(--slider-color);cursor:pointer;} .clean-slider::-moz-range-thumb{width:22px;height:22px;border-radius:999px;background:#fff;border:2.5px solid var(--slider-color);cursor:pointer;}`}</style>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">Two portfolios. Two horizons. <span className="text-emerald-600">One clear perspective.</span></h1>
        <p className="text-slate-500 mb-8">Build and compare portfolios — and see how time reduces short-term risk.</p>

        <div className="mb-6"><FakeAd type="leaderboard" label="Top AdSense slot" /></div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div><Card title="Portfolio A" data={draftA} setData={setDraftA} onNormalize={() => setDraftA(normalizePortfolio(draftA))} validationAttempted={validationAttempted} /></div>
          <div className="portfolio-b"><Card title="Portfolio B" data={draftB} setData={setDraftB} onNormalize={() => setDraftB(normalizePortfolio(draftB))} validationAttempted={validationAttempted} /></div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-5">
          {HORIZONS.map((h) => {
            const selected = h === draftH1 || h === draftH2;
            return (
              <button
                key={h}
                onClick={() => {
                  setValidationMessage("");
                  setCopySuccess(false);

                  if (selected) {
                    const next = draftSelectedHorizons.filter((x) => x !== h);
                    setDraftSelectedHorizons(next.length ? next : [h]);
                    return;
                  }

                  if (draftSelectedHorizons.length === 1) {
                    setDraftSelectedHorizons([draftSelectedHorizons[0], h].sort((x, y) => x - y));
                    return;
                  }

                  setDraftSelectedHorizons([h]);
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

        <div className="mb-5 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-center">
         <button
  type="button"
  onClick={updateChart}
  className={`
    w-full rounded-2xl px-5 py-4 text-sm font-medium text-white
    transition-all duration-300
    md:max-w-[320px]
    ${buttonSuccess
      ? "bg-[#334155] shadow-[0_0_24px_rgba(51,65,85,0.24)]"
      : "bg-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.16)] hover:bg-slate-800"}
  `}
>
  {buttonSuccess ? "✓ Chart updated" : "Update chart"}
</button> 

          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:bg-white active:scale-[0.99] md:max-w-[180px]"
          >
            {copySuccess ? "Copied!" : "Copy link"}
          </button>

          {validationAttempted && validationMessage && (
            <p className="mt-1 text-sm text-red-500 md:mt-0">{validationMessage}</p>
          )}
        </div>

        <div className="mb-6">
          <FakeAd key={`input-ad-${chartAdKey}`} type="leaderboard" label="Analysis update ad slot" />
        </div>

        <Chart
          a={appliedA}
          b={appliedB}
          h1={appliedH1}
          h2={appliedH2}
          mode={appliedMode}
          draftMode={draftMode}
          setDraftMode={setDraftMode}
          chartAdKey={chartAdKey}
          isUpdating={isUpdating}
          toastMessage={toastMessage}
          copyLink={copyLink}
        />

        <AffiliateBlock />
        <MethodologyBlock />
        <FooterInfo activeSection={activeFooterSection} setActiveSection={setActiveFooterSection} />
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
