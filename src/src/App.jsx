import React, { useMemo, useState } from "react";

const DATA = [{"year":1928,"sp500":0.4381115515,"small_cap":0.6215,"tbills":0.0308,"bond10":0.0083547086,"baa_corp_bond":0.0321955147,"real_estate":0.0149105368,"gold":0.0009689922,"inflation":-0.0115607},{"year":1929,"sp500":-0.0829794661,"small_cap":-0.4608,"tbills":0.0316,"bond10":0.0420380416,"baa_corp_bond":0.0301785624,"real_estate":-0.0205680705,"gold":-0.0014520813,"inflation":0.005848},{"year":1930,"sp500":-0.2512360702,"small_cap":-0.4835,"tbills":0.0455,"bond10":0.0454089588,"baa_corp_bond":0.0053975781,"real_estate":-0.043,"gold":0.0009689922,"inflation":-0.063953},{"year":1931,"sp500":-0.4383750729,"small_cap":-0.4362,"tbills":0.0231,"bond10":-0.0255889154,"baa_corp_bond":-0.1568076968,"real_estate":-0.081505,"gold":-0.173849515,"inflation":-0.0931683},{"year":1932,"sp500":-0.0864237383,"small_cap":0.2865,"tbills":0.0107,"bond10":0.0879034958,"baa_corp_bond":0.2358955308,"real_estate":-0.104664,"gold":0.2127780591,"inflation":-0.1027397},{"year":1933,"sp500":0.4998172362,"small_cap":1.4312,"tbills":0.0096,"bond10":0.0185794617,"baa_corp_bond":0.1148396065,"real_estate":0.012916,"gold":0.2080500159,"inflation":0.0076386},{"year":1934,"sp500":-0.011861591,"small_cap":0.2314,"tbills":0.0032,"bond10":0.079570176,"baa_corp_bond":0.1469000767,"real_estate":0.075977,"gold":0.0013100425,"inflation":0.0151503},{"year":1935,"sp500":0.4674046206,"small_cap":0.8293,"tbills":0.0018,"bond10":0.0447420984,"baa_corp_bond":0.0840715709,"real_estate":0.008464,"gold":0.0013094449,"inflation":0.0295588},{"year":1936,"sp500":0.3194405582,"small_cap":0.3862,"tbills":0.0017,"bond10":0.050188416,"baa_corp_bond":0.0695177642,"real_estate":0.052756,"gold":0.0013078594,"inflation":0.0145444},{"year":1937,"sp500":-0.3505627555,"small_cap":-0.5892,"tbills":0.003,"bond10":0.0137857219,"baa_corp_bond":-0.0559283552,"real_estate":0.051488,"gold":0.0013068778,"inflation":0.0285714},{"year":1938,"sp500":0.2927523107,"small_cap":0.3247,"tbills":0.0008,"bond10":0.0421489998,"baa_corp_bond":0.0962473795,"real_estate":-0.017396,"gold":0.0013060126,"inflation":-0.0277778},{"year":1939,"sp500":-0.0110305013,"small_cap":-0.0927,"tbills":0.0004,"bond10":0.0440995121,"baa_corp_bond":0.0436361639,"real_estate":-0.036399,"gold":0.0013044481,"inflation":0.0},{"year":1940,"sp500":-0.1030516152,"small_cap":-0.1795,"tbills":0.0003,"bond10":0.0540242357,"baa_corp_bond":0.0524024363,"real_estate":0.012359,"gold":0.0013030574,"inflation":0.0071429},{"year":1941,"sp500":-0.0977844374,"small_cap":-0.0093,"tbills":0.0008,"bond10":-0.0202111921,"baa_corp_bond":-0.0502589569,"real_estate":0.046146,"gold":0.0013024177,"inflation":0.0992908},{"year":1942,"sp500":0.2444956072,"small_cap":0.4462,"tbills":0.0034,"bond10":0.0228949761,"baa_corp_bond":0.0653849728,"real_estate":0.06222,"gold":0.0013003984,"inflation":0.0903226},{"year":1943,"sp500":0.2269838982,"small_cap":1.0105,"tbills":0.0038,"bond10":0.0248590216,"baa_corp_bond":0.0322335102,"real_estate":0.048408,"gold":0.0012995595,"inflation":0.0294118},{"year":1944,"sp500":0.330950162,"small_cap":0.4572,"tbills":0.0038,"bond10":0.021281634,"baa_corp_bond":0.0379806114,"real_estate":0.053735,"gold":0.0012979054,"inflation":0.0228571},{"year":1945,"sp500":0.3960042329,"small_cap":0.6505,"tbills":0.0038,"bond10":0.026597755,"baa_corp_bond":0.0265813884,"real_estate":0.03462,"gold":0.0012964286,"inflation":0.0223464},{"year":1946,"sp500":-0.1136433174,"small_cap":-0.0824,"tbills":0.0038,"bond10":0.0072601269,"baa_corp_bond":0.0138269838,"real_estate":0.006382,"gold":0.0012950368,"inflation":0.181315},{"year":1947,"sp500":0.0009792954,"small_cap":-0.0595,"tbills":0.0057,"bond10":-0.0119121621,"baa_corp_bond":0.0127270796,"real_estate":-0.007362,"gold":0.0012937203,"inflation":0.0883739},{"year":1948,"sp500":0.1030804611,"small_cap":0.1595,"tbills":0.0102,"bond10":0.0347517541,"baa_corp_bond":0.0321350659,"real_estate":0.101205,"gold":0.001292475,"inflation":0.0299447},{"year":1949,"sp500":0.1903961913,"small_cap":0.3049,"tbills":0.011,"bond10":0.0645157215,"baa_corp_bond":0.0309946603,"real_estate":0.091351,"gold":0.001290038,"inflation":-0.0208986},{"year":1950,"sp500":0.3047127692,"small_cap":0.4775,"tbills":0.012,"bond10":0.0042888047,"baa_corp_bond":0.0043324983,"real_estate":0.108924,"gold":0.0012870216,"inflation":0.0593156},{"year":1951,"sp500":0.2367865718,"small_cap":0.0807,"tbills":0.0148,"bond10":-0.0030444829,"baa_corp_bond":0.013846222,"real_estate":0.077243,"gold":0.0012868369,"inflation":0.0600273},{"year":1952,"sp500":0.1815225839,"small_cap":0.0366,"tbills":0.0167,"bond10":0.0226858671,"baa_corp_bond":0.023299417,"real_estate":0.075389,"gold":0.0012866522,"inflation":0.0075171},{"year":1953,"sp500":-0.0120672388,"small_cap":-0.0655,"tbills":0.0189,"bond10":0.0414089251,"baa_corp_bond":0.0310584227,"real_estate":0.035398,"gold":0.0012849936,"inflation":0.0074616},{"year":1954,"sp500":0.5261657487,"small_cap":0.6058,"tbills":0.0096,"bond10":0.0329338552,"baa_corp_bond":0.0359671363,"real_estate":0.015051,"gold":0.0012802458,"inflation":-0.0074074},{"year":1955,"sp500":0.3155986976,"small_cap":0.2077,"tbills":0.0166,"bond10":-0.0133674575,"baa_corp_bond":0.0046887144,"real_estate":0.000978,"gold":0.0012825029,"inflation":0.0037313},{"year":1956,"sp500":0.0655500411,"small_cap":0.045,"tbills":0.0256,"bond10":-0.0226435027,"baa_corp_bond":-0.0143651474,"real_estate":-0.000978,"gold":0.0012823184,"inflation":0.0297398},{"year":1957,"sp500":-0.1078457694,"small_cap":-0.1376,"tbills":0.0323,"bond10":0.0680102606,"baa_corp_bond":0.0727148227,"real_estate":-0.008811,"gold":0.0012759171,"inflation":0.0288809},{"year":1958,"sp500":0.4335610986,"small_cap":0.7069,"tbills":0.0178,"bond10":-0.0210290284,"baa_corp_bond":-0.0061567309,"real_estate":0.000988,"gold":0.0012779221,"inflation":0.0179971},{"year":1959,"sp500":0.1196361174,"small_cap":0.1096,"tbills":0.0333,"bond10":-0.0264580602,"baa_corp_bond":-0.0072156028,"real_estate":0.012833,"gold":0.0012777384,"inflation":0.0176782},{"year":1960,"sp500":0.0036448003,"small_cap":-0.0391,"tbills":0.027,"bond10":0.1163929504,"baa_corp_bond":0.1118760642,"real_estate":0.009768,"gold":0.0012760886,"inflation":0.0145749},{"year":1961,"sp500":0.278061248,"small_cap":0.343,"tbills":0.0213,"bond10":0.0205556398,"baa_corp_bond":0.0430431367,"real_estate":0.015644,"gold":0.0012724542,"inflation":0.0069662},{"year":1962,"sp500":-0.0802071618,"small_cap":-0.1623,"tbills":0.0273,"bond10":0.0569095491,"baa_corp_bond":0.0701524028,"real_estate":0.017321,"gold":0.0012724542,"inflation":0.0138408},{"year":1963,"sp500":0.2232397588,"small_cap":0.2318,"tbills":0.0312,"bond10":0.0168005392,"baa_corp_bond":0.0292652827,"real_estate":0.008516,"gold":0.0012708377,"inflation":0.0167015},{"year":1964,"sp500":0.1647951411,"small_cap":0.1442,"tbills":0.0354,"bond10":0.0372759267,"baa_corp_bond":0.0437647814,"real_estate":0.024672,"gold":0.0012708377,"inflation":0.0097297},{"year":1965,"sp500":0.1244980926,"small_cap":0.3548,"tbills":0.0406,"bond10":0.0071591559,"baa_corp_bond":0.0247594946,"real_estate":0.024078,"gold":0.0012684167,"inflation":0.0192251},{"year":1966,"sp500":-0.1005873255,"small_cap":0.034,"tbills":0.0488,"bond10":0.032079671,"baa_corp_bond":0.0350083151,"real_estate":0.031515,"gold":0.0012679352,"inflation":0.0346457},{"year":1967,"sp500":0.2398470814,"small_cap":0.8386,"tbills":0.0433,"bond10":-0.0918355374,"baa_corp_bond":-0.0554802277,"real_estate":0.033768,"gold":0.0012655281,"inflation":0.0303717},{"year":1968,"sp500":0.1106145923,"small_cap":0.3835,"tbills":0.0526,"bond10":-0.0304233873,"baa_corp_bond":0.0212534071,"real_estate":0.041331,"gold":0.0012644466,"inflation":0.0471865},{"year":1969,"sp500":-0.0850117803,"small_cap":-0.2831,"tbills":0.0666,"bond10":-0.0809485767,"baa_corp_bond":-0.0131626597,"real_estate":0.044525,"gold":0.0012588189,"inflation":0.0619883},{"year":1970,"sp500":0.0400938361,"small_cap":-0.1779,"tbills":0.065,"bond10":0.1669725295,"baa_corp_bond":0.233664605,"real_estate":0.026653,"gold":0.0012533659,"inflation":0.0556703},{"year":1971,"sp500":0.1431298209,"small_cap":0.1676,"tbills":0.0436,"bond10":0.0936100461,"baa_corp_bond":0.0915337759,"real_estate":0.045127,"gold":0.128218718,"inflation":0.0327418},{"year":1972,"sp500":0.189794043,"small_cap":0.0443,"tbills":0.0434,"bond10":0.0550034812,"baa_corp_bond":0.0789519324,"real_estate":0.049372,"gold":0.4351048826,"inflation":0.0340894},{"year":1973,"sp500":-0.1459768516,"small_cap":-0.309,"tbills":0.0703,"bond10":0.0447836787,"baa_corp_bond":0.0458049646,"real_estate":0.042871,"gold":0.6669472727,"inflation":0.0870556},{"year":1974,"sp500":-0.2646810058,"small_cap":-0.1985,"tbills":0.0787,"bond10":0.0203062023,"baa_corp_bond":0.0163427274,"real_estate":0.039157,"gold":0.7229507623,"inflation":0.1233821},{"year":1975,"sp500":0.3720226905,"small_cap":0.5217,"tbills":0.0584,"bond10":0.0361361976,"baa_corp_bond":0.1230838727,"real_estate":0.022895,"gold":-0.2560472909,"inflation":0.0694149},{"year":1976,"sp500":0.2383802232,"small_cap":0.5738,"tbills":0.0499,"bond10":0.159836528,"baa_corp_bond":0.1764077056,"real_estate":0.071324,"gold":-0.0410740199,"inflation":0.0486468},{"year":1977,"sp500":-0.0718499769,"small_cap":0.2538,"tbills":0.0527,"bond10":0.0129015234,"baa_corp_bond":0.0186329418,"real_estate":0.110497,"gold":0.2340765193,"inflation":0.0670146},{"year":1978,"sp500":0.0655780604,"small_cap":0.2339,"tbills":0.0716,"bond10":-0.0077542189,"baa_corp_bond":0.0109352343,"real_estate":0.116514,"gold":0.3695598665,"inflation":0.0901793},{"year":1979,"sp500":0.1843586713,"small_cap":0.4887,"tbills":0.1022,"bond10":0.0067411014,"baa_corp_bond":0.036698901,"real_estate":0.144557,"gold":1.2570425415,"inflation":0.1329398},{"year":1980,"sp500":0.3242407561,"small_cap":0.3988,"tbills":0.1149,"bond10":-0.0249663992,"baa_corp_bond":0.0448063636,"real_estate":0.08733,"gold":0.1707182983,"inflation":0.1251633},{"year":1981,"sp500":-0.0491062939,"small_cap":0.1481,"tbills":0.142,"bond10":0.0616272685,"baa_corp_bond":0.0420939453,"real_estate":0.090681,"gold":-0.3280331988,"inflation":0.0892255},{"year":1982,"sp500":0.2140529916,"small_cap":0.2801,"tbills":0.1101,"bond10":0.3258759384,"baa_corp_bond":0.3681978855,"real_estate":0.037437,"gold":0.1183928571,"inflation":0.0382972},{"year":1983,"sp500":0.2251326155,"small_cap":0.3967,"tbills":0.0859,"bond10":0.0820152216,"baa_corp_bond":0.1862416708,"real_estate":0.032339,"gold":-0.1451166329,"inflation":0.0379095},{"year":1984,"sp500":0.0627430519,"small_cap":-0.0627,"tbills":0.0969,"bond10":0.1515307519,"baa_corp_bond":0.1841971775,"real_estate":0.03495,"gold":-0.1866328847,"inflation":0.0394866},{"year":1985,"sp500":0.3215556364,"small_cap":0.2442,"tbills":0.0772,"bond10":0.2498786165,"baa_corp_bond":0.2634895011,"real_estate":0.054358,"gold":0.0604332958,"inflation":0.0380414},{"year":1986,"sp500":0.1846956244,"small_cap":0.0363,"tbills":0.0616,"bond10":0.244404459,"baa_corp_bond":0.1994354598,"real_estate":0.075866,"gold":0.2168879251,"inflation":0.011039},{"year":1987,"sp500":0.0523322079,"small_cap":-0.0949,"tbills":0.0547,"bond10":-0.0399600929,"baa_corp_bond":0.0279477013,"real_estate":0.072176,"gold":0.2445787631,"inflation":0.0442951},{"year":1988,"sp500":0.1681235206,"small_cap":0.2294,"tbills":0.0635,"bond10":0.086357543,"baa_corp_bond":0.1294051865,"real_estate":0.068929,"gold":-0.1539408867,"inflation":0.0441996},{"year":1989,"sp500":0.3147620087,"small_cap":0.0969,"tbills":0.0837,"bond10":0.1775320877,"baa_corp_bond":0.1887114867,"real_estate":0.05373,"gold":-0.0270836083,"inflation":0.0464752},{"year":1990,"sp500":-0.0306399047,"small_cap":-0.2136,"tbills":0.0781,"bond10":0.062381439,"baa_corp_bond":0.0123113043,"real_estate":-0.004687,"gold":-0.0578537783,"inflation":0.0610693},{"year":1991,"sp500":0.3023382174,"small_cap":0.4463,"tbills":0.056,"bond10":0.1500248071,"baa_corp_bond":0.2295037123,"real_estate":0.013934,"gold":-0.0458266668,"inflation":0.0306422},{"year":1992,"sp500":0.0749432219,"small_cap":0.2316,"tbills":0.0351,"bond10":0.0936218476,"baa_corp_bond":0.1202709328,"real_estate":0.026148,"gold":-0.0596438515,"inflation":0.0290075},{"year":1993,"sp500":0.0996759779,"small_cap":0.2136,"tbills":0.029,"bond10":0.1421074164,"baa_corp_bond":0.1833140198,"real_estate":0.025196,"gold":0.1751544532,"inflation":0.0274899},{"year":1994,"sp500":0.0132597948,"small_cap":-0.0182,"tbills":0.039,"bond10":-0.0803792561,"baa_corp_bond":-0.0541900704,"real_estate":0.008582,"gold":-0.0230482799,"inflation":0.0266667},{"year":1995,"sp500":0.3719520038,"small_cap":0.2593,"tbills":0.056,"bond10":0.2347777985,"baa_corp_bond":0.2655471416,"real_estate":0.024582,"gold":0.0081959823,"inflation":0.0254355},{"year":1996,"sp500":0.2268087394,"small_cap":0.1546,"tbills":0.0521,"bond10":0.014273937,"baa_corp_bond":0.0146376569,"real_estate":0.025573,"gold":-0.0443224486,"inflation":0.0331601},{"year":1997,"sp500":0.334330042,"small_cap":0.212,"tbills":0.0526,"bond10":0.099356179,"baa_corp_bond":0.1432741128,"real_estate":0.030133,"gold":-0.2174408696,"inflation":0.0170223},{"year":1998,"sp500":0.2833576082,"small_cap":-0.0179,"tbills":0.0486,"bond10":0.1491965891,"baa_corp_bond":0.0869302953,"real_estate":0.03299,"gold":-0.0077649765,"inflation":0.0161197},{"year":1999,"sp500":0.2088540533,"small_cap":0.1962,"tbills":0.0468,"bond10":-0.0824784089,"baa_corp_bond":-0.0201196179,"real_estate":0.03518,"gold":-0.0014020346,"inflation":0.0268449},{"year":2000,"sp500":-0.0903189542,"small_cap":-0.0178,"tbills":0.0593,"bond10":0.1665643057,"baa_corp_bond":0.0959853221,"real_estate":0.043077,"gold":-0.0559633028,"inflation":0.033871},{"year":2001,"sp500":-0.1185014947,"small_cap":0.1969,"tbills":0.0383,"bond10":0.0557194167,"baa_corp_bond":0.0712522935,"real_estate":0.065753,"gold":0.0098358899,"inflation":0.0155178},{"year":2002,"sp500":-0.2196609039,"small_cap":-0.1851,"tbills":0.0165,"bond10":0.1511652586,"baa_corp_bond":0.1581367837,"real_estate":0.065602,"gold":0.2495888158,"inflation":0.0237691},{"year":2003,"sp500":0.2835580419,"small_cap":0.7389,"tbills":0.0102,"bond10":0.0041481344,"baa_corp_bond":0.0447258177,"real_estate":0.054523,"gold":0.1955010672,"inflation":0.0187956},{"year":2004,"sp500":0.107428741,"small_cap":0.1917,"tbills":0.012,"bond10":0.0434351472,"baa_corp_bond":0.0926824102,"real_estate":0.114464,"gold":0.0439407802,"inflation":0.0325558},{"year":2005,"sp500":0.0483392041,"small_cap":0.0316,"tbills":0.0298,"bond10":0.0236596566,"baa_corp_bond":0.0325128902,"real_estate":0.133854,"gold":0.1768935021,"inflation":0.0341557},{"year":2006,"sp500":0.156125604,"small_cap":0.0392,"tbills":0.0476,"bond10":0.0196289231,"baa_corp_bond":0.0429637296,"real_estate":0.073944,"gold":0.2308207232,"inflation":0.0254077},{"year":2007,"sp500":0.0548442631,"small_cap":-0.0895,"tbills":0.0453,"bond10":0.1020896958,"baa_corp_bond":0.0440211796,"real_estate":0.080265,"gold":0.3145942824,"inflation":0.0408131},{"year":2008,"sp500":-0.3655237617,"small_cap":-0.3228,"tbills":0.0137,"bond10":0.2010076344,"baa_corp_bond":0.0027352424,"real_estate":-0.051761,"gold":0.0415134726,"inflation":0.0009144},{"year":2009,"sp500":0.2593525059,"small_cap":0.4342,"tbills":0.0015,"bond10":-0.1112233623,"baa_corp_bond":0.168308823,"real_estate":-0.036989,"gold":0.2370070401,"inflation":0.0272147},{"year":2010,"sp500":0.148211917,"small_cap":0.2859,"tbills":0.0014,"bond10":0.0846437508,"baa_corp_bond":0.1508933038,"real_estate":-0.031448,"gold":0.2843174157,"inflation":0.0149574},{"year":2011,"sp500":0.0209829681,"small_cap":-0.0418,"tbills":0.0005,"bond10":0.168596904,"baa_corp_bond":0.1297250613,"real_estate":-0.025013,"gold":0.0992671867,"inflation":0.0295862},{"year":2012,"sp500":0.1589052973,"small_cap":0.1652,"tbills":0.0009,"bond10":0.0229700301,"baa_corp_bond":0.1380986911,"real_estate":0.048759,"gold":0.059445132,"inflation":0.0174107},{"year":2013,"sp500":0.3214511904,"small_cap":0.4005,"tbills":0.0006,"bond10":-0.0910469274,"baa_corp_bond":-0.0439827403,"real_estate":0.111273,"gold":-0.2778834013,"inflation":0.0150162},{"year":2014,"sp500":0.135244222,"small_cap":0.0576,"tbills":0.0003,"bond10":0.1074801468,"baa_corp_bond":0.1537739011,"real_estate":0.070599,"gold":-0.0193974644,"inflation":0.007567},{"year":2015,"sp500":0.0135619459,"small_cap":-0.0408,"tbills":0.0005,"bond10":0.0128433626,"baa_corp_bond":-0.0118496159,"real_estate":0.049705,"gold":-0.1158929286,"inflation":0.0072953},{"year":2016,"sp500":0.117670569,"small_cap":0.2241,"tbills":0.0033,"bond10":0.0069064954,"baa_corp_bond":0.1095774864,"real_estate":0.052359,"gold":0.0856292987,"inflation":0.0207456},{"year":2017,"sp500":0.2160536909,"small_cap":0.1238,"tbills":0.0098,"bond10":0.0280176026,"baa_corp_bond":0.0987938649,"real_estate":0.060563,"gold":0.1271686302,"inflation":0.0210923},{"year":2018,"sp500":-0.042297936,"small_cap":-0.1292,"tbills":0.0189,"bond10":-0.0001672497,"baa_corp_bond":-0.0225448308,"real_estate":0.061163,"gold":-0.0086069718,"inflation":0.0191016},{"year":2019,"sp500":0.3121173585,"small_cap":0.2619,"tbills":0.0213,"bond10":0.0963578967,"baa_corp_bond":0.1561112942,"real_estate":0.051306,"gold":0.1831487927,"inflation":0.0228513},{"year":2020,"sp500":0.1802321707,"small_cap":0.1802,"tbills":0.0036,"bond10":0.1133195692,"baa_corp_bond":0.1041386394,"real_estate":0.098548,"gold":0.2499924128,"inflation":0.0136203},{"year":2021,"sp500":0.2846889774,"small_cap":0.2241,"tbills":0.0004,"bond10":-0.0441601013,"baa_corp_bond":0.0101608725,"real_estate":0.188646,"gold":-0.0375441642,"inflation":0.0703638},{"year":2022,"sp500":-0.180374618,"small_cap":-0.229,"tbills":0.0209,"bond10":-0.1782818655,"baa_corp_bond":-0.1522813913,"real_estate":0.056518,"gold":0.0054942206,"inflation":0.0645438},{"year":2023,"sp500":0.2606069876,"small_cap":0.0519,"tbills":0.0528,"bond10":0.0387995191,"baa_corp_bond":0.0873565611,"real_estate":0.056784,"gold":0.1326210283,"inflation":0.0335205},{"year":2024,"sp500":0.2487864363,"small_cap":0.087,"tbills":0.0518,"bond10":-0.0163719882,"baa_corp_bond":0.0173640718,"real_estate":0.039634,"gold":0.2595697091,"inflation":0.0288802},{"year":2025,"sp500":0.1772365824,"small_cap":0.1653,"tbills":0.0421,"bond10":0.0779548087,"baa_corp_bond":0.0696273208,"real_estate":0.0157570659,"gold":0.6621579179,"inflation":0.0273508}];

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
  const y = (v) => 260 - ((v - min) / (max - min)) * 220;
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
      <text x="180" y="286" textAnchor="middle" fontSize="13" fill="#0f172a">{h} year</text>
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
          <div key={h} className="border border-slate-100 rounded-xl p-3 md:p-4 relative h-[360px] md:h-[330px]">
            <div className="absolute left-4 top-4 text-xs text-slate-500 font-medium">
              {mode} CAGR
            </div>

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
