if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        var val;
        if(hash[0] == "fips"){
        	val = hash[1].split(",")
        }else{ val = hash[1]}
        vars[hash[0]] = val;
    }
    return vars;
}



var BAR_WIDTH = 200.0;

function drawGraphic(containerWidth){
	var params = getUrlVars();
	var fips = params.fips
	var width = 200;
	var height = 200;
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
    
	d3.json("data/data.json", function(error, us) {
		var data = topojson.feature(us, us.objects.UScounties).features.filter(function(obj){ return fips.indexOf(""+obj.id) != -1})
		var containers = d3.select("body")
			.selectAll("div")
			.data(data)
			.enter()
			.append("div")
			.attr("class","scatter container")

		containers.append("h2")
			.text(function(d){ return d.properties.name })

		var x = d3.scale.linear()
				.range([30,170])
				.domain([1999.5,2013.5])
		var y = d3.scale.linear()
				.range([170,0])
				.domain([0,100])
		var years = [2000,2006,2012,2013]
		// var line = d3.svg.line()
	 //    	.x(function(d) { return x(d.date); })
	 //    	.y(function(d) { return y(d.close); });

	 // console.log(data)

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var svg = containers.append("svg")
				.attr("height",200)
				.attr("width",700)
				.append("g");
		svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + 170 + ")")
		      .call(xAxis);

		svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(30,0)")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")

		for(var i = 0; i < years.length; i++){
			if(i < (years.length - 1)){
				svg.append("line")
					.attr("class", "asst line")
					.attr("x1", x(years[i]))
					.attr("x2", x(years[i+1]))
					.attr("y1", function(d){ return y(d.properties["asst" + years[i]])})
					.attr("y2", function(d){ return y(d.properties["asst" + years[i+1]])})

				svg.append("line")
					.attr("class", "noAsst line")
					.attr("x1", x(years[i]))
					.attr("x2", x(years[i+1]))
					.attr("y1", function(d){ return y(d.properties["noAsst" + years[i]])})
					.attr("y2", function(d){ return y(d.properties["noAsst" + years[i+1]])})

			}
			svg.append("circle")
				.attr("class","asst dot")
				.attr("cx",x(years[i]))
				.attr("cy", function(d){ return y(d.properties["asst" + years[i]])})
				.attr("r",4)

			svg.append("circle")
				.attr("class","noAsst dot")
				.attr("cx",x(years[i]))
				.attr("cy", function(d){ return y(d.properties["noAsst" + years[i]])})
				.attr("r",4)
		}
		containers.append("div")
			.attr("class","page-break")
	});
}

pymChild = new pym.Child({ renderCallback: drawGraphic, polling: 50});

