function drawGraphic(containerWidth){
	var dispatch = d3.dispatch("load", "changeYear", "changeAssistance");
	var data = d3.map();
	var quantize = d3.scale.quantize()
		.domain([0, 100])
		.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
	var COLORS = 
		{
			"q0-9": "rgb(247,251,255)",
			"q1-9": "rgb(222,235,247)",
			"q2-9": "rgb(198,219,239)",
			"q3-9": "rgb(158,202,225)",
			"q4-9": "rgb(107,174,214)",
			"q5-9": "rgb(66,146,198)",
			"q6-9": "rgb(33,113,181)",
			"q7-9": "rgb(8,81,156)",
			"q8-9": "rgb(8,48,107)"
		}
	var getAssistance = function(){
		var btn = d3.select(".assistance.button");
		if (btn.classed("on")){return "asst"}
		else{ return "noAsst"}
	}

	var getYear = function(){
		return d3.select(".year.button.active").attr("id").replace("_button","")
	}

	d3.selectAll(".year.button")
		.on("click", function(){ 
			d3.select(".year.button.active").classed("active",false)
			d3.select(this).classed("active", true)
			dispatch.changeYear(d3.select(this).attr("id").replace("_button","")); 
		})
	d3.select(".assistance.button")
		.on("click", function(){
		var btn = d3.select(this)
		if(btn.classed("on")){
			btn.classed("on",false)
			btn.classed("off", true)
			dispatch.changeAssistance("noAsst");
		}
		else{
			btn.classed("on",true)
			btn.classed("off", false)
			dispatch.changeAssistance("asst");
		}
		
	});

	dispatch.on("changeAssistance.map", function(asst){
		var year = getYear();
		d3.selectAll("#counties path")
			.transition()
			.style("fill", function(d){ return COLORS[quantize(d.properties[asst +  year])]; })
	})

	dispatch.on("changeYear.map", function(year){
		var asst = getAssistance();
		d3.selectAll("#counties path")
			.transition()
			.style("fill", function(d){ return COLORS[quantize(d.properties[asst + year])]; })
	})
 	dispatch.on("load.map", function(data){
		d3.selectAll("svg").remove()
		var width = containerWidth,
    	height = containerWidth/2,
    	centered;
		var projection = d3.geo.albersUsa()
		    .scale(width)
		    .translate([width / 2, height / 2]);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("rect")
		    .attr("class", "background")
		    .attr("width", width)
		    .attr("height", height)
		    .on("click", clicked);

		var g = svg.append("g");

		d3.json("data/data.json", function(error, us) {
		console.log(us)

		g.append("g")
		    .attr("id", "counties")
		    .selectAll("path")
		      .data(topojson.feature(us, us.objects.UScounties).features)
		    .enter().append("path")
		      .attr("d", path)
		      .style("fill", function(d){ return COLORS[quantize(d.properties.asst2013)]; })
  	          .attr("class", function(d) {
  	          	var ignored = (d.properties.ignore == "1") ? " ignored" : "";
  	          	return ignored;
  	          })
		      .on("click", clicked);
		  g.append("path")
		      .datum(topojson.mesh(us, us.objects.UScounties, function(a, b) { return a !== b; }))
		      .attr("id", "county-borders")
		      .attr("d", path);


		g.append("g")
		    .attr("id", "states")
		    .selectAll("path")
		      .data(topojson.feature(us, us.objects.cb_2013_us_state_500k).features)
		    .enter().append("path")
		      .attr("d", path)
		      .on("click", clicked);
		  g.append("path")
		      .datum(topojson.mesh(us, us.objects.cb_2013_us_state_500k, function(a, b) { return a !== b; }))
		      .attr("id", "state-borders")
		      .attr("d", path);
		});

		function clicked(d) {
		  // console.log("test", d)
		  var x, y, k;

		  if (d && centered !== d) {
		    var centroid = path.centroid(d);
		    x = centroid[0];
		    y = centroid[1];
		    k = 4;
		    centered = d;
		  } else {
		    x = width / 2;
		    y = height / 2;
		    k = 1;
		    centered = null;
		  }

		  g.selectAll("path")
		      .classed("active", centered && function(d) { return d === centered; });

		  g.transition()
		      .duration(750)
		      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		      .style("stroke-width", 1.5 / k + "px");
		}
	});
	dispatch.load(data)
}

pymChild = new pym.Child({ renderCallback: drawGraphic});