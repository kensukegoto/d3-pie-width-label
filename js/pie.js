$(function(){

  var csvPath = "data/pie.csv";
  d3.csv(csvPath,function(d,idx,label){
    // label => ["name","seat","kanji"]
    d.seat = +d.seat;
    return d;
  },function(err,raw){

    var data = {
      self:[]
    };

    for(var i=0,l=raw.length,d=null;i<l;i++){
      d = raw[i];
      if(d.name==="sum") continue;
      data.self.push(d);
    }

    var color = d3.scaleOrdinal(["#ffd600", "rgba(255,0,0,0.5)"]);
    var id = "#box-pie";

    var width = $(id).width(),
      height = width;

    var svg = d3.select(id).append("svg").attr("width",width).attr("height",height);

    var radius = Math.min(width,height)/2;

    var g = svg.append("g").attr("transform","translate("+width/2+","+height/2+")");

    var pie = d3.pie()
      .sort(null)
      .value(function(d){
        return d.seat;
      });
    
    // ドーナツではなくても innerRadius は必須(ないと表示がおかしくなる)
    var path = d3.arc().outerRadius(radius-10).innerRadius(radius/3);
    
    // パターンA
    // var arc = g.selectAll(".arc")
    //   .data(pie(data.self))
    //   .enter()
    //   .append("g")
    //   .attr("class","arc");

    //   arc.append("path") 
    //   .attr("d",path)
    //   .attr("fill",function(d,idx){
    //     return color(idx);
    //   });

    // パターンB
      var arc = g.selectAll(".arc")
      .data(pie(data.self))
      .enter()
      .append("path") 
      .attr("d",path)
      .attr("fill",function(d,idx){
        return color(idx);
      });

    var label = d3.arc()
      .outerRadius(radius-10).innerRadius(radius/3);

    var labels = g.selectAll(".label")
      .data(pie(data.self))
      .enter()
      .append("text")
      .attr("class","label")
      .attr("writing-mode","tb");
  
      
    labels
      .attr("opacity",function(d){

        const outer = radius - 10;
        const inner = radius / 3;
        const diff = (outer - inner) / 2;
        const r = inner + diff;

        const start = {
          x: r * Math.cos(d.startAngle),
          y: r * Math.sin(d.startAngle)
        }
        const end = {
          x: r * Math.cos(d.endAngle),
          y: r * Math.sin(d.endAngle)
        }
        let distance = Math.pow(end.x - start.x,2) + Math.pow(end.y - start.y,2);
      
        distance = Math.sqrt(distance)
        
        console.log(distance)
        return distance > 36 ? 1 : 0;
      })
      .attr("transform",function(d){
        const [x,y] = label.centroid(d)
        const rad = Math.atan2( y, x );
        let angle = rad * ( 180 / Math.PI ) ;
        
        return `translate(${x},${y}) rotate(${angle + 90})`;
      })
      .text(function(d){
        console.log(d);
        return d.data.kanji;
      })

    
  })

})