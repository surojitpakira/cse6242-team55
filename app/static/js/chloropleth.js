      var margin = 50;

//----------------CHLORO------------------------------------------

        var chloro_height = 500,
            chloro_width = 800;

        var svg5 = d3.select("#chloro").append("svg")
            .attr("width", chloro_width)
            .attr("height", chloro_height)
            .append("g")
            .attr("transform", "translate(" + 275 + "," + 150 + ")"); 

        var chColorScale = d3.scale.quantile()
                    .domain([-0.1,0.1,0.03,0.05,0.07,0.09])
                    .range(colorbrewer.Blues[5]);

        console.log(chColorScale.quantiles())
        
        var projection = d3.geo.albersUsa()
            .scale(1000)
            .translate([150, 100]);
        
        var path = d3.geo.path()
            .projection(projection);

        var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
        
            var data = {
            Name: ["Alabama","Alaska","Arizona","Arkansas","California","Colroado","Connecticut","Delaware","D.C.","Florida","Georgia","Hawaii",
                "Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri",
                "Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
                "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
            Avg: [0.049464326,0.074700234,0.079149595,0.052298621,0.083716324,0.088168134,0.090524551,0.060580358,0.065755933,0.060584255,0.087601078,0.060510054,
                0.047093748,0.078933954,0.063721808,0.023554604,0.072304863,0.055556305,0.054204475,0.053352066,0.079174318,0.081878239,0.068157742,0.093748266,
                0.040664469,0.063912605,0.076668741,0.05995,0.084405478,0.081731633,0.084082063,0.063293647,0.081179148,0.0637693,0.063484571,0.06519812,0.059389022,
                0.081725911,0.064913864,0.077801623,0.053220671,0.069491692,0.054481824,0.065467093,0.072959134,0.082641536,0.074240174,0.081800308,
                0.069228073,0.071948594,0.082248761,],
            StateID: ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN',
                        'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',] 
            }

            var us = {"type":"Topology","transform":{"scale":[0.010489463952493496,0.005238365464986435],"translate":[-171.85342131974025,18.921329380610146]},"objects":{"usStates":{"type":"GeometryCollection","geometries":[{"type":"MultiPolygon","arcs":[[[0]],[[1]]],"properties":{"STATE_ABBR":"HI"}},{"type":"Polygon","arcs":[[2,3,4]],"properties":{"STATE_ABBR":"WA"}},{"type":"Polygon","arcs":[[5,6,7,8,9]],"properties":{"STATE_ABBR":"MT"}},{"type":"Polygon","arcs":[[10,11]],"properties":{"STATE_ABBR":"ME"}},{"type":"Polygon","arcs":[[-10,12,13,14]],"properties":{"STATE_ABBR":"ND"}},{"type":"Polygon","arcs":[[-6,-15,15,16,17,18]],"properties":{"STATE_ABBR":"SD"}},{"type":"Polygon","arcs":[[19,20,-7,-19,21,22]],"properties":{"STATE_ABBR":"WY"}},{"type":"MultiPolygon","arcs":[[[23,24,25,26,27,28]],[[29]]],"properties":{"STATE_ABBR":"WI"}},{"type":"Polygon","arcs":[[-5,30,-8,-21,31,32,33]],"properties":{"STATE_ABBR":"ID"}},{"type":"Polygon","arcs":[[34,35,36,37]],"properties":{"STATE_ABBR":"VT"}},{"type":"Polygon","arcs":[[-16,-14,38,-25,39]],"properties":{"STATE_ABBR":"MN"}},{"type":"Polygon","arcs":[[-34,40,41,42,-3]],"properties":{"STATE_ABBR":"OR"}},{"type":"Polygon","arcs":[[-37,43,-12,44,45]],"properties":{"STATE_ABBR":"NH"}},{"type":"Polygon","arcs":[[46,47,-17,-40,-24,48]],"properties":{"STATE_ABBR":"IA"}},{"type":"Polygon","arcs":[[49,-38,-46,50,51,52]],"properties":{"STATE_ABBR":"MA"}},{"type":"Polygon","arcs":[[53,-22,-18,-48,54,55]],"properties":{"STATE_ABBR":"NE"}},{"type":"Polygon","arcs":[[-50,56,57,58,59,60,-35]],"properties":{"STATE_ABBR":"NY"}},{"type":"Polygon","arcs":[[61,62,63,-60,64,65,66]],"properties":{"STATE_ABBR":"PA"}},{"type":"Polygon","arcs":[[-53,67,68,-57]],"properties":{"STATE_ABBR":"CT"}},{"type":"Polygon","arcs":[[-52,69,-68]],"properties":{"STATE_ABBR":"RI"}},{"type":"Polygon","arcs":[[-65,-59,70,71]],"properties":{"STATE_ABBR":"NJ"}},{"type":"Polygon","arcs":[[72,73,74,75,76]],"properties":{"STATE_ABBR":"IN"}},{"type":"Polygon","arcs":[[-33,77,78,79,-41]],"properties":{"STATE_ABBR":"NV"}},{"type":"Polygon","arcs":[[-32,-20,80,81,-78]],"properties":{"STATE_ABBR":"UT"}},{"type":"Polygon","arcs":[[-80,82,83,-42]],"properties":{"STATE_ABBR":"CA"}},{"type":"Polygon","arcs":[[84,85,-63,86,87,-76]],"properties":{"STATE_ABBR":"OH"}},{"type":"Polygon","arcs":[[88,-49,-29,89,-73,90]],"properties":{"STATE_ABBR":"IL"}},{"properties":{"STATE_ABBR":"DC"}},{"type":"Polygon","arcs":[[-66,-72,91,92]],"properties":{"STATE_ABBR":"DE"}},{"type":"Polygon","arcs":[[93,-87,-62,94,95]],"properties":{"STATE_ABBR":"WV"}},{"type":"Polygon","arcs":[[96,97,-95,-67,-93]],"properties":{"STATE_ABBR":"MD"}},{"type":"Polygon","arcs":[[98,-81,-23,-54,99,100]],"properties":{"STATE_ABBR":"CO"}},{"type":"Polygon","arcs":[[101,-91,-77,-88,-94,102,103]],"properties":{"STATE_ABBR":"KY"}},{"type":"Polygon","arcs":[[-56,104,105,-100]],"properties":{"STATE_ABBR":"KS"}},{"type":"Polygon","arcs":[[-103,-96,-98,106,107,108]],"properties":{"STATE_ABBR":"VA"}},{"type":"Polygon","arcs":[[109,110,111,-105,-55,-47,-89,-102]],"properties":{"STATE_ABBR":"MO"}},{"type":"Polygon","arcs":[[-79,-82,112,113,-83]],"properties":{"STATE_ABBR":"AZ"}},{"type":"Polygon","arcs":[[114,115,-101,-106,-112,116]],"properties":{"STATE_ABBR":"OK"}},{"type":"Polygon","arcs":[[117,-108,118,119,120]],"properties":{"STATE_ABBR":"NC"}},{"type":"Polygon","arcs":[[121,122,123,124,-110,-104,-109,-118]],"properties":{"STATE_ABBR":"TN"}},{"type":"Polygon","arcs":[[-115,125,126,127,128]],"properties":{"STATE_ABBR":"TX"}},{"type":"Polygon","arcs":[[-99,-116,-129,129,-113]],"properties":{"STATE_ABBR":"NM"}},{"type":"Polygon","arcs":[[130,131,132,-123,133]],"properties":{"STATE_ABBR":"AL"}},{"type":"Polygon","arcs":[[134,135,136,-124,-133]],"properties":{"STATE_ABBR":"MS"}},{"type":"Polygon","arcs":[[-122,-121,137,138,139,-134]],"properties":{"STATE_ABBR":"GA"}},{"type":"Polygon","arcs":[[-120,140,-138]],"properties":{"STATE_ABBR":"SC"}},{"type":"Polygon","arcs":[[-111,-125,-137,141,-126,-117]],"properties":{"STATE_ABBR":"AR"}},{"type":"Polygon","arcs":[[-142,-136,142,-127]],"properties":{"STATE_ABBR":"LA"}},{"type":"Polygon","arcs":[[-140,143,-131]],"properties":{"STATE_ABBR":"FL"}},{"type":"MultiPolygon","arcs":[[[144]],[[145,-27]],[[-75,146,-85]]],"properties":{"STATE_ABBR":"MI"}},{"type":"MultiPolygon","arcs":[[[147]],[[148]],[[149]],[[150]],[[151]],[[152]],[[153]],[[154]],[[155]],[[156]],[[157]],[[158]],[[159]],[[160]],[[161]]],"properties":{"STATE_ABBR":"AK"}}]}},"arcs":[[[1352,454],[-41,-2],[-16,57],[27,21],[30,-76]],[[1543,0],[-18,17],[-18,147],[18,94],[63,-53],[39,-87],[-70,-80],[-14,-38]],[[5237,5168],[-197,1],[-139,-59],[-70,-17],[-60,19],[-42,-29],[-49,19],[-13,82],[-39,13]],[[4628,5197],[-55,18],[-1,96],[-46,171],[-22,45],[-10,96],[69,-42],[110,-5],[24,-152],[25,2],[-7,82],[17,45],[-46,93],[20,27],[-26,69],[546,0]],[[5226,5742],[0,-491],[11,-83]],[[6464,5158],[-1,-180]],[[6463,4978],[-667,0],[0,-100]],[[5796,4878],[-25,48],[-24,-33],[-63,1],[-13,-21],[-61,-2],[-32,65],[-63,174],[-31,-44],[-22,58],[21,170],[-54,28],[-80,140],[-29,85],[-1,195]],[[5319,5742],[1144,0]],[[6463,5742],[1,-584]],[[9606,5036],[28,24],[52,90],[-5,32],[31,119],[71,146],[32,-52],[64,32],[42,-55],[-1,-264],[34,-17],[-4,-59],[30,-24],[19,-62],[-80,-53],[-20,-32],[-39,15],[-13,-39],[-38,33],[-11,-69],[-30,-9],[-38,-51],[-35,6],[-6,-40],[-57,-87]],[[9632,4620],[-14,47],[-12,369]],[[6463,5742],[651,0]],[[7114,5742],[13,-62],[-4,-97],[27,-108],[6,-186],[21,-132]],[[7177,5157],[-713,1]],[[7177,5157],[-26,-67],[37,-59],[-1,-339]],[[7187,4692],[0,-81],[-16,-57],[19,-55]],[[7190,4499],[-91,72],[-55,-18],[-51,42],[-530,2]],[[6463,4597],[0,381]],[[5987,4214],[-191,0],[1,191]],[[5797,4405],[-1,473]],[[6463,4597],[1,-382]],[[6464,4215],[-477,-1]],[[7743,4503],[-41,45],[-15,144]],[[7687,4692],[-15,85],[-57,80],[-79,73],[6,105],[-13,54],[20,64],[36,30],[0,112]],[[7585,5295],[35,4],[101,52],[13,-58],[31,-15]],[[7765,5278],[28,-44],[192,-80],[30,-45],[-8,-60],[18,-44]],[[8025,5005],[6,-58],[28,-8],[-19,-118],[-20,-54],[-14,-102],[7,-166]],[[8013,4499],[-270,4]],[[8086,5034],[-26,-94],[-9,21],[35,73]],[[5226,5742],[93,0]],[[5797,4405],[-285,0]],[[5512,4405],[-284,0]],[[5228,4405],[-2,344],[13,66],[-31,63],[37,85],[34,124],[-42,81]],[[9399,4548],[2,146],[-17,23],[11,120],[-4,143]],[[9391,4980],[176,1]],[[9567,4981],[-17,-113],[-36,-31],[2,-34],[-32,-97],[-8,-162]],[[9476,4544],[-77,4]],[[7114,5742],[198,0],[0,71],[31,-8],[25,-118],[69,-17],[6,-21],[79,22],[43,-36],[12,-42],[32,26],[45,-60],[67,41],[11,-32],[58,5],[13,-55],[-48,-22],[-170,-201]],[[7687,4692],[-500,0]],[[5228,4405],[-284,-1]],[[4944,4404],[-402,1]],[[4542,4405],[-14,19],[-4,101],[-15,40],[38,195],[19,274],[-2,174],[64,-11]],[[9567,4981],[39,55]],[[9632,4620],[0,-49]],[[9632,4571],[-45,-32],[-111,5]],[[7665,4095],[-28,45],[-238,-7],[-145,3]],[[7254,4136],[-16,167],[-48,196]],[[7743,4503],[45,-78],[-18,-98],[-67,-35],[9,-87],[-47,-110]],[[9378,4415],[21,133]],[[9632,4571],[8,-39],[-29,-72],[25,-7],[23,-84],[-55,-60],[-8,35],[-3,6]],[[9593,4350],[-14,58],[-40,-1]],[[9539,4407],[-161,8]],[[6655,4024],[0,190],[-191,1]],[[7254,4136],[43,-112]],[[7297,4024],[-642,0]],[[9378,4415],[-4,-100],[5,-60],[-17,-41]],[[9362,4214],[-34,-56]],[[9328,4158],[11,56],[-77,68]],[[9262,4282],[-26,25],[-10,63],[-25,34],[-422,2],[0,51]],[[8779,4457],[87,100],[-20,91],[57,19],[85,-24],[63,7],[66,52],[9,72],[-23,32],[99,136],[57,35],[132,3]],[[8806,3970],[-99,1],[0,174]],[[8707,4145],[0,258]],[[8707,4403],[72,54]],[[9262,4282],[-42,-74],[-4,-78],[42,-72],[-65,-72]],[[9193,3986],[-35,-15]],[[9158,3971],[-352,-1]],[[9539,4407],[0,-78],[-7,-53]],[[9532,4276],[-99,-10],[-71,-52]],[[9593,4350],[-25,-60],[-36,-14]],[[9328,4158],[-26,-36],[29,-36],[-19,-116],[-67,-145],[-64,102],[6,42]],[[9187,3969],[6,17]],[[7991,3605],[4,82],[46,107],[-16,67],[13,39],[1,453]],[[8039,4353],[28,-19],[38,27]],[[8105,4361],[195,-1],[0,-12]],[[8300,4348],[-2,-496]],[[8298,3852],[-1,-59],[-60,-18],[3,-26],[-40,-54],[-20,-59],[-24,35],[-21,-40],[-33,9],[-25,-38],[-25,28],[-61,-25]],[[5512,4405],[-1,-737],[0,-217]],[[5511,3451],[1,-149],[-9,-34],[-56,13],[9,-212]],[[5456,3069],[-120,191],[-242,360],[-150,212],[0,572]],[[5987,4214],[0,-763]],[[5987,3451],[-476,0]],[[5456,3069],[23,-103],[24,-27],[-37,-67],[-1,-78],[-19,-28],[20,-73],[-19,-59]],[[5447,2634],[-230,-35],[-27,133],[-66,98],[-29,-2],[-13,57],[-37,1],[-64,72],[-81,5],[-18,25],[1,108],[-61,100],[-65,176],[18,45],[-39,34],[-31,100],[29,41],[-19,81],[-50,-25],[-7,51],[-69,120],[-11,172],[-49,81],[-4,35],[27,104],[4,91],[-14,103]],[[8300,4348],[125,5]],[[8425,4353],[89,-63],[77,18],[36,45],[80,50]],[[8707,4145],[-34,-193],[-56,-41],[-55,-75],[-27,-110],[-25,-5]],[[8510,3721],[-27,58],[-40,-23],[-89,41],[-21,57],[-35,-2]],[[7886,3449],[-36,55],[-1,80],[-80,103],[23,108],[-48,15],[-11,70],[-60,91],[-8,124]],[[8013,4499],[-3,-33],[29,-113]],[[7991,3605],[-5,-63],[-36,-14],[-1,-63],[-50,28],[-13,-44]],[[9187,3969],[-10,-47],[18,-75],[31,-52],[3,-67],[-2,0],[-2,0]],[[9225,3728],[-58,3],[-1,35],[-8,205]],[[8570,3553],[-32,26],[-34,91],[6,51]],[[8806,3970],[-1,-99],[70,73],[27,-12],[28,34],[43,-72]],[[8973,3894],[-9,-36],[-50,62],[-5,-55],[-44,-77],[-12,16],[-31,-83],[-31,34],[-58,-190],[-93,-68],[-59,9],[-11,47]],[[9225,3728],[-27,-83],[-26,-9],[-62,89],[9,63],[-33,-1],[15,-70],[-18,-32],[-61,32],[8,49]],[[9030,3766],[9,27],[-8,27],[-58,74]],[[6564,3451],[-577,0]],[[6655,4024],[1,-575]],[[6656,3449],[-92,2]],[[7859,3356],[20,15],[10,72],[-3,6]],[[8570,3553],[-73,-81],[-39,-70],[-52,-28]],[[8406,3374],[-270,11],[-128,-2],[-18,-28],[-131,1]],[[7297,4024],[40,-35],[-21,-49],[49,-80],[-2,-409]],[[7363,3451],[-707,-2]],[[9030,3766],[-19,-41],[102,-104],[-19,-121],[17,-56],[28,-7],[11,-71],[-3,0],[-9,1],[-3,0],[-1,0]],[[9134,3367],[-419,-2],[-117,8]],[[8598,3373],[-192,1]],[[7859,3356],[-6,-1],[-5,0],[-18,-95]],[[7830,3260],[-41,94],[-426,0]],[[7363,3354],[0,97]],[[5987,3451],[0,-870],[1,-209]],[[5988,2372],[-193,-2],[-358,220],[10,44]],[[7377,2808],[-73,64],[-66,-14],[-40,-36],[-61,46],[-9,-39],[-56,47],[-17,-25],[-23,53],[-34,-15],[-70,30],[-17,46],[-31,-14],[-30,35],[0,368],[-286,0]],[[6564,3354],[0,97]],[[7363,3354],[18,-208],[-3,-230],[-1,-108]],[[8345,3067],[3,43],[32,46],[92,61],[7,29],[85,39],[34,88]],[[9134,3367],[-16,-111],[44,-21],[-41,-100],[-43,18],[-4,-89],[-83,-98],[-47,-104],[-52,-6]],[[8892,2856],[-104,175],[-107,3],[-24,64],[-117,9],[-79,-37]],[[8461,3070],[-116,-3]],[[8345,3067],[-123,1]],[[8222,3068],[-246,2]],[[7976,3070],[-202,0]],[[7774,3070],[23,27],[-6,50],[39,113]],[[7377,2808],[42,-14],[-1,-102]],[[7418,2692],[1,-196],[50,-183],[-22,-94],[3,-58],[-5,-45]],[[7445,2116],[-29,-63],[-48,-19],[-16,41],[-27,-44],[12,-31],[-61,-114],[-67,-44],[-68,-87],[-59,-217],[30,-174],[-17,-42],[-21,34],[-52,6],[-87,69],[-33,117],[-9,111],[-31,36],[-40,92],[-36,152],[-76,136],[-82,17],[-33,-26],[-46,-146],[-85,67],[-46,67],[-34,170],[-48,54],[-109,178]],[[6227,2456],[-8,41],[340,0],[5,857]],[[6227,2456],[-159,0],[-1,-84],[-79,0]],[[8280,2306],[-248,0],[18,-99]],[[8050,2207],[-17,-39],[-30,27],[-47,-5]],[[7956,2190],[-5,199],[-2,87],[36,573],[-9,21]],[[8222,3068],[41,-405],[27,-115],[-22,-94],[12,-148]],[[7956,2190],[-46,1],[-66,-39]],[[7844,2152],[-26,92],[11,63],[-181,-1],[13,124],[49,109],[-17,151]],[[7693,2690],[1,145],[47,113],[33,122]],[[8461,3070],[-23,-62],[42,-38],[31,-99],[63,-97],[15,-49],[22,-29],[40,-179]],[[8651,2517],[20,-19],[-60,-167],[0,-78]],[[8611,2253],[-46,13],[-20,-43],[-252,28],[-13,55]],[[8892,2856],[-95,-165],[-30,-65],[-116,-109]],[[7693,2690],[-275,2]],[[7844,2152],[-63,36],[-15,-56],[57,3],[2,-94],[55,-50],[4,-56],[-77,79],[-27,-41],[-20,18],[-44,-32],[-67,112],[-65,-44],[-89,48],[-46,-6],[-4,47]],[[8611,2253],[20,-171],[51,-199],[4,-74],[32,-133],[34,-172],[-7,-157],[-28,-150],[-67,-11],[-13,128],[-44,23],[-36,190],[-19,-13],[-37,119],[27,82],[-36,51],[13,136],[-38,56],[-59,140],[-30,32],[-36,-2],[-48,-61],[-43,-9],[-8,42],[-101,110],[-92,-3]],[[7947,5584],[-62,-66],[-1,22],[63,44]],[[7765,5278],[58,49],[39,5],[72,71],[17,-81],[25,19],[50,-12],[28,-63],[70,-16],[47,48],[107,4],[1,-42],[67,2],[38,-100],[-74,14],[-4,-34],[-75,47],[-13,-25],[-58,-5],[-35,-62],[-13,39],[-34,-25],[-53,-106]],[[8105,4361],[53,125],[1,134],[-26,103],[2,75],[24,56],[19,105],[40,11],[53,79],[12,70],[23,8],[59,-53],[59,-27],[20,-125],[-7,-70],[-54,-80],[21,-61],[36,65],[36,25],[31,-54],[19,-156],[-9,-64],[-20,9],[-72,-183]],[[1003,7600],[-41,-35],[-3,80],[-25,58],[33,43],[-71,132],[-5,-36],[-82,-35],[-71,3],[-53,81],[-72,57],[56,59],[-73,47],[-26,41],[16,150],[59,80],[28,15],[-8,43],[27,57],[43,24],[76,-45],[27,7],[75,82],[11,-12],[96,16],[35,44],[-17,95],[-27,29],[44,62],[-39,42],[-17,-28],[-71,-14],[-63,-72],[-75,43],[-76,3],[-64,-26],[-115,29],[-14,57],[-30,19],[7,71],[-79,10],[-58,31],[68,59],[140,64],[11,18],[100,44],[75,11],[17,-17],[-16,-59],[25,-26],[86,7],[9,-21],[79,3],[29,48],[42,-5],[25,27],[57,3],[-9,39],[-78,9],[-35,-22],[-37,37],[3,62],[-56,-12],[-121,23],[-28,83],[-128,94],[-89,49],[6,111],[181,11],[73,40],[42,46],[15,75],[97,101],[93,4],[124,90],[94,-2],[77,13],[101,85],[112,-22],[6,-66],[28,47],[65,-13],[39,-46],[27,22],[66,7],[75,-11],[-6,-43],[72,-16],[50,-36],[42,25],[122,4],[122,-32],[50,-28],[177,-8],[83,-38],[161,28],[65,-21],[31,-30],[84,-40],[37,1],[1,-1783],[52,1],[44,-23],[29,29],[58,2],[-11,-50],[152,-162],[12,-64],[84,49],[23,84],[83,38],[44,-45],[6,-55],[47,-29],[20,-51],[78,-76],[149,-317],[77,-77],[92,-53],[-8,-70],[18,-90],[-35,-71],[-54,-19],[3,171],[-30,51],[-70,-1],[-3,74],[-87,126],[-64,31],[12,32],[-25,84],[-46,79],[-56,35],[-18,83],[-20,-35],[7,-77],[-72,46],[-24,74],[-12,-21],[18,-70],[-62,-16],[-90,57],[-32,59],[-179,120],[35,33],[-14,34],[-75,-36],[-221,79],[-111,-23],[-77,55],[-12,60],[-38,-43],[-69,19],[9,44],[-74,23],[-7,30],[-111,-27],[-32,-40],[25,-31],[-68,-103],[-62,18],[-84,-93],[-147,-70],[-24,21],[24,143],[28,35],[15,64],[-13,36],[92,57],[37,-23],[-1,47],[-50,25],[-110,-70],[-84,-133],[-8,-57],[-49,-53],[-22,28],[-28,-68],[-38,-11],[10,-57],[58,-18],[-17,-67],[-47,-29],[-22,-77],[-67,-11],[-26,-55],[-28,11],[-13,-46],[-28,5],[-49,-50],[4,-51],[-26,0],[-67,-82],[-29,12],[-9,-41],[-52,-4],[-2,-86],[-133,-27],[-79,-75],[-55,-21],[-43,11],[-50,-73],[-36,26],[-13,-41],[-43,37],[65,58],[69,85],[56,23],[60,-15],[19,65],[50,51],[109,84],[39,66],[58,46],[12,158],[46,71],[-4,21],[-104,-51],[-50,51],[2,-73],[-33,-13],[-36,68],[-46,-2],[-39,55],[-96,-62]],[[547,7920],[41,-22],[7,-75],[-47,-27],[-98,45],[61,73],[36,6]],[[732,6812],[-20,-31],[-45,-4],[-9,31],[44,63],[91,25],[16,-56],[-22,-27],[-55,-1]],[[387,6600],[-47,-49],[-6,45],[53,4]],[[73,8497],[-35,-23],[-38,38],[21,35],[68,-23],[59,23],[20,-40],[87,-36],[-46,-67],[-14,34],[-100,64],[-22,-5]],[[2455,7917],[-48,-30],[2,47],[46,-17]],[[1884,7529],[1,-39],[-66,-16],[11,77],[54,-22]],[[3613,7326],[-39,-42],[-52,215],[70,-9],[27,-69],[-6,-95]],[[3429,7458],[92,-45],[10,-52],[-72,21],[-26,-39],[-37,76],[-4,61],[45,33],[82,-46],[1,-44],[-29,-5],[-62,40]],[[1760,7299],[-29,-56],[-43,-23],[-2,41],[-35,6],[-19,83],[104,89],[41,-20],[-6,42],[90,-37],[-1,-74],[-47,-30],[-31,16],[-22,-37]],[[3546,7109],[-68,128],[-4,61],[-25,37],[34,36],[46,-55],[21,-100],[-4,-107]],[[3699,7265],[11,-67],[-22,-33],[-46,-2],[-21,123],[78,-21]],[[3612,7094],[-30,52],[14,25],[-25,45],[12,41],[52,-32],[-19,-51],[-4,-80]],[[3754,6982],[22,-58],[26,6],[-3,-102],[-76,111],[-40,2],[-15,84],[11,82],[73,-64],[2,-61]],[[3837,6948],[-21,26],[11,53],[45,42],[29,-59],[-20,-85],[-44,23]]]}    

            for (var i = 0; i < data.Name.length; i++) {

                for (var j = 0; j < us.objects.usStates.geometries.length; j++)  {
                    var usStateID = us.objects.usStates.geometries[j].properties.STATE_ABBR;
                    if (data.StateID[i] == usStateID) {
                    us.objects.usStates.geometries[j].properties.avg = data.Avg[i]; 
                    us.objects.usStates.geometries[j].properties.name = data.Name[i];
                    break;
                    }
                } 
            } 

            console.log(us.objects.usStates.geometries[0].properties.avg)
              
            svg5.selectAll('.states')
                .data(topojson.feature(us, us.objects.usStates).features)
                .enter()
                .append('path')
                .attr('class', 'states')
                .attr('d', path)
                .style("fill",function(d){
                    return chColorScale(d.properties.avg)
                })
                .on('mouseover', function(d){
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .9);      
                    div.html(d.properties.name + ": " + d3.format(".2f%")(d.properties.avg*100)+"%")    
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");    })
                .on('mouseout', function(d){
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                    });

            var legend = d3.select("#chloro").append("svg")
                .attr("class", "legend")
                .attr("transform", "translate("+ -50 + "," + -150 + ")")
                .attr("width", 140)
                .attr("height", 360)
                .selectAll("g")
                .data(chColorScale.range().slice(0,9))
                .enter()
                .append("g")
                .attr("transform", function(d, i) { return "translate(20," + (250 + i * 20) + ")"; });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d,i) {return chColorScale.range()[i] } );

            var legendText = ["< 3.0%", "3.0 - 4.99%","5.0 - 6.99%","7.0 - 8.99%",">= 9.0%"]

            legend.append("text")
                .data(legendText)
                .attr("x", 55)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("font-size","12px")
                .text(function(d) { return d; });