$(function(){
  console.log("hello pie chart !!");
  var csvPath = "data/pie.csv";
  d3.csv(csvPath,function(d,idx,label){
    // label => ["name","seat","kanji"]
    d.seat = +d.seat;
    return d;
  },function(err,raw){
    // label名
    console.log(raw.columns);
    console.log(raw);

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
    var path = d3.arc().outerRadius(radius-10).innerRadius(0);
    
    // パターンA
    var arc = g.selectAll(".arc")
      .data(pie(data.self))
      .enter()
      .append("g")
      .attr("class","arc");

      arc.append("path") 
      .attr("d",path)
      .attr("fill",function(d,idx){
        return color(idx);
      });

    // パターンB
    // var arc = g.selectAll(".arc")
    // .data(pie(data.self))
    // .enter()
    // .append("path") 
    // .attr("d",path)
    // .attr("fill",function(d,idx){
    //   return color(idx);
    // });

    var label = d3.arc()
      .outerRadius(radius-10).innerRadius(0);

    arc.append("text")
      .attr("opacity",0)
      .attr("transform",function(d){

        return "translate("+ label.centroid(d) +")";
      })
      .text(function(d){
        console.log(d.data.seat);
        return d.data.seat;
      })
      .transition()
      .ease(d3.easeLinear)
      .delay(500)
      .duration(1000)
      .attr("opacity",1)
    
  })

})