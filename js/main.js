var STATES = { "Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "WY": "Wyoming" }
var selectedCounties = [];
var BAR_WIDTH = 155.0;
var comma = d3.format(",f")
var dollar = d3.format("$,")
var MASTER_WIDTH = 950;
var usData = {
"id":"national",
"properties":{
	"flagged" : "",
	 "name" : "",
	 "ami2000" : "",
	"ami2006" : "",
	"ami2013" : "",
	 "usdaOnhudOn2000" : "36.79049301",
	"usdaOnhudOff2000" : "15.55506922",
	"usdaOffhudOn2000" : "36.79049301",
	"usdaOffhudOff2000" : "15.55506922",
	"totalPop2000" : "8165441",
	 "usdaOnhudOnNum2000" : "3004106",
	"usdaOnhudOffNum2000" : "1270140",
	"usdaOffhudOnNum2000" : "3004106",
	"usdaOffhudOffNum2000" : "1270140",
	 "usdaOnhudOn2006" : "27.40961712",
	"usdaOnhudOff2006" : "7.505310119",
	"usdaOffhudOn2006" : "25.09719189",
	"usdaOffhudOff2006" : "5.192884892",
	"totalPop2006" : "11455174",
	 "usdaOnhudOnNum2006" : "3139819.333",
	"usdaOnhudOffNum2006" : "859746.3333",
	"usdaOffhudOnNum2006" : "2874927",
	"usdaOffhudOffNum2006" : "594854",
	 "usdaOnhudOn2013" : "29.73269013",
	"usdaOnhudOff2013" : "7.925116481",
	"usdaOffhudOn2013" : "27.31836332",
	"usdaOffhudOff2013" : "5.510789676",
	"totalPop2013" : "11427436.67",
	 "usdaOnhudOnNum2013" : "3397684.333",
	"usdaOnhudOffNum2013" : "905637.6667",
	"usdaOffhudOnNum2013" : "3121788.667",
	"usdaOffhudOffNum2013" : "629742",
	"maxELI2000" : "",
	"minELI2000" : "",
	"maxELI2006" : "",
	"minELI2006" : "",
	"maxELI2013" : "",
	"minELI2013" : "",
	"hud2000" : "",
	"hud2006" : "",
	"hud2013" : "",
	"usda2006" : "",
	"usda2013" : ""
	}
}
var drawDetail = function(d){
	var detail;
}
var dispatch = d3.dispatch("load", "changeYear", "changeAssistance", "selectCounty", "deselectCounty", "zoomIn","zoomOut", "updateTooltip");

function drawGraphic(containerWidth){
//get widths for gutters, max width of details below is 897px
var headerWidth = parseInt(d3.select(".headerRow").style("width").replace("px",""));
var gutterWidth = (containerWidth - 897)/2.0

// d3.select(".text.left")
// 	.style("margin-left", (gutterWidth+18) + "px")
d3.selectAll(".left.gutter").style("width", gutterWidth + "px");
d3.select(".total.header").style("width", (173 + gutterWidth) + "px")
	var data = d3.map();
	var quantize = d3.scale.quantize()
		.domain([0, 100])
		.range(d3.range(5).map(function(i) { return "q" + i + "-5"; }));
	var COLORS = 
		{
			"q0-5": "#b0d5f1",
			"q1-5": "#82c4e9",
			"q2-5": "#1696d2",
			"q3-5": "#00578b",
			"q4-5": "#061b5a",
		}

	var GREYS = 
		{
			"q0-5": "#b0d5f1",
			"q1-5": "#82c4e9",
			"q2-5": "#1696d2",
			"q3-5": "#00578b",
			"q4-5": "#061b5a",
		}

	var threeYearNameUpdate = function(year){
		//moving from 1 yr to 3 yr acs data in 11th hour, so instead of updating all fields, var names, etc, keeping variable names as 2000, 2006, 2013
		//However, for display text we need to update
		if (year == "2000"){
			return "2000";
		}
		else if (year == "2006"){
			return "2006 — '08";
		}
		else if (year == "2013"){
			return "2012 — '14";
		}
	}
	var getAssistance = function(){
		var hud_btn = d3.select(".hud.assistance.button.active");
		var usda_btn = d3.select(".usda.assistance.button.active");
		var usda_str = (usda_btn.classed("turnOn")) ? "usdaOn" : "usdaOff";
		var hud_str = (hud_btn.classed("turnOn")) ? "hudOn" : "hudOff";
		return usda_str + hud_str;
	}

	var getYear = function(){
		return d3.select(".year.button.active").attr("id").replace("button_","")
	}

	d3.selectAll(".year.button")
		.on("click", function(){ 
			d3.select(".year.button.active").classed("active",false)
			d3.select(this).classed("active", true)
			dispatch.changeYear(d3.select(this).attr("id").replace("button_","")); 
		})
	d3.selectAll(".assistance.button")
		.on("click", function(){
		var usda = (d3.select(this).classed("usda")) ? "usda" : "hud"
		d3.select(".assistance.button.active." + usda).classed("active",false)
		d3.select(this).classed("active",true)
		dispatch.changeAssistance(getAssistance())

	
	});
	dispatch.on("changeAssistance", function(assistance){
		dispatch.updateTooltip();

		if(assistance == "usdaOnhudOn"){
			d3.select(".usda.turnOn").classed("active", true)
			d3.select(".usda.turnOff").classed("active", false)
			d3.select(".hud.turnOn").classed("active", true)
			d3.select(".hud.turnOff").classed("active", false)
		}
		else if(assistance == "usdaOffhudOn"){
			d3.select(".usda.turnOn").classed("active", false)
			d3.select(".usda.turnOff").classed("active", true)
			d3.select(".hud.turnOn").classed("active", true)
			d3.select(".hud.turnOff").classed("active", false)		}
		else if(assistance == "usdaOnhudOff"){
			d3.select(".usda.turnOn").classed("active", true)
			d3.select(".usda.turnOff").classed("active", false)
			d3.select(".hud.turnOn").classed("active", false)
			d3.select(".hud.turnOff").classed("active", true)
		}else{
			d3.select(".usda.turnOn").classed("active", false)
			d3.select(".usda.turnOff").classed("active", true)
			d3.select(".hud.turnOn").classed("active", false)
			d3.select(".hud.turnOff").classed("active", true)
		}

	});
	dispatch.on("changeYear", function(year){
		var opacity = (year == "2000") ? 0.3 : 1;
		var pointerEvents = (year == "2000") ? "none" : "auto";
		var display = (year == "2000") ? "none" : "block";
		dispatch.updateTooltip();
		d3.selectAll(".year.button").classed("active", false)
		d3.selectAll("#button_"+year).classed("active", true)
		// var a = getAssistance()
		d3.selectAll(".bar")
			.attr("data-year",year)

		if(d3.select(".usda_only.bar").classed("crossed")){

			d3.selectAll(".unassisted.bar")
			.transition()
			.each("end", function(){ d3.select(this).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOffhudOff" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			d3.selectAll(".usda_only.bar")
			.transition()
			.each("end", function(){ d3.select(this).style("display",display).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			.style("left", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})	  
			d3.selectAll(".hud_only.bar")
			.transition()					
			.each("end", function(){ d3.select(this).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			.style("left", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})	



			d3.select(".us_caption_usda")
				.style("z-index",10)
				.style("pointer-events", pointerEvents)
				.transition()
				.style("opacity",opacity)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_line_usda")
				.style("z-index",10)
				.transition()
				.style("opacity",opacity)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_caption_hud")
				.style("z-index", 9)
				.transition()
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_line_hud")
				.style("z-index", 9)
				.transition()
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
		}else{

			d3.selectAll(".unassisted.bar")
			.transition()
			.each("end", function(){ d3.select(this).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOffhudOff" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			d3.selectAll(".usda_only.bar")
			.transition()
			.each("end", function(){ d3.select(this).style("display",display).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			.style("left", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})	  
			d3.selectAll(".hud_only.bar")
			.transition()					
			.each("end", function(){ d3.select(this).classed("hidden", function(d){ return parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]) < 0.5})})
			.style("width", function(d){
				var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})
			.style("left", function(d){
				var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
				return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
			})	



			d3.select(".us_caption_hud")
				.style("z-index", 10)
				.transition()
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_line_hud")
				.style("z-index", 10)
				.transition()
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_caption_usda")
				.style("pointer-events", pointerEvents)
				.style("z-index",9)
				.transition()
				.style("opacity",opacity)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_line_usda")
				.style("z-index",9)
				.transition()
				.style("opacity",opacity)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
		}


	});
	d3.select(".print.button")
		.on("click", function(){
			var counties = d3.selectAll("#holder li")[0].filter(function(obj){
				return d3.select(obj).classed("dummy") === false && d3.select(obj).classed("garbage") === false && d3.select(obj).classed("national") === false;
			})
			var url = "detail.html?fips=";
			for(var i = 0; i<counties.length; i++){
				url += d3.select(counties[i]).attr("id").split("_")[1];
				if (i < (counties.length - 1)){
					url += ",";
				}
			}
			window.open(url);
		});
	d3.select(".footer.print")
		.on("click", function(){
			var counties = d3.selectAll("#holder li")[0].filter(function(obj){
				return d3.select(obj).classed("dummy") === false && d3.select(obj).classed("garbage") === false && d3.select(obj).classed("national") === false;
			})
			var url = "detail.html?fips=";
			for(var i = 0; i<counties.length; i++){
				url += d3.select(counties[i]).attr("id").split("_")[1];
				if (i < (counties.length - 1)){
					url += ",";
				}
			}
			window.open(url);
		});

	dispatch.on("changeAssistance.map", function(asst){
		var year = getYear();
		d3.selectAll("#counties path")
			.attr("class", function(d){
				var active = (d3.select(this).classed("active")) ? "active ":"";
			    var ignored = (d.properties.flagged == "1") ? " ignored" : "notIgnored";
	          	var fips = "fips_" + d.id;
	          	return active + " " + ignored + " " + fips + " " + quantize(d["properties"][asst+year]) + " " + "state_" + d.properties.STATE_FIPS;
	         })
			.transition()
	      .style("fill", function(d){
	      	return COLORS[quantize(d.properties[asst + year])];
	      })
  	      .style("stroke", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return "#fff";
	      	}
	      	else{
	      		return COLORS[quantize(d.properties[asst + year])];
	      	}
	      })
	      .style("stroke-width", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return ".5px";
	      	}
	      	else{
	      		return "1px"
	      	}
	      })
	});

	dispatch.on("changeYear.map", function(year){
		var a = getAssistance();
		var year = getYear();
		d3.selectAll("#counties path")
			.attr("class", function(d){
				var active = (d3.select(this).classed("active")) ? "active ":"";
			    var ignored = (d.properties.flagged == "1") ? " ignored" : "notIgnored";
	          	var fips = "fips_" + d.id;
	          	return active + " " + ignored + " " + fips + " " + quantize(d["properties"][a+year]) + " " + "state_" + d.properties.STATE_FIPS;
	         })
			.transition()
	      .style("fill", function(d){
	      	return COLORS[quantize(d.properties[a + year])];
	      })
  	      .style("stroke", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return "#fff";
	      	}
	      	else{
	      		return COLORS[quantize(d.properties[a + year])];
	      	}
	      })
	      .style("stroke-width", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return ".5px";
	      	}
	      	else{
	      		return "1px"
	      	}
	      })
	});

	d3.selectAll("svg").remove();
	d3.selectAll(".tooltip").remove();
	d3.selectAll(".custom-combobox").remove();
	d3.selectAll("#combobox").remove();
	d3.selectAll("li.national").remove();
	d3.selectAll(".garbage").remove();

	var width = (containerWidth >= 1070) ? 1070:containerWidth,
	height = width/2;
	var projection = d3.geo.albersUsa()
	    .scale(width)
	    .translate([containerWidth / 2.2, height / 2]);

	var path = d3.geo.path()
	    .projection(projection);

	var svg = d3.select(".map.container").append("svg")
		.attr("id","map-svg")
	    .attr("width", containerWidth)
	    .attr("height", height);

	svg.append("rect")
	    .attr("class", "background")
	    .attr("width", width*.7)
	    .attr("height", height)
	    .on("click", clicked);

	var drag = d3.behavior.drag()
	    .origin(function(d) {return d; })
	    .on("drag", dragmove)
	    .on("dragend", dragend);

	var g = svg.append("g")
	// .call(drag)

	function dragmove(d) {
		d3.selectAll("#counties").classed("grabbing", true);
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
	 	g.transition()
	     	  .attr("transform", "translate(" + width / 2.2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
	}

	function dragend(d){
		d3.selectAll("#counties").classed("grabbing", false);
	}


//broad scope variables to store zoom level (k) and last county clicked, as well as default center county
	var lastClicked;
	var centerCounty;
	var lastK = 1;

	d3.json("data/data.json", function(error, us) {
//Save object corresponding to county containing geographic center of USA, for default zoom in (Smith County, KS)
		centerCounty = topojson.feature(us, us.objects.UScounties).features.filter(function(obj){return obj.id == 20183})[0]
		national = topojson.feature(us, us.objects.UScounties).features.filter(function(obj){return obj.id == "National"})[0]
		lastClicked = centerCounty;
		dispatch.load(topojson.feature(us, us.objects.UScounties).features);

	g.append("g")
	    .attr("id", "states")
	    .selectAll("path")
	      .data(topojson.feature(us, us.objects.cb_2013_us_state_500k).features)
	    .enter().append("path")
	      .attr("d", path)
	      .on("click", clicked);


		g.append("g")
	      .attr("id", "counties")
	      .selectAll("path")
	      .data(topojson.feature(us, us.objects.UScounties).features)
	      .enter().append("path")
	      .attr("d", path)
	      .style("fill", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return COLORS[quantize(d.properties.usdaOnhudOn2013)];
	      	}
	      	else{
	      		// var temp = parseInt(d.properties.STATE_FIPS)%5
	      		// console.log(temp, GREYS[temp])
	      		// return GREYS["q" + temp + "-5"]
	      		return COLORS[quantize(d.properties.usdaOnhudOn2013)];
	      	}
	      })
  	      .style("stroke", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return "#fff";
	      	}
	      	else{
	      		// var temp = parseInt(d.properties.STATE_FIPS)%5
	      		// console.log(temp, GREYS[temp])
	      		// return GREYS["q" + temp + "-5"]
	      		return COLORS[quantize(d.properties.usdaOnhudOn2013)];
	      		// return "#fe0103";
	      		// return "none"
	      	}
	      })
	      .style("stroke-width", function(d){
	      	if(d.properties.flagged !== "1"){
	      		return ".5px";
	      	}
	      	else{
	      		// var temp = parseInt(d.properties.STATE_FIPS)%5
	      		// console.log(temp, GREYS[temp])
	      		// return GREYS["q" + temp + "-5"]
	      		return "1px"
	      	}
	      })
	        // stroke: #333;

	          .attr("class", function(d) {
	          	var ignored = (d.properties.flagged == "1") ? " ignored" : "notIgnored";
	          	var fips = "fips_" + d.id
	          	return ignored + " " + fips + " " + quantize(d.properties.usdaOnhudOn2013) + " " + "state_" + d.properties.STATE_FIPS;
	          })
	      .on("click", clicked)
	      .on("mouseover", function(){
	      	var obj = d3.select(this)
	      	var stateClass = "state_" + obj.attr("class").split("state_")[1].replace(" active","")
	      	// obj.style("fill","#ffda91 !important")
	      	if(obj.classed("ignored")){
	      		d3.selectAll(".ignored." + stateClass).classed("hover", true);
	      		obj.classed("hover",false)
	      		obj.classed("hover2",true)
	      	}
	      	else{
	      		obj.classed("hover",true)
	      	}
	      	dispatch.updateTooltip()
	  	   })
	      .on("mouseout", function(){ d3.selectAll("path.hover").classed("hover", false); d3.selectAll("path.hover2").classed("hover2", false); dispatch.updateTooltip() })
	      .call(drag);
	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.UScounties, function(a, b) { return a !== b; }))
	      .attr("id", "county-borders")
	      .attr("d", path);
	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.cb_2013_us_state_500k, function(a, b) { return (a !== b && a.properties.GEOID != "11" && b.properties.GEOID != "11"); }))
	      .attr("id", "state-borders")
	      .attr("d", path);

	d3.selectAll(".notIgnored").each(function(){ d3.select(this).node().parentNode.appendChild(d3.select(this).node()) })
