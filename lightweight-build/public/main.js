(()=>{"use strict";const r=[{x:10,y:30,r:10,color:"red"},{x:50,y:30,r:20,color:"green"},{x:210,y:30,r:30,color:"blue"}];window.addEventListener("load",(function(){d3.select("svg").selectAll("circle").data(r).join("circle").attr("cx",(r=>r.x)).attr("cy",(r=>r.y)).attr("r",(r=>r.r)).attr("fill",(r=>r.color))}))})();