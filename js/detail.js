var NATIONAL_VALUES = {"3004106":"2000", "3104458":"2013", "3285639":"2012", "3205087":"2006"}
var STATES = { "Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "WY": "Wyoming" }

var BAR_WIDTH = 100
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

function drawGraphic(containerWidth){
	var params = getUrlVars();
	var fips = params.fips
	var width = 800;
	var height = 400;
	var margin = {left:50, right:30, top:30, bottom: 30}
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
			.text(function(d){ return d.properties.name  + ", " + STATES[d.properties.state]})


		// var x = d3.scale.linear()
		// 		.range([margin.left,width-margin.left])
		// 		.domain([1999.5,2013.5])
		var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .3)
    		.domain([2000,2006,2013]);
		var y = d3.scale.linear()
				.range([height-margin.bottom,margin.bottom])
				.domain([0,100])
		var years = [2000,2006,2013]
		// var line = d3.svg.line()
	 //    	.x(function(d) { return x(d.date); })
	 //    	.y(function(d) { return y(d.close); });

	 // console.log(data)

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    // .tickValues([2000,2006,2013])
		    // .tickFormat(d3.format("0"))
		    .outerTickSize(0);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(5);

		var svg = containers.append("svg")
				.attr("height",height)
				.attr("width",width)
				.append("g");
		// for(var t= 1; t <= 5; t++){
		// 	svg.append("line")
		// 		.attr("class", "grid-line")
		// 		.attr("x1", x(2))
		// 		.attr("x2", x(2013.5))
		// 		.attr("y1", y(t*20))
		// 		.attr("y2", y(t*20));
		// }
		svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + (height-margin.bottom) + ")")
		      .call(xAxis);

		svg.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + margin.left + ",0)")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")

		for(var i = 0; i < years.length; i++){
			// if(i < (years.length - 1)){
			// 	svg.append("line")
			// 		.attr("class", "asst line")
			// 		.attr("x1", x(years[i]))
			// 		.attr("x2", x(years[i+1]))
			// 		.attr("y1", function(d){ return y(d.properties["asst" + years[i]])})
			// 		.attr("y2", function(d){ return y(d.properties["asst" + years[i+1]])})

			// 	svg.append("line")
			// 		.attr("class", "noAsst line")
			// 		.attr("x1", x(years[i]))
			// 		.attr("x2", x(years[i+1]))
			// 		.attr("y1", function(d){ return y(d.properties["noAsst" + years[i]])})
			// 		.attr("y2", function(d){ return y(d.properties["noAsst" + years[i+1]])})

			// }

			svg.append("rect")
				.attr("class","asst bar")
				.attr("x", x(years[i]))
				.attr("y", function(d) { return y(d.properties["asst" + years[i]]) })
				.attr("width", x.rangeBand())
				.attr("height", function(d){ return height - margin.bottom - y(d.properties["asst" + years[i]])})
				// .attr("cx",x(years[i]))
				// .attr("cy", function(d){ return y(d.properties["asst" + years[i]])})
				// .attr("r",4)
			svg.append("rect")
				.attr("class","noAsst bar")
				.attr("x", x(years[i]))
				.attr("y", function(d) { return y(d.properties["noAsst" + years[i]]) })
				.attr("width", x.rangeBand())
				.attr("height", function(d){ return height - margin.bottom - y(d.properties["noAsst" + years[i]])})

		}
		var table = containers.append("table")
		headers = table.append("tr")
		headers.append("th")
			.html("")
 		headers.append("th")
			.html("ELI<sup>*</sup> renter households")
		headers.append("th")
			.html("AMI<sup>**</sup> cutoff for ELI<sup>*</sup> status")
 		headers.append("th")
			.html("AAA<sup>***</sup> rental units")
 		headers.append("th")
			.html("Gap between ELI<sup>*</sup> households and AAA<sup>***</sup> rental units")
 		headers.append("th")
			.html("Units serving ELI<sup>*</sup> households without HUD assistance")
 		headers.append("th")
			.attr("class","asst")
			.html("Units per 100 households")
 		headers.append("th")
			.attr("class","noAsst")
			.html("Units per 100 households without HUD assistance ")

		var heads =["Total ELI renters","dolla dolla bills yall", "AAA units", "gap", "AAA units (asst off)", "Units per 100 renters", "Units per 100 renters (asst off)"]
		
		for(var y = 0; y < years.length; y++){
			var year = years[y]
			d3.csv("data/source/HAI_commsoutput_" + year + ".csv")
			    .row(function(d) {
			    	var r = {};
			    	var vals = {}
			    	for(var h = 0; h<heads.length; h++){
			    		vals[heads[h]] = d[heads[h]]
			    	}
			    	r[d.county] = vals;
			    	return r;
			    })
			    .get(function(error, rows) {
	  		      var row = table.append("tr")
//This is the hackiest nonsense EVER. So bc of async stuff, year isn't being tracked in this func, so instead of modifying the csv source file (to add a "year" column)
//I have an global obj w/ the value by year of "AAA units"...if data updates this needs to update...ugh
				  row.append("td")
					.text(NATIONAL_VALUES[rows[0]["National"]["AAA units"]])
				for(var j = 0; j<heads.length; j++){
				  row.append("td")
				  	.text(function(d){
				      var test = rows.filter(function(obj){
				      	return Object.keys(obj)[0] == d.id;
		 		      });
		 		      return test[0][d.id][heads[j]]
				   })
				  .attr("class", function(){
				  	if(heads[j] == "Units per 100 renters"){ return "asst"}
				  	else if(heads[j] == "Units per 100 renters (asst off)"){ return "noAsst"}
				  	else{ return ""}
				  })
				 }
			    });
		}

		// row2000 = table.append("tr")
		// row2000.append("td")
		// 	.text("2000")

		// row2006 = table.append("tr")
		// row2006.append("td")
		// 	.text("2006")

		// row2012 = table.append("tr")
		// row2012.append("td")
		// 	.text("2012")

		// row2013 = table.append("tr")
		// row2013.append("td")
		// 	.text("2013")
		containers.append("div")
			.attr("class", "footnote")
			.text("* Extremely low income (ELI) households earn less than 30 percent area median income.")
		containers.append("div")
			.attr("class", "footnote")
			.text("** Does AMI need a footnote?")
		containers.append("div")
			.attr("class", "footnote")
			.text("*** AAA definition goes here")
		containers.append("div")
			.attr("class","page-break")

	});
	
}
pymChild = new pym.Child({ renderCallback: drawGraphic, polling: 50});

