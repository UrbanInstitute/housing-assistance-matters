var STATES = { "Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "WY": "Wyoming" }
var pymChild = null;
var selectedCounties = [];
var BAR_WIDTH = 200.0;
var drawDetail = function(d){
	var detail;
}
function drawGraphic(containerWidth){
//get widths for gutters, max width of details below is 897px
var headerWidth = parseInt(d3.select(".headerRow").style("width").replace("px",""));
var gutterWidth = (headerWidth - 897)/2.0
d3.selectAll(".header.gutter").style("width", gutterWidth + "px")
	var dispatch = d3.dispatch("load", "changeYear", "changeAssistance", "selectCounty", "deselectCounty", "zoomIn","zoomOut", "updateTooltip");
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

	// var GREYS = 
	// 	{
	// 		"q0-5": "#ccc",
	// 		"q1-5": "#aaa",
	// 		"q2-5": "#777",
	// 		"q3-5": "#444",
	// 		"q4-5": "#111",
	// 	}

	var GREYS = 
		{
			"q0-5": "#b0d5f1",
			"q1-5": "#82c4e9",
			"q2-5": "#1696d2",
			"q3-5": "#00578b",
			"q4-5": "#061b5a",
		}

	var getAssistance = function(){
		var btn = d3.select(".assistance.button.active");
		if (btn.classed("turnOn")){return "asst"}
		else{ return "noAsst"}
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
		// var btn = d3.select(this)
		var active = d3.select(".assistance.button.active")
		if(active.classed("turnOn")){
			active.classed("active", false);
			d3.select(".assistance.button.turnOff")
				.classed("active", true);
			dispatch.changeAssistance("noAsst");
		}
		if(active.classed("turnOff")){
			active.classed("active", false);
			d3.select(".assistance.button.turnOn")
				.classed("active", true);
			dispatch.changeAssistance("asst");
		}

		// if(btn.classed("turnOn")){
		// 	btn.classed("on",false)
		// 	btn.classed("active", true)
		// 	dispatch.changeAssistance("noAsst");
		// }
		// else{
		// 	btn.classed("on",true)
		// 	btn.classed("off", false)
		// 	dispatch.changeAssistance("asst");
		// }
		
	});
	dispatch.on("changeAssistance", function(assistance){
		if(assistance == "asst"){
			d3.select(".assistance.button.turnOn").classed("active", true)
			d3.select(".assistance.button.turnOff").classed("active", false)
		}
		else{
			d3.select(".assistance.button.turnOn").classed("active", false)
			d3.select(".assistance.button.turnOff").classed("active", true)
		}
	});
	d3.select(".print.button")
		.on("click", function(){
			var counties = d3.selectAll("#holder li")[0].filter(function(obj){
				return d3.select(obj).classed("garbage") === false && d3.select(obj).classed("national") === false;
			})
			var url = "/detail.html?fips=";
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
			    var ignored = (d.properties.ignore == "1") ? " ignored" : "";
	          	var fips = "fips_" + d.id;
	          	return active + ignored + " " + fips + " " + quantize(d["properties"][asst+year]);
	         })
			.transition()
			.style("fill", function(d){
					if(d.properties.ignore != "1") {return COLORS[quantize(d.properties[asst +  year])];}
					else{ return GREYS[quantize(d.properties[asst +  year])]; }
				});
	});

	dispatch.on("changeYear.map", function(year){
		var a = getAssistance();
		var year = getYear();
		d3.selectAll("#counties path")
			.attr("class", function(d){
				var active = (d3.select(this).classed("active")) ? "active ":"";
			    var ignored = (d.properties.ignore == "1") ? " ignored" : "";
	          	var fips = "fips_" + d.id;
	          	return active + ignored + " " + fips + " " + quantize(d["properties"][a+year]);
	         })
			.transition()
			.style("fill", function(d){
					if(d.properties.ignore != "1") {return COLORS[quantize(d.properties[a +  year])];}
					else{ return GREYS[quantize(d.properties[a +  year])]; }
			})
	});

	d3.selectAll("svg").remove();
	d3.selectAll(".tooltip").remove();
	d3.selectAll(".custom-combobox").remove();
	d3.selectAll("#combobox").remove();
	// d3.selectAll("li.national").remove();
	// d3.selectAll(".garbage").remove();

	var width = containerWidth,
	height = containerWidth/2,
	centered;
	var projection = d3.geo.albersUsa()
	    .scale(width)
	    .translate([width / 2, height / 2]);

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