function foo(selection) {
	// console.log(this)
	// console.log(selection.node())
  selection.node().parentNode.appendChild(selection.node())
}
	});

	var legend = g.append("g")
		.attr("id", "legend")

	function clicked(d) {
		var x,y,k;
		if(typeof(d) == "undefined"){
			d3.select(".tooltip")
				.transition()
				.style("background", "rgba(255,255,255,0)")
			d3.select("div.disclaimer")
					.transition()
					.style("opacity",1)
					.style("height","17px")
			lastClicked = centerCounty;
			lastK = 1;
		    x = width / 2;
		    y = height / 2;
		    k = 1;
		}
		else{
			var year = getYear();
			var assistance = getAssistance();
			var identifier = assistance +  year + "_" + d.id;
			if(d3.select("path.fips_" + d.id).classed("active") == false){
				lastClicked = d;
				d3.select(".tooltip")
					.transition()
					.style("background","rgba(255,255,255,.9)")
					// .style("opacity",".5")
				d3.select("div.disclaimer")
					.transition()
					.style("opacity",0)
					.style("height","0px")
				d3.select("path.fips_" + d.id).classed("active",true)
				dispatch.selectCounty(d)
			    var centroid = path.centroid(d);
			    x = centroid[0];
			    y = centroid[1];
			    k = 4;
			    lastK = 4;
			}
			else{
				d3.select(".tooltip")
					.transition()
					.style("background", "rgba(255,255,255,0)")
				d3.select("div.disclaimer")
					.transition()
					.style("opacity",1)
					.style("height","17px")
					// .style("opacity", "0")
				dispatch.deselectCounty(identifier);
		    	x = width / 2;
		    	y = height / 2;
		    	k = 1;
		    	lastK = 1;		
			}
		}
		  g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2.2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	}

	// var k = 1;
	dispatch.on("zoomIn", function(){
		d3.select(".tooltip")
			.transition()
			.style("background", "rgba(255,255,255,.9)")
		d3.select("div.disclaimer")
			.transition()
			.style("opacity",0)
			.style("height","0px")
		var x,y;
		lastK += 1;
	    var centroid = path.centroid(lastClicked);
	    x = centroid[0];
	    y = centroid[1];
		g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2.2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / lastK + "px");
	})

	dispatch.on("zoomOut", function(){
		var x,y;
		lastK -= 1;
		if (lastK < 1){
			lastK = 1
		}
		else{
			if(lastK == 1){
				d3.select(".tooltip")
					.transition()
					.style("background", "rgba(255,255,255,0)")
				d3.select("div.disclaimer")
					.transition()
					.style("opacity",1)
					.style("height","17px")
					// .style("opacity", "0")
				lastClicked = centerCounty;
				x = width / 2;
		    	y = height / 2;
			}
			else{
			    var centroid = path.centroid(lastClicked);
			    x = centroid[0];
			    y = centroid[1];
			}
			g.transition()
		      .duration(750)
		      .attr("transform", "translate(" + width / 2.2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
		      .style("stroke-width", 1.5 / lastK + "px");
		}
	})


	dispatch.on("load.tooltip", function(data){
		d3.selectAll(".tooltip").remove();
		var width = 26;
		var sidebar = d3.select(".map.container")
			.append("div")
			.attr("class","tooltip")
			// .style("width", width + "%")
			// .style("height", containerWidth/2 + "px")
			// .style("left",(100-width) + "%")
		
		var legend = sidebar.append("div")
			.attr("class","legend container")
		legend.append("div")
			.attr("class", "legendTitle")
			.text("Units per 100 ELI renter households")
		for(var i = 0; i < 6; i += 1){
			legend.append("div")
				.attr("class", "legend key")
				.style("background",COLORS["q" + i + "-5"])
				.datum(i)
				.on("mouseover", function(d){
					d3.selectAll("#states").style("opacity",1)
					for(var j = 0; j < 6; j += 1){
						if(j != d){ d3.selectAll("path.q" + j + "-5").style("opacity",0); }
					}
				})
				.on("mouseout", function(){
					d3.selectAll("#states").style("opacity",0)
					d3.selectAll("#counties path").style("opacity",1)

				})
				.append("span")
				.text((i*20))
		}
		sidebar.append("div")
			.attr("class", "lowPopTop")
			.text("This area represents all counties in the state with fewer than 20,000 people according to the 2011–13 3-year American Community Survey sample.")
		var container = sidebar.append("div")
			.attr("class", "text container")
		container.append("div")
			.attr("class", "defaultTooltip")
			.html("<span class = \"big\">Click to <strong>explore</strong><br>the map</span><br><span class = \"small\">compare affordable housing<br>data for counties below</span>")

		container.append("div")
			.attr("class", "county-name tooltipDetail")
			.text("")
			.style("display", "none")
		container.append("div")
			.attr("class", "state-name tooltipDetail")
			.text("")
			.style("display", "none")
		container.append("div")
			.attr("class", "relative number tooltipDetail")
			.html("<span class = \"tooltipNum\"></span> units for every 100 ELI renter households")
			.style("display", "none")
		container.append("div")
			.attr("class", "total number tooltipDetail")
			.html("<span class = \"tooltipNum\"></span> ELI renter households")
			.style("display", "none")
		container.append("div")
			.attr("class", "ami cutoff tooltipDetail")
			.html("In <span class = \"tooltipYear\"></span>, <span class = \"tooltipNum\"></span>")
		container.append("div")
			.attr("class", "absolute number tooltipDetail")
			.html("<span class = \"tooltipNum\"></span> adequate, affordable, and available units")
			.style("display", "none")




	});

	dispatch.on("updateTooltip", function(){
		hovered = d3.selectAll(".hover")
		var hovered2 = d3.selectAll(".hover2")
		if(hovered[0].length == 0 && selectedCounties.length == 0){
			d3.select(".lowPopTop")
				.transition()
				.style("left","1200px")
			d3.selectAll(".defaultTooltip").style("display","block");
			d3.selectAll(".tooltipDetail").style("display","none");
		}
		else if(hovered2[0].length != 0){
			d3.selectAll(".defaultTooltip").style("display","none");
			d3.selectAll(".tooltipDetail").style("display","block");
			var hData = d3.select(".hover2").data()[0];
			updateText(hData);	
		}
		else if(hovered[0].length != 0){
			d3.selectAll(".defaultTooltip").style("display","none");
			d3.selectAll(".tooltipDetail").style("display","block");
			var hData = d3.select(".hover").data()[0];
			updateText(hData);
		}
		else if(hovered[0].length == 0 && selectedCounties.length != 0){
			d3.selectAll(".defaultTooltip").style("display","none");
			d3.selectAll(".tooltipDetail").style("display","block");
			var clickedID = selectedCounties[selectedCounties.length-1];
			var cData = d3.select("path.fips_" + clickedID.split("_")[1]).data()[0];
			updateText(cData)

		}
		function updateText(d){
			// console.log(d)
			var year = getYear();
			var assistance = getAssistance();
			d3.select(".county-name")
				.text(d["properties"]["name"])
			d3.select(".state-name")
				.text(d["properties"]["STATE_NAME"])
			d3.select(".relative .tooltipNum")
				.text(comma(d["properties"][assistance + year]))
			d3.select(".total .tooltipNum")
				.text(comma(d["properties"]["totalPop" + year]))
			d3.select(".absolute .tooltipNum")
				.text(comma(d["properties"][assistance + "Num" + year]))
			console.log(d, d["properties"][assistance + "Num" + year])
			d3.select(".cutoff .tooltipYear")
				.text(function(){
					if( year == "2006"){
						//ELI cutoff numbers are for 2000, 2007, and 2013 (last year in ranges)
						return "2008"
					}else if (year == "2013") return "2014" 
					else{ return "2000"}
				})
			d3.select(".cutoff .tooltipNum")
				.text(function(){
					var minELI = d["properties"]["minELI" + year]
					var maxELI = d["properties"]["maxELI" + year]
					if (d["properties"]["flagged"] == "0"){
						// console.log(d3.s)
						d3.select(".lowPopTop")
							.transition()
							.style("left","1200px")
						return "ELI households of four earned no more than " + dollar(d["properties"]["ami" + year]) + "."
					}
					else if(minELI == maxELI){
						d3.select(".lowPopTop")
							.transition()
							.style("left","0px")
						return "ELI households of four in these counties earned no more than " + dollar(maxELI) + "."
					}
					else{
						d3.select(".lowPopTop")
							.transition()
							.style("left","0px")
						return "the cut off for an ELI household of four in these counties ranged from " + dollar(minELI) + "-" + dollar(maxELI) + ", depending on location."
					}
				})
		}
	});

	dispatch.on("load.menu", function(data){
		var lookup = {};
		for (var i = 0; i<data.length; i++) {
	    	lookup[data[i].id] = data[i];
		}

	    (function( $ ) {
	      $.widget( "custom.combobox", {
	        _create: function() {
	          this.wrapper = $( "<span>" )
	            .addClass( "custom-combobox" )
	            .insertAfter( this.element );
	   
	          this.element.hide();
	          this._createAutocomplete();
	          this._createShowAllButton();
	        },
	 
	        _createAutocomplete: function() {
	          var selected = this.element.children( ":selected" ),
	            value = selected.val() ? selected.text() : "";
	   
	          this.input = $( "<input>" )
	            .appendTo( this.wrapper )
	            .val( value )
	            .attr( "title", "" )
	            .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
	            .autocomplete({
	              delay: 0,
	              minLength: 0,
	              source: $.proxy( this, "_source" )
	            })
	            .tooltip({
	              tooltipClass: "ui-state-highlight"
	            });
	 
	          this._on( this.input, {
	            autocompleteselect: function( event, ui ) {
	              ui.item.option.selected = true;
	              this._trigger( "select", event, {
	                item: ui.item.option
	              });
	              clicked(lookup[ui.item.option.value])
	            },
	   
	            autocompletechange: "_removeIfInvalid"
	          });
	        },
	 
	        _createShowAllButton: function() {
	          var input = this.input,
	            wasOpen = false;
	   
	          $( "<a>" )
	            .attr( "tabIndex", -1 )
	            .appendTo( this.wrapper )
	            .button({
	              icons: {
	                primary: "ui-icon-triangle-1-s"
	              },
	              text: false
	            })
	            .removeClass( "ui-corner-all" )
	            .addClass( "custom-combobox-toggle ui-corner-right" )
	            .mousedown(function() {
	              wasOpen = input.autocomplete( "widget" ).is( ":visible" );
	            })
	            .click(function() {
	              input.focus();
	   
	              // Close if already visible
	              if ( wasOpen ) {
	                return;
	              }
	   
	              // Pass empty string as value to search for, displaying all results
	              input.autocomplete( "search", "" );
	            });
	        },
	 
	        _source: function( request, response ) {
	          var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	          response( this.element.children( "option" ).map(function() {
	            var text = $( this ).text();
	            if ( this.value && ( !request.term || matcher.test(text) ) )
	              return {
	                label: text,
	                value: text,
	                option: this
	              };
	          }) );
	        },
	 
	        _removeIfInvalid: function( event, ui ) {
	   
	          // Selected an item, nothing to do
	          if ( ui.item ) {
	            return;
	          }
	   
	          // Search for a match (case-insensitive)
	          var value = this.input.val(),
	            valueLowerCase = value.toLowerCase(),
	            valid = false;
	          this.element.children( "option" ).each(function() {
	            if ( $( this ).text().toLowerCase() === valueLowerCase ) {
	              this.selected = valid = true;
	              return false;
	            }
	          });
	   
	          // Found a match, nothing to do
	          if ( valid ) {
	            return;
	          }
	   
	          // Remove invalid value
	          // this.input
	          //   .val( "" )
	          //   .attr( "title", value + " didn't match any item" )
	          //   .tooltip( "open" );
	          this.element.val( "" );
	          this._delay(function() {
	            this.input.tooltip( "close" ).attr( "title", "" );
	          }, 2500 );
	          this.input.autocomplete( "instance" ).term = "";
	        },
	 
	        _destroy: function() {
	          this.wrapper.remove();
	          this.element.show();
	        }
	      });
	    }) (jQuery)

		var select = d3.select(".search.container")
	      .append("div")
	      .classed("ui-widget top-combo", true)
	      .append("select")
	      .attr("id", "combobox")
	      .on("change", function() {  
	        dispatch.selectCounty(function(d){ return this.value });
	      });
	    select.selectAll("option")
	      .data(data)
	      .enter().append("option")
	      .attr("value", function(d) { return d.id; })
	      .text(function(d) { return d.properties.name + ", " + STATES[d.properties.STATE_NAME]; });
	 
	    $(function() {
	      $( "#combobox" ).combobox();
	      $( "#bottomCombobox" ).combobox();
	    }); 
	    $(".custom-combobox input").click(function(){
	     $(this).focus().val('')
	    })
	    d3.selectAll("a.ui-button").remove();
	    var span = d3.select(".search.container span")
	    span.append("div")
	    	.attr("class", "search-icon_background")
	    span.append("img")
	    	.attr("src","images/search-icon.png")
	    	.attr("class","search-icon")
	    d3.select(".custom-combobox-input")
	    	.property("value","Search for counties")
	})
	dispatch.on("deselectCounty.map", function(identifier){
		var id = "fips_" + identifier.split("_")[1]
		d3.select("path." +  id).classed("active",false).classed("dropdown",false)
	})
	dispatch.on("load.details", function(data){
		// var ul = d3.select(".detail.list")
		d3.selectAll(".fips_national").remove()
		d3.selectAll(".bottom_menu").remove()

		var assistance = getAssistance();
		var currentYear = getYear();

		var d = usData;
		var us = d3.select(".national_key")
		drawDetail(us, null, false, currentYear, "national", d)
		var headerWidth = parseInt(d3.select(".headerRow").style("width").replace("px",""));
		var gutterWidth = (containerWidth - 897)/4.0
		// d3.selectAll("li")
			// .style("margin-left", (gutterWidth-42) + "px")
		// d3.selectAll(".detail.container")
		// 	.style("margin-left", (gutterWidth-42) + "px")
	})
	 		function drawDetail(listItem, under, expand, year, identifier, d){
	 			var natl = (d.id == "national")
				assistance = getAssistance();
	 			var type  = (expand) ? "expand":"detail";
	 			// console.log(d.flagged)
	 			// var lowPop = (d["properties"]["flagged"] == "1") ? "lowPop":"";
	 			if (d["properties"]["flagged"] == "1"){
	 				listItem.classed("lowPop",true);
	 			}
				var wrapper = listItem.append("div")
					.datum(d)
					.attr("class", type + " container " + "fips_" +  d.id)
					.style("height", 0)
					.style("opacity", 0)
					.style("margin-left", (gutterWidth-42) + "px")
				if(expand){wrapper.append("div").attr("class","expand_bg")}


				if(!natl){
					wrapper.append("div")
						.attr("class", type + " county close-button")
						.on("click", function(){dispatch.deselectCounty(identifier)})
				}
				var name = wrapper.append("div")
					.attr("class", type + " county name")
				if (d["properties"]["flagged"] == "1"){
					name.append("div")
						.attr("class","lowPopBottom")
						.text("This area represents all counties in the state with fewer than 20,000 people according to the 2011–13 3-year American Community Survey sample.")
				}
				name.append("div")
					.attr("class", type + " fullName")
				if(!natl){ name.append("span").text(d.properties.name + ", " + STATES[d.properties.STATE_NAME]) }
				else{
					name.text("United States")
//Commenting out the bottom menu here, but there is still code to support it. BLOAT. Should be removed.
					// name.append("div")
					// 	.attr("class", "arrow")
					// 	.on("click", function(){
					// 		if(d3.select(this).classed("clicked")){
					// 			d3.select(".national_key")
					// 				.transition()
					// 				.style("height", "116px")
					// 			d3.select(".bottom_menu")
					// 				.transition()
					// 				.style("height", "0px")
					// 				.style("opacity",0)
					// 			d3.select(this).classed("clicked",false)
					// 		}
					// 		else{
					// 			d3.select(".national_key")
					// 				.transition()
					// 				.style("height", "175px")
					// 			d3.select(".bottom_menu")
					// 				.transition()
					// 				.style("height", "60px")
					// 				.style("opacity",1)
					// 			d3.select(this).classed("clicked",true)		
					// 		}
					// 	})
				}
				name.append("div")
					.attr("class",type + " year label hideOnExpand fips_" + d.id)
					.text(threeYearNameUpdate(year))
				if(!natl){
					name.append("div")
						.attr("class", type + " expand_years collapsed")
						.on("click", function(){
							var collapsed = d3.select(this).classed("collapsed")
							if(collapsed){
								listItem.style("height", "323px")
								d3.select(this)
									.classed("collapsed", false)
									.style("margin-top", "30px")
									.select("span")
									.text("collapse years")
								drawDetail(under, null, true, "2000", identifier, d);
								drawDetail(under, null, true, "2006", identifier, d);
								drawDetail(under, null, true, "2013", identifier, d);
								under.node().parentNode.appendChild(under.node())
								d3.selectAll(".detail.hideOnExpand.fips_" + d.id)
									.style("display", "none")
							}
							else{
								listItem.style("height", "81px")
								d3.select(this)
									.classed("collapsed", true)
									.style("margin-top", "12px")
									.select("span")
									.text("expand years");
								d3.selectAll(".expand.container.fips_" + d.id)
									.remove()
								d3.selectAll(".detail.hideOnExpand.fips_" + d.id)
									.style("display", "block")
							}
						})
						.append("span")
						.text("expand years")
				}

				wrapper.append("div")
					.attr("class", type + " hideOnExpand totalPop fips_" + d.id)
					.text(comma(d["properties"]["totalPop" + year]))
				.append("div")
					.attr("class","ami-button")
					.on("mouseover", function(){
					d3.selectAll(".help.text.ami.fips_" + d.id + year)
						.style("z-index",5)
						.transition()
						.duration(100)
						.style("top","-142px")
						.style("opacity",1)
				})
				.on("mouseout", function(){
					d3.selectAll(".help.text.ami.fips_" + d.id + year)
						.transition()
						.duration(100)
						.style("top","240px")
						.style("opacity",0)
						.style("z-index",-2)
				})
				.append("div")
					.attr("class", "help text ami fips_" + d.id + year)
					.html(function(){
						var minELI, maxELI;
						if(d.id == "national"){
							var elis = {"2000":[9150,30700], "2006":[12100,35350], "2013":[21250 ,37250]}
							minELI = elis[year][0]
							maxELI = elis[year][1]
						}
						else{
							minELI = d["properties"]["minELI" + year]
							maxELI = d["properties"]["maxELI" + year]
						}
						//ELI cutoff numbers are for 2000, 2007, and 2013 (last year in ranges)
						var newYear;
						if(year == "2006") newYear = "2008"
						else if(year == "2013") newYear = "2014"
						else newYear = "2000"

						if (d["properties"]["flagged"] == "0"){
							return "In " + newYear + ", ELI households of four earned no more than " + dollar(d["properties"]["ami" + year]) + "."
						}
						else if(minELI == maxELI){
							return "In " + newYear + ", ELI households of four in these counties earned no more than " + dollar(maxELI) + "."
						}
						else{
							return "In " + newYear + ", the cut off for an ELI household of four in these counties ranged from " + dollar(minELI) + "-" + dollar(maxELI) + ", depending on location."
						}
					})
				var total = wrapper.append("div")
					.datum(d)
					.attr("class", type + " hideOnExpand county total bar fips_" + d.id + " y" + year)
					.classed(year, true);	

				total.append("div")
					.attr("class", "unassisted bar" + " y" + year)
					.classed("hidden", function(){ return parseFloat(d["properties"]["usdaOffhudOff" + year]) < 0.5})
					.attr("data-year", year)
					.datum(d)
					.style("width", function(){
						var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
						return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
					})
					.on("mouseover",highlightUnasst)
					.on("mouseout",deHover)
				total.append("div")
					.attr("class", "usda_only bar" + " y" + year)
					.style("border-color", function(){
						console.log(assistance, assistance.search("usdaOff"))
						if(assistance.search("usdaOff") != -1) return "#999999"
						else return "#353535"
					})
					.style("background", function(){
						console.log(assistance, assistance.search("usdaOff"))
						if(assistance.search("usdaOff") != -1) return "rgba(255,255,255,0)"
						else return "#353535"
					})
					.classed("hidden", function(){ return parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]) < 0.5})
					.attr("data-year", year)
					.datum(d)
					.style("width", function(){
						var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
						return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
					})
					.style("left", function(){
						var crossed = (natl) ? false : d3.select(".fips_national .usda_only.bar").classed("crossed")
						if(!crossed){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						}else{
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						}
					})
					.on("mouseover",highlightUsda)
					.on("mouseout",deHover)
				total.append("div")
					.attr("class", "hud_only bar" + " y" + year)
					.style("border-color", function(){
						console.log(assistance, assistance.search("usdaOff"))
						if(assistance.search("hudOff") != -1) return "#999999"
						else return "#696969"
					})
					.style("background", function(){
						console.log(assistance, assistance.search("usdaOff"))
						if(assistance.search("hudOff") != -1) return "rgba(255,255,255,0)"
						else return "#696969"
					})
					.classed("hidden", function(){ return  parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]) < 0.5})
					.attr("data-year", year)
					.datum(d)
					.style("width", function(){
						var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
						return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
					})
					.style("left", function(){
						var crossed = (natl) ? false : d3.select(".fips_national .usda_only.bar").classed("crossed")
						if(!crossed){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						}else{
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						}
					})
					.on("mouseover",highlightHud)
					.on("mouseout",deHover)

				var caption = total.append("div")
					.attr("class", "fips_" + d.id + " caption y" + year)
				if(natl){
					caption
						.attr("class", "us_caption_usda captionText")
						.attr("data-year",year)
						.text("USDA assisted units")
						.style("text-indent", function(){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						})
						.datum(d)
						.on("mouseover",highlightUsda)
						.on("mouseout",deHover)
						.append("div")
						.attr("class", "us_line_usda captionLine")
						.style("left", function(){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"

						})
					total.append("div")
						.attr("class", "us_caption_hud captionText")
						.attr("data-year",year)
						.text("HUD assisted units")
						.style("text-indent", function(){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						})
						.datum(d)
						.on("mouseover",highlightHud)
						.on("mouseout",deHover)
						.append("div")
						.attr("class", "us_line_hud captionLine")
						.style("left", function(){
							var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						})

					total.append("div")
						.attr("class", "us_caption_baseline captionText")
						.attr("data-year",year)
						.text("Units without assistance")
						.style("text-indent", function(){
							var val = (parseFloat(d["properties"]["usdaOffhudOff" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						})
						.datum(d)
						.on("mouseover",highlightUnasst)
						.on("mouseout",deHover)
						.append("div")
						.attr("class", "us_line_baseline captionLine")
						.style("left", function(){
							var val = (parseFloat(d["properties"]["usdaOffhudOff" + year]))/2
							return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
						})
				}

				wrapper.append("div")
					.attr("data-year", year)
					.attr("class", type + " hideOnExpand bar text fips_" + d.id + " y" + year)
					.datum(d)
					.text(function(d){
						return comma(d["properties"][assistance + year])
					})
				wrapper.append("div")
					.datum(d)
					.attr("class", type + " hideOnExpand total units fips_" + d.id + " y" + year)
					.attr("data-year", year)
					.text(comma(d["properties"][assistance + "Num" + year]))
				var h = (natl) ? "116px":"36px"
			 	wrapper
				 	.transition()
				 	.duration(40)
				 	.style("height", h)
				 	.style("opacity", 1)

				 if(natl){
 					var menu = listItem.append("div")
						.attr('class', "bottom_menu")
					menu.append("div")
						.attr("class", "text left")
						.text("Change selected year")
						.style("margin-left", (gutterWidth + 18) + "px")
					menu.append("div")
						.attr("class", "radio yr2000")
						.on("click", function(){ dispatch.changeYear("2000") })
					menu.append("div")
						.attr("class", "label yr2000")
						.text("2000")
					menu.append("div")
						.attr("class", "radio yr2006")
						.on("click", function(){ dispatch.changeYear("2006") })
					menu.append("div")
						.attr("class", "label yr2006")
						.text("2006")
					menu.append("div")
						.attr("class", "radio yr2013")
						.on("click", function(){ dispatch.changeYear("2013") })
					menu.append("div")
						.attr("class", "label yr2013")
						.text("2013")
					menu.append("div")
						.attr("class", "text right")
						.text("Federal Assistance")

					menu
						.style("height", "0px")
						.style("opacity",0)


				 }
			}


	function highlightUnasst(d){
		var year = d3.select(this).attr("data-year")
		var a = "usdaOffhudOff";
		if(d.id != "national"){
			d3.selectAll(".fips_" + d.id + ".caption.y" + year)
				.text("Units without assistance")
		}
		else{
			d3.select(".us_caption_baseline").classed("hover",true)
			d3.select(".us_line_baseline").classed("hover",true)
			d3.select(".fips_national .unassisted.bar").classed("hover",true)
		}
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return comma(d["properties"][a + year])});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return comma(d["properties"][a + "Num" + year])});
		d3.select(this).classed("hover", true)
	}
	function highlightHud(d){
		var year = d3.select(this).attr("data-year")
		var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
		var valNum = parseFloat(d["properties"]["usdaOnhudOnNum" + year]) - parseFloat(d["properties"]["usdaOnhudOffNum" + year])

		if(d.id != "national"){
			d3.selectAll(".fips_" + d.id + ".caption.y" + year)
				.text("HUD assisted units")
		}
		else{
			d3.select(".us_caption_hud").classed("hover",true)
			d3.select(".us_line_hud").classed("hover",true)
			d3.select(".fips_national .hud_only.bar").classed("hover",true)

		}
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return comma(val)});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return comma(valNum)});
		d3.select(this).classed("hover", true)
	}
	function highlightUsda(d){
		var year = d3.select(this).attr("data-year")
		var val = parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
		var valNum = parseFloat(d["properties"]["usdaOnhudOnNum" + year]) - parseFloat(d["properties"]["usdaOffhudOnNum" + year])

		if(d.id != "national"){
			d3.selectAll(".fips_" + d.id + ".caption.y" + year)
				.text("USDA assisted units")
		}
		else{
			d3.select(".us_caption_usda").classed("hover",true)
			d3.select(".us_line_usda").classed("hover",true)
			d3.select(".fips_national .usda_only.bar").classed("hover",true)
		}
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return comma(val)});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return comma(valNum)});
		d3.select(this).classed("hover", true)
	}
	function deHover(d){
		var year = d3.select(this).attr("data-year")
		var a = getAssistance();
		d3.selectAll(".fips_" + d.id + ".caption.y" + year)
			.text("")
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return comma(d["properties"][a + year])});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return comma(d["properties"][a + "Num" + year])});
		d3.selectAll(".bar.hover").classed("hover",false);
		d3.selectAll(".captionText").classed("hover",false)
		d3.selectAll(".captionLine").classed("hover",false)
	}
	dispatch.on("selectCounty.details", function(d){
		d3.selectAll(".garbage").remove();
		var assistance = getAssistance();
		var currentYear = getYear();
		var identifier = (typeof(d) == "undefined") ? null : assistance +  currentYear + "_" + d.id;
		// var asst = (typeof(d) == "undefined") ? null : d.properties["asst" + currentYear]
		// var noAsst = (typeof(d) == "undefined") ? null : d.properties["noAsst" + currentYear]
		if(typeof(d) != "undefined" && selectedCounties.indexOf(identifier) === -1){
			selectedCounties.push(identifier)
			var li = d3.select(".detail.list")
				 .insert("li",":nth-child(2)")
 				.attr("id", identifier)
 		 	var under = li.append("div")
				.attr("class", "expanded")
 			drawDetail(li, under, false, currentYear, identifier, d);

		}
		d3.select(".print.button")
			.transition()
			.duration(20)
			.style("background","#333")
		d3.select(".print.border")
			.transition()
			.duration(20)
			.style("background","#333")
		d3.select(".headerRow")
			.transition()
			.duration(20)
			.style("border-color","#333")
	});
	dispatch.on("deselectCounty.details", function(identifier){
//Note: indexOf not supported in IE 7 and 8
		var index = selectedCounties.indexOf(identifier)
		selectedCounties.splice(index,1)
		var li = d3.select("[id$='" + identifier.split("_")[1] + "']")
		li.transition()
	 		.duration(200)
		 	.style("height", "0px")
		 	.style("opacity", 0)
		 	.transition()
		 	.duration(0)
		 	.style("display", "none")
		 	.attr("class", "garbage");
		dispatch.updateTooltip();
		if(selectedCounties.length == 0){
		d3.select(".print.button")
			.transition()
			.duration(20)
			.style("background","#ccc")
		d3.select(".print.border")
			.transition()
			.duration(20)
			.style("background","#ccc")
		d3.select(".headerRow")
			.transition()
			.duration(20)
			.style("border-color","#ccc")
		}
	})
	dispatch.on("changeYear.details", function(year){
		if(year == "2000"){
			d3.select("#fader")
				.style("height","34px")
				.transition()
				// .duration(1000)
				.style("background","rgba(255,255,255,.7)")
			d3.select("#faderText")
				.transition()
				.duration(1000)
				.style("opacity",1)
		}else{
			d3.select("#fader")
				.transition()
				// .duration(1000)
				.style("background","rgba(255,255,255,.0)")
				.each("end", function(){ d3.select("#fader").style("height","0px") })
			d3.select("#faderText")
				.transition()
				.duration(1000)
				.style("opacity",0)
		}
		var a = getAssistance();
		d3.selectAll(".y2013")
			.classed("y2013",false)
			.classed("y" +  year, true)
		d3.selectAll(".y2006")
			.classed("y2006",false)
			.classed("y" +  year, true)
		d3.selectAll(".y2000")
			.classed("y2000",false)
			.classed("y" +  year, true)

		d3.selectAll(".detail.year.label")
			.attr("data-year", year)
			.text(threeYearNameUpdate(year))
		d3.selectAll(".detail.totalPop")
			.attr("data-year", year)
			.text(function(d){ return comma(d["properties"]["totalPop" +  year])})
			// .empty()
			.append("div")
					.attr("class","ami-button")
					.on("mouseover", function(d){
					d3.selectAll(".help.text.ami.fips_" + d.id + year)
						.style("z-index",5)
						.transition()
						// .duration(200)
						.style("top","-142px")
						.style("opacity",1)
				})
				.on("mouseout", function(d){
					d3.selectAll(".help.text.ami.fips_" + d.id + year)
						.transition()
						.duration(100)
						.style("top","240px")
						.style("opacity",0)
						.style("z-index",-2)
				})
				.append("div")
					.attr("class", function(d){ return "help text ami fips_" + d.id + year})
					.html(function(d){
						var minELI, maxELI;
						if(d.id == "national"){
							var elis = {"2000":[9150,30700], "2006":[12100,35350], "2013":[21250 ,37250]}
							minELI = elis[year][0]
							maxELI = elis[year][1]
						}
						else{
							minELI = d["properties"]["minELI" + year]
							maxELI = d["properties"]["maxELI" + year]
						}
						//ELI cutoff numbers are for 2000, 2007, and 2013 (last year in ranges)
						if(year == "2006") newYear = "2008"
						else if(year == "2013") newYear = "2014"
						else newYear = "2000"
						if (d["properties"]["flagged"] == "0"){
							return "In " + newYear + ", ELI households of four earned no more than " + dollar(d["properties"]["ami" + year]) + "."
						}
						else if(minELI == maxELI){
							return "In " + newYear + ", ELI households of four in these counties earned no more than " + dollar(maxELI) + "."
						}
						else{
							return "In " + newYear + ", the cut off for an ELI household of four in these counties ranged from " + dollar(minELI) + "-" + dollar(maxELI) + ", depending on location."
						}
					})

		d3.selectAll(".detail.bar.text")
			.attr("data-year", year)
			.text(function(d){ return comma(d["properties"][a + year])})
		d3.selectAll(".detail.total.units")
			.attr("data-year", year)
			.text(function(d){ return comma(d["properties"][a + "Num" + year])})


	})
	dispatch.on("changeAssistance.details", function(a){
		var year;
		console.log(a)
		d3.selectAll(".bar.text")
			.text(function(d){ year = d3.select(this).attr("data-year"); return comma(d["properties"][a + year])})
		d3.selectAll(".total.units")
			.text(function(d){ year = d3.select(this).attr("data-year"); return comma(d["properties"][a + "Num" + year])})
		if(a == "usdaOnhudOff"){
			d3.selectAll(".usda_only.bar")
				.classed("crossed",true)
				.transition()
				.style("background","#353535")
				.style("border-color","#353535")
				.style("border-left","0px solid")
				.style("border-right","1.5px solid")
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.selectAll(".hud_only.bar")
				.transition()
				.style("background","rgba(255,255,255,0)")
				.style("border-color","#999999")
				.style("border-left","0px solid")
				.style("border-right","1.5px solid")
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_caption_usda")
				.style("z-index",10)
				.transition()
				.delay(800)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("top","64px")
			d3.select(".us_line_usda")
				.style("z-index",10)
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("height","28px")
				.style("top","-27px")

			d3.select(".us_caption_hud")
				.style("z-index", 9)
				.transition()
				.delay(800)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("top","33px")
			d3.select(".us_line_hud")
				.style("z-index", 9)
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("height","12px")
				.style("top","-11px")
		}
		else if( a == "usdaOffhudOn"){
			d3.selectAll(".hud_only.bar")
				.transition()
				.style("background","#696969")
				.style("border-color","#696969")
				.style("border-left","0px solid")
				.style("border-right","1.5px solid")
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year])
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.selectAll(".usda_only.bar")
				.classed("crossed",false)
				.transition()
				.style("background","rgba(255,255,255,0)")
				.style("border-color","#999999")
				.style("border-left","0px solid")
				.style("border-right","1.5px solid")
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
			d3.select(".us_caption_hud")
				.style("z-index", 10)
				.transition()
				.delay(800)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("top","49px")

			d3.select(".us_line_hud")
				.style("z-index", 10)
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("height","26px")
				.style("top","-26px")

			d3.select(".us_caption_usda")
				.style("z-index",9)
				.transition()
				.delay(800)
				.style("text-indent", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("top","48px")

			d3.select(".us_line_usda")
				.style("z-index",9)
				.transition()
				.delay(800)
				.style("left", function(d){
					var val = parseFloat(d["properties"]["usdaOffhudOff" + year]) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOnhudOff" + year])) + (parseFloat(d["properties"]["usdaOnhudOn" + year]) - parseFloat(d["properties"]["usdaOffhudOn" + year]))*.5
					return (parseFloat(val/100.0) * BAR_WIDTH) + "px"
				})
				.style("height","12px")
				.style("top","-10px")

		}
		else{
			if(a.search("usdaOff") != -1){
				d3.selectAll(".usda_only.bar")
					.transition()
					.style("background","rgba(255,255,255,0)")
					.style("border-color","#999999")
			}
			else if(a.search("usdaOn") != -1){
				d3.selectAll(".usda_only.bar")
					.transition()
					.style("background","#353535")
					.style("border-color","#353535")
			}
			if(a.search("hudOff") != -1){
				d3.selectAll(".hud_only.bar")
					.transition()
					.style("background","rgba(255,255,255,0)")
					.style("border-color","#999999")

			}
			else if(a.search("hudOn") != -1){
				d3.selectAll(".hud_only.bar")
					.transition()
					.style("background","#696969")
					.style("border-color","#696969")
			}
		}

		})

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


