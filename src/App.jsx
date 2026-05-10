import React, { useMemo, useState } from "react";

const DATA = [{"year":1928,"sp500":0.438111551528879,"small_cap":0.6215,"tbills":0.0308,"bond10":0.00835470858979919,"baa_corp_bond":0.0321955147023243,"real_estate":0.0149105367793241,"gold":0.000968992248062017,"inflation":-0.0115607},{"year":1929,"sp500":-0.0829794661190966,"small_cap":-0.4608,"tbills":0.0316,"bond10":0.0420380415632043,"baa_corp_bond":0.0301785623990404,"real_estate":-0.0205680705190989,"gold":-0.00145208131655383,"inflation":0.005848},{"year":1930,"sp500":-0.251236363636364,"small_cap":-0.4835,"tbills":0.0455,"bond10":0.0454093143489704,"baa_corp_bond":0.00539780946482383,"real_estate":-0.0429999999999999,"gold":0.000969461948618466,"inflation":-0.0639535},{"year":1931,"sp500":-0.438375488917862,"small_cap":-0.4362,"tbills":0.0231,"bond10":-0.0255885596194225,"baa_corp_bond":-0.156807750826676,"real_estate":-0.0815047021943574,"gold":-0.173849878934625,"inflation":-0.0931677},{"year":1932,"sp500":-0.086423645320197,"small_cap":0.2865,"tbills":0.0107,"bond10":0.0879030699047733,"baa_corp_bond":0.235896016757402,"real_estate":-0.104664391353811,"gold":0.212778429073857,"inflation":-0.1027397},{"year":1933,"sp500":0.49982225433526,"small_cap":1.466,"tbills":0.0096,"bond10":0.0185527208918574,"baa_corp_bond":0.129668936975483,"real_estate":-0.0381194409148665,"gold":0.272595456742387,"inflation":0.0076336},{"year":1934,"sp500":-0.0118856569709128,"small_cap":0.2307,"tbills":0.00278333333333333,"bond10":0.0796344261796561,"baa_corp_bond":0.188164292684826,"real_estate":0.0290620871862615,"gold":0.317508545385492,"inflation":0.0151515},{"year":1935,"sp500":0.467404210526316,"small_cap":0.549,"tbills":0.001675,"bond10":0.0447204772965661,"baa_corp_bond":0.133077318656792,"real_estate":0.0976583372622975,"gold":0.0043240126837707,"inflation":0.0298507},{"year":1936,"sp500":0.319434102755026,"small_cap":0.9641,"tbills":0.001725,"bond10":0.0501787540454508,"baa_corp_bond":0.113838158719227,"real_estate":0.0321860145467041,"gold":0.000861079219288019,"inflation":0.0144928},{"year":1937,"sp500":-0.353367287543655,"small_cap":-0.5394,"tbills":0.00275833333333333,"bond10":0.0137914605964605,"baa_corp_bond":-0.0441619168399827,"real_estate":0.0256339122232705,"gold":-0.00229423573272147,"inflation":0.0285714},{"year":1938,"sp500":0.29282654028436,"small_cap":0.0516,"tbills":0.00065,"bond10":0.0421324853220461,"baa_corp_bond":0.092358817136874,"real_estate":-0.0087368136326752,"gold":0.00172463351537799,"inflation":-0.0277778},{"year":1939,"sp500":-0.0109756468797564,"small_cap":-0.0486,"tbills":0.000458333333333333,"bond10":0.0441226139420607,"baa_corp_bond":0.0798313776534612,"real_estate":-0.0130160722569379,"gold":-0.012338593974175,"inflation":0},{"year":1940,"sp500":-0.106728731942215,"small_cap":-0.3288,"tbills":0.000358333333333333,"bond10":0.0540248159628455,"baa_corp_bond":0.0864813717758298,"real_estate":0.0330660768592757,"gold":-0.016560139453806,"inflation":0.0071429},{"year":1941,"sp500":-0.127714555765596,"small_cap":-0.0675,"tbills":0.00129166666666667,"bond10":-0.0202219758485802,"baa_corp_bond":0.050071728572759,"real_estate":-0.0838462773644489,"gold":0,"inflation":0.0992908},{"year":1942,"sp500":0.191737629459148,"small_cap":0.6301,"tbills":0.003425,"bond10":0.0229486823744842,"baa_corp_bond":0.051799010426587,"real_estate":0.0333304121753864,"gold":0,"inflation":0.0903226},{"year":1943,"sp500":0.250613101330604,"small_cap":1.4302,"tbills":0.0038,"bond10":0.0249,"baa_corp_bond":0.080446700601059,"real_estate":0.11446259964946,"gold":0,"inflation":0.0295858},{"year":1944,"sp500":0.19030676949443,"small_cap":0.7115,"tbills":0.0038,"bond10":0.0257761115790703,"baa_corp_bond":0.0656586358825617,"real_estate":0.165842274814195,"gold":0,"inflation":0.0229885},{"year":1945,"sp500":0.358210843373494,"small_cap":0.9441,"tbills":0.0038,"bond10":0.0380441734192372,"baa_corp_bond":0.0679986547781789,"real_estate":0.117773764713561,"gold":0.0254062038404728,"inflation":0.0224719},{"year":1946,"sp500":-0.0842914746543778,"small_cap":-0.1373,"tbills":0.0038,"bond10":0.0312837453756957,"baa_corp_bond":0.0250803297731959,"real_estate":0.241016856775801,"gold":0,"inflation":0.1813187},{"year":1947,"sp500":0.052,"small_cap":-0.0174,"tbills":0.00600833333333333,"bond10":0.00919696806283213,"baa_corp_bond":0.00262120226656942,"real_estate":0.212638810464897,"gold":0,"inflation":0.0883721},{"year":1948,"sp500":0.0570457516339868,"small_cap":-0.0001,"tbills":0.01045,"bond10":0.019510369413175,"baa_corp_bond":0.0343695956051032,"real_estate":0.0205851538551085,"gold":0,"inflation":0.0299145},{"year":1949,"sp500":0.183032236842105,"small_cap":0.276,"tbills":0.01115,"bond10":0.0466348518279731,"baa_corp_bond":0.0537730111796589,"real_estate":0.000893485162443142,"gold":-0.087006626332469,"inflation":-0.0207469},{"year":1950,"sp500":0.308055390113163,"small_cap":0.5281,"tbills":0.0120333333333333,"bond10":0.00429595741710961,"baa_corp_bond":0.0423881730567211,"real_estate":0.0364039252928143,"gold":0.09561375828337,"inflation":0.059322},{"year":1951,"sp500":0.236784630445423,"small_cap":0.0387,"tbills":0.015175,"bond10":-0.00295313922083199,"baa_corp_bond":-0.00190980913013697,"real_estate":0.0604764813683567,"gold":0,"inflation":0.06},{"year":1952,"sp500":0.181509886411443,"small_cap":0.0102,"tbills":0.017225,"bond10":0.0226799619183057,"baa_corp_bond":0.0444124150474008,"real_estate":0.0440668202764978,"gold":-0.00345622119815658,"inflation":0.0075472},{"year":1953,"sp500":-0.0120820474219045,"small_cap":-0.0597,"tbills":0.0189083333333333,"bond10":0.0414384025890885,"baa_corp_bond":0.0162011238184432,"real_estate":0.115165685449958,"gold":0.00693641618497121,"inflation":0.0074906},{"year":1954,"sp500":0.525633212414349,"small_cap":0.6497,"tbills":0.0093752,"bond10":0.0328980345580956,"baa_corp_bond":0.0615790518177076,"real_estate":0.00922722029988465,"gold":0.00574052812858761,"inflation":-0.0074349},{"year":1955,"sp500":0.325973318510284,"small_cap":0.2672,"tbills":0.0172434262948207,"bond10":-0.0133643912886187,"baa_corp_bond":0.0204469000434495,"real_estate":0,"gold":-0.000285388127853836,"inflation":0.0037453},{"year":1956,"sp500":0.0743951187335094,"small_cap":-0.0089,"tbills":0.0262138888888889,"bond10":-0.0225577381731542,"baa_corp_bond":-0.0235265419796208,"real_estate":0.00914285714285712,"gold":-0.0011418783899515,"inflation":0.0298507},{"year":1957,"sp500":-0.10457360188558,"small_cap":-0.1519,"tbills":0.0322456692913386,"bond10":0.0679701284662501,"baa_corp_bond":-0.00718928440254237,"real_estate":0.0271800679501699,"gold":-0.00114318376679046,"inflation":0.0289855},{"year":1958,"sp500":0.437199549887472,"small_cap":0.688,"tbills":0.0176654618473896,"bond10":-0.0209901817552747,"baa_corp_bond":0.0643009289733603,"real_estate":0.00661521499448736,"gold":0.0042918454935621,"inflation":0.0176056},{"year":1959,"sp500":0.120564571635573,"small_cap":0.127,"tbills":0.0338601593625498,"bond10":-0.0264663125913851,"baa_corp_bond":0.0157434308950228,"real_estate":0.00109529025191679,"gold":0,"inflation":0.017301},{"year":1960,"sp500":0.00336535314743695,"small_cap":-0.0357,"tbills":0.028729718875502,"bond10":0.116395036909634,"baa_corp_bond":0.0666318716330343,"real_estate":0.00765864332603927,"gold":0.00484330484330497,"inflation":0.0136054},{"year":1961,"sp500":0.266377129581828,"small_cap":0.2945,"tbills":0.0235248995983936,"bond10":0.0206092080763232,"baa_corp_bond":0.051,"real_estate":0.00977198697068404,"gold":-0.000567054153671753,"inflation":0.0067114},{"year":1962,"sp500":-0.0881146051712089,"small_cap":-0.0978,"tbills":0.0277236947791165,"bond10":0.0569354405400844,"baa_corp_bond":0.0649532799360658,"real_estate":0.00322580645161263,"gold":-0.00056737588652489,"inflation":0.0133333},{"year":1963,"sp500":0.226119270998415,"small_cap":0.1965,"tbills":0.0315602409638554,"bond10":0.0168416207395461,"baa_corp_bond":0.0546448057118623,"real_estate":0.0214362272240087,"gold":-0.00397388589270487,"inflation":0.0164474},{"year":1964,"sp500":0.164154558784324,"small_cap":0.2325,"tbills":0.0354573705179283,"bond10":0.0372806489115408,"baa_corp_bond":0.0516173927228503,"real_estate":0.0125918153200419,"gold":0.000284981476204038,"inflation":0.0097087},{"year":1965,"sp500":0.123992424778761,"small_cap":0.4524,"tbills":0.0394907630522088,"bond10":0.00718855093592635,"baa_corp_bond":0.0319000946225388,"real_estate":0.0165803108808291,"gold":0.000569800569800494,"inflation":0.0192308},{"year":1966,"sp500":-0.0997095423563779,"small_cap":-0.0947,"tbills":0.0485572,"bond10":0.0290794093242996,"baa_corp_bond":-0.0344536159757764,"real_estate":0.0122324159021405,"gold":0.000284738041002486,"inflation":0.0345912},{"year":1967,"sp500":0.238029665131333,"small_cap":1.1587,"tbills":0.0429345381526104,"bond10":-0.0158062099328247,"baa_corp_bond":0.00895226614844683,"real_estate":0.0231621349446123,"gold":-0.0051238257899231,"inflation":0.0303951},{"year":1968,"sp500":0.108148626516015,"small_cap":0.6069,"tbills":0.053376,"bond10":0.0327461969507684,"baa_corp_bond":0.0484514622430974,"real_estate":0.0413385826771653,"gold":0.124749642346209,"inflation":0.0471976},{"year":1969,"sp500":-0.0824137107644906,"small_cap":-0.3295,"tbills":0.0666846774193548,"bond10":-0.0501404932099261,"baa_corp_bond":-0.0202516425079215,"real_estate":0.0699432892249527,"gold":0.0501144746883744,"inflation":0.0619718},{"year":1970,"sp500":0.0356114490549642,"small_cap":-0.1878,"tbills":0.06391,"bond10":0.167547371834123,"baa_corp_bond":0.0564956765698885,"real_estate":0.082155477031802,"gold":-0.0944767441860465,"inflation":0.0557029},{"year":1971,"sp500":0.142211502984265,"small_cap":0.1596,"tbills":0.0433425702811245,"bond10":0.097868966197123,"baa_corp_bond":0.140014661742199,"real_estate":0.0424489795918368,"gold":0.166934189406099,"inflation":0.0326633},{"year":1972,"sp500":0.187553629150749,"small_cap":0.0016,"tbills":0.0406184,"bond10":0.0281844905044498,"baa_corp_bond":0.114090935793897,"real_estate":0.0297572435395459,"gold":0.487849610270518,"inflation":0.0340633},{"year":1973,"sp500":-0.143080474375265,"small_cap":-0.388,"tbills":0.070354435483871,"bond10":0.0365866460241501,"baa_corp_bond":0.0431804048543237,"real_estate":0.0342205323193916,"gold":0.729583975346687,"inflation":0.0870588},{"year":1974,"sp500":-0.25901785750897,"small_cap":-0.269,"tbills":0.0784578313253012,"bond10":0.0198860869323786,"baa_corp_bond":-0.0438071979771917,"real_estate":0.100735294117647,"gold":0.661469933184855,"inflation":0.1233766},{"year":1975,"sp500":0.369951371061844,"small_cap":0.5968,"tbills":0.0578638554216868,"bond10":0.0360525360260337,"baa_corp_bond":0.11049964074145,"real_estate":0.0677370937492643,"gold":-0.24798927613941,"inflation":0.0693642},{"year":1976,"sp500":0.238309990021067,"small_cap":0.4862,"tbills":0.049766,"bond10":0.159845607429092,"baa_corp_bond":0.19752813987098,"real_estate":0.0817783485684067,"gold":-0.0409982174688057,"inflation":0.0486486},{"year":1977,"sp500":-0.0697970407593523,"small_cap":0.3029,"tbills":0.0526096385542169,"bond10":0.0128996060710706,"baa_corp_bond":0.0995466285209064,"real_estate":0.146548413003247,"gold":0.22639405204461,"inflation":0.0670103},{"year":1978,"sp500":0.0650928391167193,"small_cap":0.2889,"tbills":0.071783064516129,"bond10":-0.00777580690750876,"baa_corp_bond":0.0313758497716909,"real_estate":0.157235960531124,"gold":0.370112155198545,"inflation":0.0901771},{"year":1979,"sp500":0.185194901675164,"small_cap":0.4169,"tbills":0.100542741935484,"bond10":0.00670720312472355,"baa_corp_bond":-0.0200911014366154,"real_estate":0.137424669070239,"gold":1.26548672566372,"inflation":0.1329394},{"year":1980,"sp500":0.31735245506763,"small_cap":0.4192,"tbills":0.1139188,"bond10":-0.0298974425199941,"baa_corp_bond":-0.0331567833719105,"real_estate":0.0739686726359872,"gold":0.15185546875,"inflation":0.125163},{"year":1981,"sp500":-0.0470239024749558,"small_cap":-0.0429,"tbills":0.140361847389558,"bond10":0.0819921533589235,"baa_corp_bond":0.0846239948089121,"real_estate":0.0509500624757637,"gold":-0.325985587113184,"inflation":0.0892236},{"year":1982,"sp500":0.204190550795594,"small_cap":0.2685,"tbills":0.1109,"bond10":0.328145494862956,"baa_corp_bond":0.290524556559087,"real_estate":0.00563720968370118,"gold":0.15622641509434,"inflation":0.0382979},{"year":1983,"sp500":0.223371558589306,"small_cap":0.3486,"tbills":0.0895,"bond10":0.0320020944514293,"baa_corp_bond":0.161942896227984,"real_estate":0.047494802071018,"gold":-0.167972149695387,"inflation":0.0379098},{"year":1984,"sp500":0.0614614199963621,"small_cap":-0.145,"tbills":0.0992,"bond10":0.137333643441024,"baa_corp_bond":0.156192073324542,"real_estate":0.0467813497314549,"gold":-0.193776150627615,"inflation":0.0394867},{"year":1985,"sp500":0.31235149485769,"small_cap":0.2451,"tbills":0.0772,"bond10":0.257124882126064,"baa_corp_bond":0.238626418499165,"real_estate":0.0747137120761452,"gold":0.0600064871878041,"inflation":0.0379867},{"year":1986,"sp500":0.184945787580462,"small_cap":0.0209,"tbills":0.0615,"bond10":0.242842151417676,"baa_corp_bond":0.221461460054762,"real_estate":0.0961235750981648,"gold":0.189565483476132,"inflation":0.010979},{"year":1987,"sp500":0.0581272164182187,"small_cap":-0.14,"tbills":0.0596,"bond10":-0.0496050893792625,"baa_corp_bond":0.011171968043818,"real_estate":0.0784938770357262,"gold":0.245273311897106,"inflation":0.0443439},{"year":1988,"sp500":0.165371928120447,"small_cap":0.1715,"tbills":0.0689,"bond10":0.0822359584348417,"baa_corp_bond":0.156813847032213,"real_estate":0.0722103538087868,"gold":-0.152551125800455,"inflation":0.0441941},{"year":1989,"sp500":0.314751836381967,"small_cap":0.0696,"tbills":0.0839,"bond10":0.176936471594462,"baa_corp_bond":0.163121157524226,"real_estate":0.0439428470051995,"gold":-0.0283973187081048,"inflation":0.046473},{"year":1990,"sp500":-0.0306445161290321,"small_cap":-0.2777,"tbills":0.0775,"bond10":0.0623537533355336,"baa_corp_bond":0.0564777502055008,"real_estate":-0.00686301423585378,"gold":-0.0311088810837934,"inflation":0.0610626},{"year":1991,"sp500":0.302348431348798,"small_cap":0.4607,"tbills":0.0554,"bond10":0.150045100195173,"baa_corp_bond":0.164000491257606,"real_estate":-0.00168483125361973,"gold":-0.0855774210253755,"inflation":0.0306428},{"year":1992,"sp500":0.0749372797238006,"small_cap":0.2534,"tbills":0.0351,"bond10":0.0936163731620794,"baa_corp_bond":0.136828740004069,"real_estate":0.00817467433152275,"gold":-0.0573410731983577,"inflation":0.0290065},{"year":1993,"sp500":0.0996705147919488,"small_cap":0.2556,"tbills":0.0307,"bond10":0.142109575892631,"baa_corp_bond":0.164445943166928,"real_estate":0.0215657041222026,"gold":0.176779813757885,"inflation":0.0274841},{"year":1994,"sp500":0.0132592067745739,"small_cap":-0.0476,"tbills":0.0437,"bond10":-0.080366555509986,"baa_corp_bond":-0.0123138182601804,"real_estate":0.0251558639407012,"gold":-0.0216975111678366,"inflation":0.026749},{"year":1995,"sp500":0.371951989026063,"small_cap":0.3212,"tbills":0.0566,"bond10":0.234807801125389,"baa_corp_bond":0.200875165710526,"real_estate":0.0179200279727265,"gold":0.00978473581213302,"inflation":0.0253841},{"year":1996,"sp500":0.226809660188658,"small_cap":0.1479,"tbills":0.0515,"bond10":0.0142860779340184,"baa_corp_bond":0.0527960349400217,"real_estate":0.0242538000073596,"gold":-0.0458656330749354,"inflation":0.0332248},{"year":1997,"sp500":0.331036531036531,"small_cap":0.2206,"tbills":0.052,"bond10":0.0993913027297753,"baa_corp_bond":0.112972555283275,"real_estate":0.0402203856749313,"gold":-0.21408259986459,"inflation":0.017024},{"year":1998,"sp500":0.283379532784436,"small_cap":-0.1347,"tbills":0.0491,"bond10":0.149214319226062,"baa_corp_bond":0.0810444638441975,"real_estate":0.0644228997789242,"gold":-0.00827015851137136,"inflation":0.016119},{"year":1999,"sp500":0.208853509920845,"small_cap":0.3771,"tbills":0.0478,"bond10":-0.0825421479626858,"baa_corp_bond":0.00970603341297391,"real_estate":0.0767932672024936,"gold":0.00851285615010422,"inflation":0.0268456},{"year":2000,"sp500":-0.0903181895524928,"small_cap":-0.0913,"tbills":0.06,"bond10":0.166552671253975,"baa_corp_bond":0.0937835962329473,"real_estate":0.0929255992445399,"gold":-0.0544358311800173,"inflation":0.0338681},{"year":2001,"sp500":-0.118497591420002,"small_cap":0.3214,"tbills":0.0348,"bond10":0.0557218118924926,"baa_corp_bond":0.0859664074029728,"real_estate":0.0667604235605559,"gold":0.00746948442339224,"inflation":0.0155172},{"year":2002,"sp500":-0.219660479579127,"small_cap":-0.0361,"tbills":0.0164,"bond10":0.151164003781093,"baa_corp_bond":0.120563245077307,"real_estate":0.0956098401619836,"gold":0.255696202531646,"inflation":0.0237691},{"year":2003,"sp500":0.283558000500102,"small_cap":0.9123,"tbills":0.0103,"bond10":0.00375318588177585,"baa_corp_bond":0.123826413470549,"real_estate":0.0981352879647042,"gold":0.198876728110599,"inflation":0.0187949},{"year":2004,"sp500":0.107427759440962,"small_cap":0.173,"tbills":0.014,"bond10":0.0449068370227455,"baa_corp_bond":0.103294582590471,"real_estate":0.13638284310566,"gold":0.0464864864864865,"inflation":0.0325556},{"year":2005,"sp500":0.0483447752326885,"small_cap":0.0378,"tbills":0.0322,"bond10":0.0286753295977795,"baa_corp_bond":0.0513263668052188,"real_estate":0.135096299284065,"gold":0.177685950413223,"inflation":0.0341566},{"year":2006,"sp500":0.156125579793157,"small_cap":0.184,"tbills":0.0485,"bond10":0.0196100124175684,"baa_corp_bond":0.0526841443325192,"real_estate":0.0173284917938126,"gold":0.231968810916179,"inflation":0.0254065},{"year":2007,"sp500":0.0548473524642177,"small_cap":-0.0911,"tbills":0.0448,"bond10":0.102099219300128,"baa_corp_bond":0.0490492144822019,"real_estate":-0.0539925448482556,"gold":0.319224683544304,"inflation":0.0408127},{"year":2008,"sp500":-0.365523441117982,"small_cap":-0.4468,"tbills":0.014,"bond10":0.20101279926977,"baa_corp_bond":-0.0344450664351114,"real_estate":-0.119952000738451,"gold":0.0431784107946027,"inflation":0.0009141},{"year":2009,"sp500":0.25935233877664,"small_cap":0.4694,"tbills":0.0015,"bond10":-0.111166953132592,"baa_corp_bond":0.199584668218656,"real_estate":-0.0385397000209777,"gold":0.250359298649037,"inflation":0.0272133},{"year":2010,"sp500":0.148210922787194,"small_cap":0.2773,"tbills":0.0014,"bond10":0.0846293388035575,"baa_corp_bond":0.0940192936459607,"real_estate":-0.0411754679030377,"gold":0.292413793103448,"inflation":0.0149572},{"year":2011,"sp500":0.0209837473362805,"small_cap":-0.1404,"tbills":0.0005,"bond10":0.160353349994613,"baa_corp_bond":0.122559515275407,"real_estate":-0.0388548348100636,"gold":0.120241906794735,"inflation":0.0296242},{"year":2012,"sp500":0.158905852417303,"small_cap":0.1896,"tbills":0.0009,"bond10":0.0297157197801895,"baa_corp_bond":0.0939985185209794,"real_estate":0.0643598052707046,"gold":0.0568434423626547,"inflation":0.0174102},{"year":2013,"sp500":0.321450858581255,"small_cap":0.503,"tbills":0.0006,"bond10":-0.0910456879434727,"baa_corp_bond":-0.0112525057643467,"real_estate":0.107186798367877,"gold":-0.276141826923077,"inflation":0.0150174},{"year":2014,"sp500":0.135244216494622,"small_cap":0.0153,"tbills":0.0003,"bond10":0.107461804520047,"baa_corp_bond":0.107464026167149,"real_estate":0.045033619829107,"gold":0.00124533001245331,"inflation":0.0075649},{"year":2015,"sp500":0.0137889164116761,"small_cap":-0.0912,"tbills":0.0005,"bond10":0.0128429967097922,"baa_corp_bond":-0.0150085317944296,"real_estate":0.0519482860129465,"gold":-0.12106135986733,"inflation":0.0072952},{"year":2016,"sp500":0.117730808747982,"small_cap":0.1702,"tbills":0.0032,"bond10":0.00690550469874779,"baa_corp_bond":0.115244739105062,"real_estate":0.0530550939172252,"gold":0.0810377358490566,"inflation":0.0207462},{"year":2017,"sp500":0.216054814344993,"small_cap":0.1513,"tbills":0.0095,"bond10":0.0280171627077895,"baa_corp_bond":0.0915128619730515,"real_estate":0.0620691899279306,"gold":0.126625359979056,"inflation":0.0210908},{"year":2018,"sp500":-0.0422686928908854,"small_cap":-0.1621,"tbills":0.0197,"bond10":-0.000166923857134026,"baa_corp_bond":-0.0318272463554928,"real_estate":0.0451755550562665,"gold":-0.00929512006196742,"inflation":0.0191016},{"year":2019,"sp500":0.312116799968088,"small_cap":0.1192,"tbills":0.0211,"bond10":0.0963563074154839,"baa_corp_bond":0.152477657752785,"real_estate":0.0368521078936699,"gold":0.190774042220485,"inflation":0.0228513},{"year":2020,"sp500":0.180232018274225,"small_cap":0.3416,"tbills":0.0036,"bond10":0.113318976466141,"baa_corp_bond":0.106011874728804,"real_estate":0.10426620677957,"gold":0.241694024950755,"inflation":0.0136201},{"year":2021,"sp500":0.284688517519642,"small_cap":0.2241,"tbills":0.0004,"bond10":-0.0441603444860448,"baa_corp_bond":0.0101609956577657,"real_estate":0.188646236036082,"gold":-0.0375442863941622,"inflation":0.070364},{"year":2022,"sp500":-0.180375059271786,"small_cap":-0.229,"tbills":0.0209,"bond10":-0.178281715382506,"baa_corp_bond":-0.152281348677685,"real_estate":0.0565184302350592,"gold":0.00549420361518593,"inflation":0.064544},{"year":2023,"sp500":0.260606849850241,"small_cap":0.0519,"tbills":0.0528,"bond10":0.0388,"baa_corp_bond":0.0873567220136584,"real_estate":0.0567840493632523,"gold":0.132621168242173,"inflation":0.0335212},{"year":2024,"sp500":0.248786112625267,"small_cap":0.087,"tbills":0.0518,"bond10":-0.0163718014366298,"baa_corp_bond":0.0173635560377851,"real_estate":0.0396341071313775,"gold":0.259570341710046,"inflation":0.0288806},{"year":2025,"sp500":0.177236582375974,"small_cap":0.1653,"tbills":0.0421,"bond10":0.077954808707674,"baa_corp_bond":0.0696273208478481,"real_estate":0.0157570659384501,"gold":0.662157917919452,"inflation":0.0273508}];

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