// var zoom = d3.behavior.zoom()
//     .translate(projection.translate())
//     .scale(projection.scale())
//     .scaleExtent([height, 8 * height])
//     .on("zoom", zoomed)

// function zoomed() {
//   projection.translate(d3.event.translate).scale(d3.event.scale);
//   g.selectAll("path").attr("d", path);
// }

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
	     	  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
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
	      // .classed(quantize(d.properties.asst2013), true)
	      .selectAll("path")
	      .data(topojson.feature(us, us.objects.UScounties).features)
	      .enter().append("path")
	      .attr("d", path)
	      .style("fill", function(d){
	      	if(d.properties.ignore !== "1"){
	      		return COLORS[quantize(d.properties.asst2013)];
	      	}
	      	else{
	      		return GREYS[quantize(d.properties.asst2013)]
	      	}
	      })
	          .attr("class", function(d) {
	          	var ignored = (d.properties.ignore == "1") ? " ignored" : "";
	          	var fips = "fips_" + d.id
	          	return ignored + " " + fips + " " + quantize(d.properties.asst2013);
	          })
	      .on("click", clicked)
	      .on("mouseover", function(){ d3.select(this).classed("hover", true); dispatch.updateTooltip() })
	      .on("mouseout", function(){ d3.select(this).classed("hover", false); dispatch.updateTooltip() })
	      .call(drag);
	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.UScounties, function(a, b) { return a !== b; }))
	      .attr("id", "county-borders")
	      .attr("d", path);
	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.cb_2013_us_state_500k, function(a, b) { return a !== b; }))
	      .attr("id", "state-borders")
	      .attr("d", path);



	});

	var legend = g.append("g")
		.attr("id", "legend")

	function clicked(d) {
		var x,y,k;
		if(typeof(d) == "undefined"){
			d3.select(".tooltip")
				.transition()
				.style("background", "rgba(255,255,255,0)")
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
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	}

	// var k = 1;
	dispatch.on("zoomIn", function(){
		d3.select(".tooltip")
			.transition()
			.style("background", "rgba(255,255,255,.9)")
		var x,y;
		lastK += 1;
	    var centroid = path.centroid(lastClicked);
	    x = centroid[0];
	    y = centroid[1];
		g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
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
		      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + lastK + ")translate(" + -x + "," + -y + ")")
		      .style("stroke-width", 1.5 / lastK + "px");
		}
	})


	dispatch.on("load.tooltip", function(data){
		d3.selectAll(".tooltip").remove();
		var width = 26;
		var sidebar = d3.select(".map.container")
			.append("div")
			.attr("class","tooltip")
			.style("width", width + "%")
			.style("height", containerWidth/2 + "px")
			.style("left",(100-width) + "%")
		
		var legend = sidebar.append("div")
			.attr("class","legend container")
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
		}
		var container = sidebar.append("div")
			.attr("class", "text container")
		container.append("div")
			.attr("class", "defaultTooltip")
			.html("Click map to select counties<br>Compare affordable housing data below")

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
			.attr("class", "absolute number tooltipDetail")
			.html("<span class = \"tooltipNum\"></span> affordable, available and adequate units")
			.style("display", "none")

		sidebar.append("div")
			.attr("class", "zoom in")
			.text("+")
			.on("click", function(){ dispatch.zoomIn() })
		sidebar.append("div")
			.attr("class", "zoom out")
			.text("-")
			.on("click", function(){ dispatch.zoomOut() })


	});

	dispatch.on("updateTooltip", function(){
		// console.log(d3.selectAll(".hover"), d3.selectAll(".hover")[0].length)
		// console.log(selectedCounties)
		hovered = d3.selectAll(".hover")
		if(hovered[0].length == 0 && selectedCounties.length == 0){
			// console.log("default")
			d3.selectAll(".defaultTooltip").style("display","block");
			d3.selectAll(".tooltipDetail").style("display","none");
		}
		else if(hovered[0].length != 0){
			// console.log("hover")
			d3.selectAll(".defaultTooltip").style("display","none");
			d3.selectAll(".tooltipDetail").style("display","block");
			var hData = d3.select(".hover").data()[0];
			// console.log("h", c)
			updateText(hData);
		}
		else if(hovered[0].length == 0 && selectedCounties.length != 0){
			// console.log("clicked")
			d3.selectAll(".defaultTooltip").style("display","none");
			d3.selectAll(".tooltipDetail").style("display","block");
			var clickedID = selectedCounties[selectedCounties.length-1];
			var cData = d3.select("path.fips_" + clickedID.split("_")[1]).data()[0];
			// console.log("c", d)
			updateText(cData)

		}
		function updateText(d){
			var year = getYear();
			var assistance = getAssistance();
			var comma = d3.format("000,000")
			d3.select(".county-name")
				.text(d["properties"]["name"])
			d3.select(".state-name")
				.text(d["properties"]["STATE_NAME"])
			d3.select(".relative .tooltipNum")
				.text(d["properties"][assistance + year])
			d3.select(".total .tooltipNum")
				.text(comma(d["properties"]["totalPop" + year]))
			d3.select(".absolute .tooltipNum")
				.text(comma(d["properties"][assistance + "Num" + year]))
		}
		// console.log(data)

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
	      .text(function(d) { return d.properties.name + ", " + STATES[d.properties.state]; });
	 
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
	    	.attr("src","/images/search-icon.png")
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
		d3.select(".national_key")
			.text("USA USA USA")

		// ul.append("li")
		// 	.classed("national", true)
		// 	.classed("show", true)
		// 	.text("The USA data goes here")
		// ul.append("li").style("display","none")
		// pymChild.sendHeight();
	})
	dispatch.on("selectCounty.details", function(d){
		d3.selectAll(".garbage").remove();
		var assistance = getAssistance();
		var currentYear = getYear();
		var identifier = (typeof(d) == "undefined") ? null : assistance +  currentYear + "_" + d.id;
		var asst = (typeof(d) == "undefined") ? null : d.properties["asst" + currentYear]
		var noAsst = (typeof(d) == "undefined") ? null : d.properties["noAsst" + currentYear]
		if(typeof(d) != "undefined" && selectedCounties.indexOf(identifier) === -1){
			selectedCounties.push(identifier)
			var li = d3.select(".detail.list")
				 .insert("li",":nth-child(2)")
 				.attr("id", identifier)
 				// .classed("ui-state-default", true);
 				// .append("li")
 			drawDetail(li, false, currentYear);
 			var under = li.append("div")
 						.attr("class", "expanded")

	 		function drawDetail(listItem, expand, year){
				assistance = getAssistance();

				// d.year = year;
	 			var type  = (expand) ? "expand":"detail";
				var wrapper = listItem.append("div")
					.datum(d)
					.attr("class", type + " container " + "fips_" +  d.id)
					.style("height", 0)
					.style("opacity", 0)
				wrapper.append("div")
					.attr("class", type + " county close-button")
					.on("click", function(){dispatch.deselectCounty(identifier)})
					// .append("img")
					// .attr("src","/images/close-button.png");

				var name = wrapper.append("div")
					.attr("class", type + " county name")
				name.append("div")
					.attr("class", type + " fullName")
					.text(d.properties.name)
				name.append("div")
					.attr("class",type + " year label hideOnExpand fips_" + d.id)
					.text(year)
				name.append("div")
					.attr("class", type + " expand_years collapsed")
					.text("expand years")
					.on("click", function(){
						var collapsed = d3.select(this).classed("collapsed")
						if(collapsed){
							d3.select(this)
								.classed("collapsed", false)
								.text("collapse years")
							drawDetail(under, true, "2000");
							drawDetail(under, true, "2006");
							drawDetail(under, true, "2013");
							d3.selectAll(".detail.hideOnExpand.fips_" + d.id)
								.style("display", "none")
						}
						else{
							d3.select(this)
								.classed("collapsed", true)
								.text("expand years");
							d3.selectAll(".expand.container.fips_" + d.id)
								.remove()
							d3.selectAll(".detail.hideOnExpand.fips_" + d.id)
								.style("display", "block")
							// d3.selectAll(".expanded")
							// 	.transition()
							// 	.style("height",0)
							// 	.style("opacity",0);
							// 	// .remove()
							// d3.selectAll(".expanded")
							// 	.remove();
						}
					})
				// drawDetail(under, true, "2000");
				// drawDetail(under, true, "2006");
				// drawDetail(under, true, "2013");

				var comma = d3.format("000,000")
				wrapper.append("div")
					.attr("class", type + " hideOnExpand totalPop + fips_" + d.id)
					.text(comma(d["properties"]["totalPop" + year]))
				var total = wrapper.append("div")
					.datum(d)
					.attr("class", type + " hideOnExpand county total bar fips_" + d.id + " y" + year)
					.on("click", function(){
						assistance = getAssistance();
						if(assistance == "asst"){
							assistance = "noAsst";
							dispatch.changeAssistance("noAsst");
						}
						else{
							assistance ="asst"
							dispatch.changeAssistance("asst");
						}
					})
					.classed(year, true);	
				total.append("div")
					.attr("class", "asst bar" + " y" + year)
					.attr("data-year", year)
					.datum(d)
					.style("width", (parseFloat(d["properties"]["asst" + year]/100.0) * BAR_WIDTH) + "px")
					.on("mouseover", highlightAsst)
					.on("mouseout", deHover);
				total.append("div")
					.datum(d)
					.attr("data-year", year)
					.attr("class", "display bar" + " y" + year)
					.attr("data-year", year)
					.style("width", function(){
						if(assistance == "noAsst"){
							return (parseFloat(d["properties"]["noAsst" + year]/100.0) * BAR_WIDTH) + "px"
						}
						else{
							return (parseFloat(d["properties"]["asst" + year]/100.0) * BAR_WIDTH) + "px"
						}
					})
					.on("mouseover", highlightAsst)
					.on("mouseout", deHover)
					.style("background", function(){
						if(assistance == "noAsst"){
							return COLORS[quantize(d["properties"]["noAsst" + year])]
						}
						else{
							return COLORS[quantize(d["properties"]["asst" + year])]
						}
					})
					.style("border", function(){
						if(assistance == "noAsst"){
							return "1px solid " + COLORS[quantize(d["properties"]["noAsst" + year])]
						}
						else{
							return "1px solid " + COLORS[quantize(d["properties"]["asst" + year])]
						}
					})
				total.append("div")
					.datum(d)
					.attr("data-year", year)
					.on("mouseover", highlightNoAsst)
					.on("mouseout", deHover)
					.attr("class", "bar marker" + " y" + year)
					.style("width", function(){
						if(assistance == "noAsst"){
							return (parseFloat(d["properties"]["asst" + year]/100.0) * BAR_WIDTH) + "px"
						}
						else{
							return (parseFloat(d["properties"]["noAsst" + year]/100.0) * BAR_WIDTH) + "px"
						}
					})
				total.append("div")
					.attr("class", "fips_" + d.id + " caption y" + year)
				wrapper.append("div")
					.attr("data-year", year)
					.attr("class", type + " hideOnExpand bar text fips_" + d.id + " y" + year)
					.datum(d)
					.text(function(d){
						if(assistance == "noAsst"){
							return d["properties"]["noAsst" + year]
						}
						else{
							return d["properties"]["asst" + year]
						}
					})
				wrapper.append("div")
					.datum(d)
					.attr("class", type + " hideOnExpand total units fips_" + d.id + " y" + year)
					.attr("data-year", year)
					.text(comma(d["properties"][assistance + "Num" + year]))

			 	wrapper
				 	.transition()
				 	.duration(40)
				 	.style("height", "36px")
				 	.style("opacity", 1)
			}
			pymChild.sendHeight();
		}

	function highlightNoAsst(d){
		console.log(this)
		// var year = getYear();
		var year = d3.select(this).attr("data-year")
		console.log(year)
		var a = "noAsst";
		d3.selectAll(".fips_" + d.id + ".caption.y" + year)
			.text("without assistance")
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return d["properties"][a + year]});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return d["properties"][a + "Num" + year]});
		d3.selectAll(".fips_" + d.id + " .marker.bar" + ".y" + year).classed("hover", true)
	}
	function highlightAsst(d){
		console.log(this)
		// var year = getYear();
		var year = d3.select(this).attr("data-year")
		console.log(year)
		var a = "asst";
		d3.selectAll(".fips_" + d.id + ".caption.y" + year)
			.text("with assistance")
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return d["properties"][a + year]});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return d["properties"][a + "Num" + year]});
		d3.selectAll(".fips_" + d.id + " .asst.bar" + ".y" + year).classed("hover", true);
	}
	function deHover(){
		// var year = getYear();
		var year = d3.select(this).attr("data-year")
		console.log(year)
		var a = getAssistance();
		d3.selectAll(".fips_" + d.id + ".caption.y" + year)
			.text("")
		d3.selectAll(".fips_" + d.id + ".bar.text" + ".y" + year)
			.text(function(d){ return d["properties"][a + year]});
		d3.selectAll(".fips_" + d.id + ".total.units" + ".y" + year)
			.text(function(d){ return d["properties"][a + "Num" + year]});
		d3.selectAll(".bar.hover" + ".y" + year).classed("hover",false);
	}

	});
	dispatch.on("deselectCounty.details", function(identifier){
//Note: indexOf not supported in IE 7 and 8
		var index = selectedCounties.indexOf(identifier)
		selectedCounties.splice(index)
		var li = d3.select("#" + identifier)
		li.transition()
	 		.duration(200)
		 	.style("height", "0px")
		 	.style("opacity", 0)
		 	.transition()
		 	.duration(0)
		 	.style("display", "none")
		 	.attr("class", "garbage");
		dispatch.updateTooltip();
		pymChild.sendHeight();
	})
	dispatch.on("changeYear.details", function(year){
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
			.text(year)
		d3.selectAll(".detail.totalPop.detail")
			.attr("data-year", year)
			.text(function(d){ return d["properties"]["totalPop" +  year]})
		d3.selectAll(".detail.bar.text")
			.attr("data-year", year)
			.text(function(d){ return d["properties"][a + year]})
		d3.selectAll(".detail.total.units")
			.attr("data-year", year)
			.text(function(d){ return d["properties"][a + "Num" + year]})
		d3.selectAll(".detail.total.bar .display.bar")
			.attr("data-year", year)
			.transition()
			.style("width", function(d){
				// var year = d3.select(this).attr("data-year")
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
				// var year = d3.select(this).attr("data-year")
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
				// var year = d3.select(this).attr("data-year")
				var asst = d.properties["asst" + year]
				var noAsst = d.properties["noAsst" + year]
				if(a == "noAsst"){
					return COLORS[quantize(noAsst)]
				}
				else{
					return COLORS[quantize(asst)]
				}
			})
			d3.selectAll(".detail.total.bar .asst.bar")
				.attr("data-year", year)
				.transition()
				.style("width", function(d){
					var asst = d.properties["asst" + year]
					return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
				})
			d3.selectAll(".detail.total.bar .bar.marker")
				.attr("data-year", year)
				.transition()
				.style("width", function(d){
					var asst = d.properties["asst" + year]
					var noAsst = d.properties["noAsst" + year]
					// if(a == "noAsst"){
						return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
					// }
					// else{
						// return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
					// }
				})

	})
	dispatch.on("changeAssistance.details", function(a){
		// var year = getYear();
		var year;
		d3.selectAll(".bar.text")
			.text(function(d){ year = d3.select(this).attr("data-year"); return d["properties"][a + year]})
		d3.selectAll(".total.units")
			.text(function(d){ year = d3.select(this).attr("data-year"); return d["properties"][a + "Num" + year]})
		d3.selectAll(".total.bar .display.bar")
			.transition()
			.style("width", function(d){
				// var year = d3.select(this).attr("data-year")
				var year = d3.select(this).attr("data-year");
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
				// var year = d3.select(this).attr("data-year")
				var year = d3.select(this).attr("data-year");
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
				// var year = d3.select(this).attr("data-year")
				var year = d3.select(this).attr("data-year");
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



