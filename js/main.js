var STATES = { "Alabama": "AL", "Alaska": "AK", "American Samoa": "AS", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Federated States Of Micronesia": "FM", "Florida": "FL", "Georgia": "GA", "Guam": "GU", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Marshall Islands": "MH", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Northern Mariana Islands": "MP", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Palau": "PW", "Pennsylvania": "PA", "Puerto Rico": "PR", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virgin Islands": "VI", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "WY": "Wyoming" }
var pymChild = null;
var selectedCounties = [];
var BAR_WIDTH = 200.0;
var drawDetail = function(d){
	var detail;
}
function drawGraphic(containerWidth){
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);
	function dragstarted(d) {
	  d3.event.sourceEvent.stopPropagation();
	  d3.select(this).classed("dragging", true);
	}

	function dragged(d) {
	  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
	}

	function dragended(d) {
	  d3.select(this).classed("dragging", false);
	}


	var dispatch = d3.dispatch("load", "changeYear", "changeAssistance", "selectCounty", "deselectCounty", "zoomIn","zoomOut");
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
			"q4-5": "#000000",
		}

	var GREYS = 
		{
			"q0-5": "#ccc",
			"q1-5": "#aaa",
			"q2-5": "#777",
			"q3-5": "#444",
			"q4-5": "#111",
		}

	// var GREYS = 
	// 	{
	// 		"q0-5": "#b0d5f1",
	// 		"q1-5": "#82c4e9",
	// 		"q2-5": "#1696d2",
	// 		"q3-5": "#00578b",
	// 		"q4-5": "#000000",
	// 	}

	var getAssistance = function(){
		var btn = d3.select(".assistance.button.active");
		if (btn.classed("turnOn")){return "asst"}
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
			.transition()
			.style("fill", function(d){
					if(d.properties.ignore != "1") {return COLORS[quantize(d.properties[a +  year])];}
					else{ return GREYS[quantize(d.properties[a +  year])]; }
			})
	});

	d3.selectAll("svg").remove();
	d3.selectAll(".tooltip").remove();
	// d3.selectAll(".text.container").remove();
	d3.selectAll(".custom-combobox").remove();
	d3.selectAll("#combobox").remove();
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

	var g = svg.append("g")

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
	    .attr("id", "counties")
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
	          	return ignored + " " + fips;
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

	var legend = g.append("g")
		.attr("id", "legend")

	function clicked(d) {
		console.log(d)
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
				console.log("sweet")
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
		// console.log(width, height, g)
		// console.log(path)
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
		// console.log(width, height, g)
		// console.log(path)
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
			console.log(lastK)
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
		var container = sidebar.append("div")
			.attr("class", "text container")
		container.append("div")
			.attr("class", "county-name")
			.text("Matanuska-Susitna Borough")
		container.append("div")
			.attr("class", "state-name")
			.text("Alaska")
		container.append("div")
			.attr("class", "relative number")
			.text("2 units for every 100 ELI renters")
		container.append("div")
			.attr("class", "absolute number")
			.text("X renters")

		sidebar.append("div")
			.attr("class", "zoom in")
			.text("+")
			.on("click", function(){ dispatch.zoomIn() })
		sidebar.append("div")
			.attr("class", "zoom out")
			.text("-")
			.on("click", function(){ dispatch.zoomOut() })


	})

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
		d3.select(".detail.list")
			.append("li")
			.classed("national", true)
			.classed("show", true)
			.text("The USA data goes here")
		// pymChild.sendHeight();
	})
	dispatch.on("selectCounty.details", function(d){
		d3.selectAll(".garbage").remove();
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
				.on("click", function(){dispatch.deselectCounty(identifier)})
				.append("img")
				.attr("src","/images/close-button.png");

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
				.datum(d)
				.style("width", (parseFloat(asst/100.0) * BAR_WIDTH) + "px");

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

		pymChild.sendHeight();
	})
	dispatch.on("changeYear.details", function(year){
		var a = getAssistance();
		d3.selectAll(".display.bar")
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
			d3.selectAll(".asst.bar")
				.transition()
				.style("width", function(d){
					var asst = d.properties["asst" + year]
					return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
				})
			d3.selectAll(".bar.marker")
				.transition()
				.style("width", function(d){
					var asst = d.properties["asst" + year]
					var noAsst = d.properties["noAsst" + year]
					if(a == "noAsst"){
						return (parseFloat(asst/100.0) * BAR_WIDTH) + "px"
					}
					else{
						return (parseFloat(noAsst/100.0) * BAR_WIDTH) + "px"
					}
				})

	})
	dispatch.on("changeAssistance.details", function(a){
		var year = getYear();
		d3.selectAll(".display.bar")
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

