$(function(){

  var data = [
    {idx:0,val:79,name:"de"},
    {idx:1,val:21,name:"oth"}
];

  var color = d3.scaleOrdinal(["#ffd600", "rgba(255,255,255,0)"]);

  var id = "#box-pie-anime";
  
  var width = $(id).width(),
    height = width;

  var svg = d3.select(id).append("svg").attr("width", width).attr("height", height);

  var radius = Math.min(width,height)/2;
  // デフォルトでは (0,0) が円の中心になるので描画領域の真ん中に移動
  var g = svg.append("g").attr("transform","translate("+width/2+","+height/2+")");

  var pie = d3.pie()
    .sort(null) // null としないとデータが大きい順に並び替えられてしまう
    .value(function(d){
      return d.val;
    });
  
  var path = d3.arc().innerRadius(radius/3).outerRadius(radius-10);

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class","arc")
    .style("opacity",function(d){
      // ここでは特に意味ない
      // d を使用してデータの中身を取得する例
      // d.data 元データの参照 {idx:0,val:79,name:"de"},
      // d.value 円グラフ要素の値 79
      // d.index 円グラフ要素のインデックス
      // d.startAngle
      // d.endAngle
      console.log(d);
      return (d.data.name==="oth")?1:1;
    });

    arc.append("path")
      .attr("fill",function(d){
        return color(d.data.idx);
      })
      .attr("path",function(d){
        // othだったら透明に（見せたくない）
        return (d.data.name==="oth")?0:1;
      })
      .transition()
      .ease(d3.easeLinear)
      .delay(0) // タイミングをずらせるよ
      .duration(500) // 0にするとアニメーション無しと同じ
      .attrTween("d",function(d){
        // どういう変化をさせるか
        var interpolate = d3.interpolate(
          {
            startAngle:0,
            endAngle:0
          },
          {
            startAngle:d.startAngle,
            endAngle:d.endAngle
          }
        );

        return function(t){
          return path(interpolate(t));
        };
      }) // コールバックをエミュレート
      .call(endall,function(d){
        console.log(d);
        console.log("finish!");
      })


      function endall(transition, callback) { 
        // transition には データのセット先の <path> が入ってる
        // callback ここでは function(){ console.log("finish!"); }
        var n = 0; 
        
        transition 
            .each(function() { 
                // transitionがいくつあるか
                // つまり変化する要素がいくつあるかをカウント
                ++n;
                console.log(n);
            }) 
            .on("end", function(d) { 

                // 各変化要素の変化が end したタイミングで変化要素の数だけ呼ばれる
                // .each でカウントアップした要素を今度はカウントダウン
                // 最後の要素の辺かが end したときに --n は 0 となりコールバックが実行される
                if (!--n) callback.apply(this, arguments);
        }); 
    };



})