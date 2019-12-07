$(function(){

  function getData(url){
    return new Promise((resolve)=>{
      $.ajax({
        url,
        dataType: "JSON",
        cache: false
      })
      .then(json => {
        let kanji = {
          sum : "合計",
          kib: "希望",
          jim : "自民",
          kom : "公明",
          kyo : "共産",
          min : "民主",
          pad : ""
        }
        let data = [];
        for(prop in json){
          let obj = {
            name : prop,
            seat : json[prop],
            kanji : kanji[prop]
          }
          data.push(obj);
        }
        resolve(data)
      })
    })
  }

  getData("data/pie1.json")
  .then( raw =>{

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

    var g = svg.append("g").attr("transform","translate("+width/2+","+height/2+") rotate(-90)");

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
      .append("path");
    drawPie();



    var labels = g.selectAll(".label")
      .data(pie(data.self))
      .enter()
      .append("text")
      .attr("class","label")
      .attr("writing-mode","tb");

    showLabel();

    setTimeout(()=>{

      getData("data/pie2.json")
      .then( raw =>{
          var data = {
            self:[]
          };

          for(var i=0,l=raw.length,d=null;i<l;i++){
            d = raw[i];
            if(d.name==="sum") continue;
            data.self.push(d);
          }
          console.log(data);
          arc.data(pie(data.self))
          drawPie();

          labels.data(pie(data.self))
          showLabel();

      });

    },5000)

    function drawPie(){
      arc
      .attr("d",path)
      .attr("class",function(d){
        return d.data.name;
      })
      .attr("fill",function(d,idx){
        return color(idx);
      });

    }

    function showLabel(){
      // 座標割り出す計算機
      var label = d3.arc()
      .outerRadius(radius-10).innerRadius(radius/3);

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
    }




    
  })

})