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
		d3.select("body")
			.selectAll("div")
			.data(topojson.feature(us, us.objects.UScounties).features.filter(function(obj){ return fips.indexOf(""+obj.id) != -1}))
			.enter()
			.append("div")
			.text(function(d){return d.properties.FIPS})
			.attr("class","scatter")

				      // .data(topojson.feature(us, us.objects.UScounties).features)
	});	
}

pymChild = new pym.Child({ renderCallback: drawGraphic, polling: 50});

