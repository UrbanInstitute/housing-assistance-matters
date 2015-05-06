var pymChild = null;
var selectedCounties = [];
var BAR_WIDTH = 200.0;
var drawDetail = function(d){
	var detail;
}
function drawGraphic(containerWidth){
	var dispatch = d3.dispatch("load", "changeYear", "changeAssistance", "selectCounty", "deselectCounty");
	var data = d3.map();
	var quantize = d3.scale.quantize()
		.domain([0, 100])
		.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
	var COLORS = 
		{
			"q0-9": "rgb(255,255,255)",
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
	d3.select(".print.button")
		.on("click", function(){
			// console.log(selectedCounties)
			var url = "/detail.html?fips=";
			for(var i = 0; i<selectedCounties.length; i++){
				url += selectedCounties[i].split("_")[1];
				if (i < (selectedCounties.length - 1)){
					url += ",";
				}
			}
			window.open(url);
		});

	dispatch.on("changeAssistance.map", function(asst){
		var year = getYear();
		d3.selectAll("#counties path")
			.transition()
			.style("fill", function(d){ return COLORS[quantize(d.properties[asst +  year])]; })
	});

	dispatch.on("changeYear.map", function(year){
		var asst = getAssistance();
		d3.selectAll("#counties path")
			.transition()
			.style("fill", function(d){ return COLORS[quantize(d.properties[asst + year])]; })
	});
 	dispatch.on("load.map", function(data){
		d3.selectAll("svg").remove()
		var width = containerWidth,
    	height = containerWidth/2,
    	centered;
		var projection = d3.geo.albersUsa()
		    .scale(width)
		    .translate([width / 2, height / 2]);

		// var zoom = d3.behavior.zoom()
  //   		.translate(projection.translate())
  //   		.scale(projection.scale())
  //   		.scaleExtent([height, 8 * height])
  //   		.on("zoom", zoomed);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select(".map.container").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("rect")
		    .attr("class", "background")
		    .attr("width", width)
		    .attr("height", height)
		    .on("click", clicked);

		var g = svg.append("g")
				// .call(zoom);

		d3.json("data/data.json", function(error, us) {
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
		//   		g.append("rect")
		// .attr("height", 1200)
		// .attr("width",650)
		// .attr("x",700)
		// .attr("y",0)
		// .style("fill","#000")
		// .style("opacity",0.5)
		});

		var legend = g.append("g")
			.attr("id", "legend")


		function clicked(d) {
		  dispatch.selectCounty(d);
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
		// function zoomed() {
  // 			projection.translate(d3.event.translate).scale(d3.event.scale);
 	// 		g.selectAll("path").attr("d", path);
		// }
	});
	// dispatch.on("load.key", function(data){
	// 	console.log(svg);
	// })
	dispatch.on("load.details", function(data){
		d3.select(".detail.list")
			.append("li")
			.classed("national", true)
			.classed("show", true)
			.text("The USA data goes here")
		// pymChild.sendHeight();
	})
	dispatch.on("selectCounty.details", function(d){
		d3.selectAll(".garbage").remove();
		console.log(d)
		console.log(getYear())
		console.log(getAssistance())
		var year = getYear();
		var assistance = getAssistance();
		var identifier = (typeof(d) == "undefined") ? null : assistance +  year + "_" + d.id;
		var asst = (typeof(d) == "undefined") ? null : d.properties["asst" + year]
		var noAsst = (typeof(d) == "undefined") ? null : d.properties["noAsst" + year]

		if(typeof(d) != "undefined" && selectedCounties.indexOf(identifier) === -1){
			selectedCounties.push(identifier)
			var li = d3.select(".detail.list")
				 .insert("li",":first-child")
 				.attr("id", identifier)
 				// .classed("ui-state-default", true);

			var wrapper = li.append("div")
				.attr("class", "detail container")
				.style("height", 0)
				.style("opacity", 0)
			wrapper.append("div")
				.attr("class", "detail county close-button")
				.text("X")
				.on("click", function(){dispatch.deselectCounty(identifier)});

			wrapper.append("div")
				.attr("class", "detail county name")
				.text(d.properties.name)
			wrapper.append("div")
				.attr("");

			var total = wrapper.append("div")
				.attr("class", "detail county total bar")
				.classed(year, true);	

			total.append("div")
				.attr("class", "asst bar")
				.style("width", asst + "%");

			total.append("div")
				.datum(d)
				.attr("class", "display bar")
				.attr("data-year", year)
				.style("width", function(){
					if(assistance == "noAsst"){
						return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
					}
					else{
						return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
					}
				})
				.style("background", function(){
					if(assistance == "noAsst"){
						return COLORS[quantize(noAsst)]
					}
					else{
						return COLORS[quantize(asst)]
					}
				})
				.style("border", function(){
					if(assistance == "noAsst"){
						return "1px solid " + COLORS[quantize(noAsst)]
					}
					else{
						return "1px solid " + COLORS[quantize(asst)]
					}
				})

			total.append("div")
				.datum(d)
				.attr("class", "bar marker")
								.style("width", function(){
					if(assistance == "noAsst"){
						return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
					}
					else{
						return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
					}
				})

		 	wrapper
			 	.transition()
			 	.duration(40)
			 	.style("height", "36px")
			 	.style("opacity", 1)
			pymChild.sendHeight();
		}

	});
	dispatch.on("deselectCounty.details", function(identifier){
		var li = d3.select("#" + identifier)
		li.transition()
	 		.duration(200)
		 	.style("height", "0px")
		 	.style("opacity", 0)
		 	.transition()
		 	.duration(0)
		 	.style("display", "none")
		 	.attr("class", "garbage");

		pymChild.sendHeight();
	})

	dispatch.on("changeAssistance.details", function(a){
		// var totalWidth = d3.select("")
		var year = getYear();
		d3.selectAll(".display.bar")
			.transition()
			.style("width", function(d){
				var year = d3.select(this).attr("data-year")
				var asst = d.properties["asst" + year]
				var noAsst = d.properties["noAsst" + year]
				if(a == "noAsst"){
					return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
				}
				else{
					return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
				}
			})
			.style("background", function(d){
				var year = d3.select(this).attr("data-year")
				var asst = d.properties["asst" + year]
				var noAsst = d.properties["noAsst" + year]
				if(a == "noAsst"){
					return COLORS[quantize(noAsst)]
				}
				else{
					return COLORS[quantize(asst)]
				}
			})
			.style("border-color", function(d){
				var year = d3.select(this).attr("data-year")
				var asst = d.properties["asst" + year]
				var noAsst = d.properties["noAsst" + year]
				if(a == "noAsst"){
					return COLORS[quantize(noAsst)]
				}
				else{
					return COLORS[quantize(asst)]
				}
			})
})

	dispatch.load(data);
	// pymChild.sendHeight();
	// console.log(d3.select(".detail.list"))
}

       var stylesheet = $('style[name=impostor_size]')[0].sheet,
            rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style,
            setPadding = function(atHeight) {
                rule.cssText = 'border-top-width: '+atHeight+'px'; 
            };

        $('ul').sortable({
            'placeholder':'marker',
            'start':function(ev, ui) {
                setPadding(ui.item.height());
            },
            'stop':function(ev, ui) {
                var next = ui.item.next();
                next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
                setTimeout(next.css.bind(next, {' -moz-transition':'border-top-width 0.1s ease-in, background .2s ease-out;', '-webkit-transition':'border-top-width 0.1s ease-in, background .2s ease-out;','-o-transition':'border-top-width 0.1s ease-in, background .2s ease-out;','transition':'border-top-width 0.1s ease-in, background .2s ease-out;'})); }
        });

pymChild = new pym.Child({ renderCallback: drawGraphic, polling: 50});