d3.select(".population.header")
	.style("cursor","pointer")
	.on("mouseover", function(){
		d3.select(this)
			.style("background","#1696d2")
			.style("border-top","solid 3px #1696d2")
			.style("height","27px")
			.style("padding-top","3px")
		d3.select(".help.text.pop")
			.style("z-index",5)
			.transition()
			.duration(100)
			.style("top","-119px")
			.style("opacity",1)
	})
	.on("mouseout", function(){
		var col = d3.select(".print.button").style("background-color")
		d3.select(this)
			.style("background","#b3b3b3")
			.style("border-top","solid 3px " + col)
			// .style("height","28px")
			.style("padding-top","3px")
		d3.select(".help.text.pop")
			.transition()
			.duration(100)
			.style("top","-20px")
			.style("opacity",0)
			.style("z-index",-2)
	})

d3.select(".per100.header")
	.style("cursor","pointer")
	.on("mouseover", function(){
		d3.select(this)
			.style("background","#1696d2")
			.style("border-top","solid 5px #1696d2")
			.style("height","20px")
			.style("padding-top","8px")
		d3.select(".help.text.per")
			.style("z-index",5)
			.transition()
			.duration(100)
			.style("top","-142px")
			.style("opacity",1)
	})
	.on("mouseout", function(){
		var col = d3.select(".print.button").style("background-color")
		d3.select(this)
			.style("background","#b3b3b3")
			.style("border-top","solid 3px " + col)
			.style("height","18px")
			.style("padding-top","12px")
		d3.select(".help.text.per")
			.transition()
			.duration(100)
			.style("top","-20px")
			.style("opacity",0)
			.style("z-index",-2)
	})

d3.select(".total.header")
	.style("cursor","pointer")
	.on("mouseover", function(){
		d3.select(this)
			.style("background","#1696d2")
			.style("border-top","solid 5px #1696d2")
			.style("height","20px")
			.style("padding-top","8px")
		d3.select(".help.text.total")
			.style("z-index",5)
			.transition()
			.duration(100)
			.style("top","-158px")
			.style("opacity",1)
	})
	.on("mouseout", function(){
		var col = d3.select(".print.button").style("background-color")
		d3.select(this)
			.style("background","#b3b3b3")
			.style("border-top","solid 3px " + col)
			.style("height","18px")
			.style("padding-top","12px")
		d3.select(".help.text.total")
			.transition()
			.duration(100)
			.style("top","-20px")
			.style("opacity",0)
			.style("z-index",-2)
	})

d3.select(".help-button.hud")
	.on("mouseover", function(){
		d3.select(".help.text.asst.hud")
			.style("z-index",5)
			.transition()
			.duration(100)
			.style("top","-293px")
			.style("left","-88px")
			.style("opacity",1)
	})
	.on("mouseout", function(){
		d3.select(".help.text.asst.hud")
			.transition()
			.duration(100)
			.style("top","-240px")
			.style("opacity",0)
			.style("z-index",-2)
	})

d3.select(".help-button.usda")
	.on("mouseover", function(){
		d3.select(".help.text.asst.usda")
			.style("z-index",5)
			.transition()
			.duration(100)
			.style("top","-107px")
			.style("left","-88px")
			.style("opacity",1)
	})
	.on("mouseout", function(){
		d3.select(".help.text.asst.usda")
			.transition()
			.duration(100)
			.style("top","-240px")
			.style("opacity",0)
			.style("z-index",-2)
	})

d3.select( "#fader" ).on("mouseover", function() {
  d3.event.stopPropagation();
  // Do something
});

d3.select(".zoom.in")
	.on("click", function(){ dispatch.zoomIn() })
d3.select(".zoom.out")
	.on("click", function(){ dispatch.zoomOut() })
// console.log("fooooo")


drawGraphic(MASTER_WIDTH)

