function NormRadarChart(area, data, options) {
    var cnfg = {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 40,
        marginLeft: 50,
        w: 600,
        h: 600,
        factor: 1,
        factorLegend: .85,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 100,
        ExtraWidthY: 100,
        valuePrecision: 2,
        colors: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#AAAA11", "#E67300", "#B77322", "#16D620"]
    };

    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cnfg[i] = options[i];
            }
        }
    }

    var color = d3.scale.ordinal()
            .range(cnfg.colors);

    var legendHeight = 50;
    if (legendHeight > cnfg.TranslateY) {
        cnfg.TranslateY = legendHeight;
    }

    var areaId = area.charAt(0) === "#" ? area : "#" + area;
    var chartMargin = {top: cnfg.marginTop, right: cnfg.marginRight, bottom: cnfg.marginBottom, left: cnfg.marginLeft};

    this.globalNormRadarNum = globalNormRadarNumber++;

    $("body").append('<div id="norm-radar-tooltip' + this.globalNormRadarNum + '"></div>');
    $("#norm-radar-tooltip" + this.globalNormRadarNum).css({"position": "absolute", "background": "rgba(0, 0, 0, 0.8)", "color": "white", "font-family": "Arial", "font-size": "14px", "font-weight": "lighter", "z-index": "100", "pointer-events": "none"});
    $("#norm-radar-tooltip" + this.globalNormRadarNum).append('<div id="norm-radar-tooltip-content' + this.globalNormRadarNum + '" style="padding: 5px 10px 5px 10px;">');
    $("#norm-radar-tooltip-content" + this.globalNormRadarNum).append('<span id="norm-radar-tooltip-title' + this.globalNormRadarNum + '" style="font-size: 20px;">title of tooltip</span><br/>');
    $("#norm-radar-tooltip-content" + this.globalNormRadarNum).append('<span id="norm-radar-tooltip-desc' + this.globalNormRadarNum + '" style="font-size: 12px;">desc of tooltip</span><br/>');
    $("#norm-radar-tooltip-content" + this.globalNormRadarNum).append('<span id="norm-radar-tooltip-value' + this.globalNormRadarNum + '" style="font-size: 16px;">12</span>');

    $("#norm-radar-tooltip" + this.globalNormRadarNum).append('<svg style="position: absolute; width: 12px; height: 12px;"><polygon points="0,0 12,0 6,10" style="background: black; fill: rgba(0, 0, 0, 0.8);"></polygon></svg>');

    $("#norm-radar-tooltip" + this.globalNormRadarNum).hide();

    this.dataArray = data;

    this.setData = function(newData) {
        this.dataArray = newData;
    };

    this.draw = function() {
        d3.select(areaId).select("svg").remove();
        var normRadarNum = this.globalNormRadarNum;
        var dataArray = this.dataArray;
		
		$("#norm-radar-tooltip" + parseInt(normRadarNum)).hide();
		
		// calculating all chart margins
		var chartWidth = $(areaId).width();// - chartMargin.left - chartMargin.right;
		var chartHeight = $(areaId).height();// - chartMargin.top - chartMargin.bottom;
		var radarWidth = Math.min(chartWidth, chartHeight) - 88;
		var extraChartWidth = chartWidth - radarWidth;
		var extraChartHeight = chartHeight - radarWidth;
		var translateRadarX = (chartWidth / 2) - (radarWidth / 2);
		var translateRadarY = (chartHeight / 2) - (radarWidth / 2) + 15;
		
		cnfg.w = cnfg.h = radarWidth;
		cnfg.ExtraWidthX = extraChartWidth;
		cnfg.ExtraWidthY = extraChartHeight;
		cnfg.TranslateX = translateRadarX;
		cnfg.TranslateY = translateRadarY;
		
		// convert all null values to NaN
		dataArray.map(function(d1) {
            d1.data.map(function(d2) {
				if(d2.value === null || d2.value === "null" || d2.value === NaN){
					d2.value = "NaN";
				}
            });
        });

        var normRadarMaxValue = Math.max(cnfg.maxValue, d3.max(dataArray.map(function(d1) {
            return d3.max(d1.data.map(function(d2) {
                return d2.value;
            }));
        })));

        var allAxis = dataArray[0].data.map(function(d1) {
            return d1;
        });

        var total = allAxis.length;
        var radius = cnfg.factor * Math.min(cnfg.w / 2, cnfg.h / 2);

        var svg = d3.select(areaId)
                .append("svg")
                .attr("width", cnfg.w + cnfg.ExtraWidthX)
                .attr("height", cnfg.h + cnfg.ExtraWidthY)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", "1.1");
        
        var normRadarChartGroup = svg.append("g")
                .attr("id", "viewport")
                .attr("transform", "translate(" + cnfg.TranslateX + "," + cnfg.TranslateY + ")");

        //Circular segments
        for (var j = 0; j < cnfg.levels; j++) { // removed -1 at j<cfg.levels - 1
            var levelFactor = cnfg.factor * radius * ((j + 1) / cnfg.levels);
            normRadarChartGroup.selectAll(".levels")
                    .data(allAxis)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(d, i) {
                        return levelFactor * (1 - cnfg.factor * Math.sin(i * cnfg.radians / total));
                    })
                    .attr("y1", function(d, i) {
                        return levelFactor * (1 - cnfg.factor * Math.cos(i * cnfg.radians / total));
                    })
                    .attr("x2", function(d, i) {
                        return levelFactor * (1 - cnfg.factor * Math.sin((i + 1) * cnfg.radians / total));
                    })
                    .attr("y2", function(d, i) {
                        return levelFactor * (1 - cnfg.factor * Math.cos((i + 1) * cnfg.radians / total));
                    })
                    .attr("class", "line")
                    .style("stroke", "grey")
                    .style("stroke-opacity", "0.75")
                    .style("stroke-width", "0.3px")
                    .attr("transform", "translate(" + (cnfg.w / 2 - levelFactor) + ", " + (cnfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
        /*for (var j = 0; j < cnfg.levels; j++) {
            var levelFactor = cnfg.factor * radius * ((j + 1) / cnfg.levels);
            var axisValue = ((j + 1) * radarMaxValue / cnfg.levels).toFixed(cnfg.valuePrecision);
            axisValue = +axisValue; // drops any "extra" zeroes at the end
            radarChartGroup.selectAll(".levels")
                    .data([1]) //dummy data
                    .enter()
                    .append("svg:text")
                    .attr("x", function(d) {
                        return levelFactor * (1 - cnfg.factor * Math.sin(0));
                    })
                    .attr("y", function(d) {
                        return levelFactor * (1 - cnfg.factor * Math.cos(0));
                    })
                    .attr("class", "legend")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .attr("transform", "translate(" + (cnfg.w / 2 - levelFactor + cnfg.ToRight) + ", " + (cnfg.h / 2 - levelFactor) + ")")
                    .attr("fill", "#737373")
                    .text(axisValue);
        }*/

        series = 0;

        var axis = normRadarChartGroup.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");

        axis.append("line")
                .attr("x1", cnfg.w / 2)
                .attr("y1", cnfg.h / 2)
                .attr("x2", function(d, i) {
                    return cnfg.w / 2 * (1 - cnfg.factor * Math.sin(i * cnfg.radians / total));
                })
                .attr("y2", function(d, i) {
                    return cnfg.h / 2 * (1 - cnfg.factor * Math.cos(i * cnfg.radians / total));
                })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");
				
        var legs = axis.append("text")
                .attr("class", "legend")
				//.attr("onclick", function(d, i){
				//	return "fetchCustomData(" + d.id + ", \"" + d.axis.toString() + "\")";
				//})
                .text(function(d) {
                    return d.axis;
                })
				//.style("cursor", "pointer")
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", function(data, i) {
                    if (i === 0) {
                        return "middle";
                    } else {
                        var rmndr = dataArray[0].data.length % 2;
                        if (rmndr === 0) {
                            if (i < (dataArray[0].data.length / 2)) {
                                return "end";
                            } else if (i === (dataArray[0].data.length / 2)) {
                                return "middle";
                            } else {
                                return "start";
                            }
                        } else {
                            if (i <= (dataArray[0].data.length / 2)) {
                                return "end";
                            } else {
                                return "start";
                            }
                        }
                    }
                })
                .attr("dy", "1.5em")
                .attr("transform", function(d, i) {
                    return "translate(0, -10)";
                })
                .attr("x", function(d, i) {
                    return cnfg.w / 2 * (1 - cnfg.factorLegend * Math.sin(i * cnfg.radians / total)) - 5 * Math.sin(i * cnfg.radians / total);
                    //return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);
                })
                .attr("y", function(d, i) {
                    return cnfg.h / 2 * (1 - Math.cos(i * cnfg.radians / total)) - 20 * Math.cos(i * cnfg.radians / total);
                });
                
//        legs.attr("title", function(d, i){
//            return dataArray[0].data[i].axisdesc;
//        })
//        .attr("data-toggle", "tooltip")
//        .attr("data-placement", "top");

        // ---- lines and points ----

        dataArray.forEach(function(y, x) {
            var lineData = y.data.map(function(d) {
                return d;
            });
            // lineData =  [{ axis="Institutions", value=0.59}, { axis="Human Capital & Research", value=0.56}]
            for (var i = 0; i < lineData.length; i++) {
                var x1 = 0, y1, x2, y2;
                if (i === lineData.length - 1) { // last data point
                    if (!isNaN(lineData[i].value)) {
                        if (!isNaN(lineData[0].value)) {
                            // lines
                            x1 = cnfg.w / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin(i * cnfg.radians / total));
                            y1 = cnfg.h / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos(i * cnfg.radians / total));

                            x2 = cnfg.w / 2 * (1 - (Math.max(lineData[0].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin((0) * cnfg.radians / total));
                            y2 = cnfg.h / 2 * (1 - (Math.max(lineData[0].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos((0) * cnfg.radians / total));
                            normRadarChartGroup.append("line")
                                    .attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x2)
                                    .attr("y2", y2)
                                    .style("stroke", color(series))
                                    .style("stroke-width", "3px");
                        }
                        // dots
                        var radarPoint = normRadarChartGroup.append("circle")
                                .attr("class", "radar-chart-serie" + series)
                                .attr("cx", function() {
                                    return cnfg.w / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin(i * cnfg.radians / total));
                                })
                                .attr("cy", function() {
                                    return cnfg.h / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos(i * cnfg.radians / total));
                                })
                                .attr("fill", color(series))
                                .attr("fill-opacity", 1)
                                .attr("stroke", color(series))
                                .attr("stroke-opacity", 0.2)
                                .attr("r", 0)
                                .attr("stroke-width", 0)
                                .attr("data-i", i);
                        radarPoint.transition()
                                .delay(200)
                                .duration(500)
                                .attr("r", 3) // 3
                                .attr("stroke-width", 6); // 6
                        radarPoint.on('mouseover', function() {
                            var i = d3.select(this).attr("data-i");
                            var dotData = lineData[i];
                            d3.select(this)
                                    .transition()
                                    .duration(250)
                                    .attr("r", 6); // 8

                            var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("cx")) - 6;
                            var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("cy")) - 90;

                            var tipValue = (dotData.dispvalue).toFixed(cnfg.valuePrecision);
                            tipValue = +tipValue; // drop any "extra" zeroes at the end

                            d3.select("#norm-radar-tooltip-title" + normRadarNum).text(function() {
                                return dataArray[x].name;
                            });
                            d3.select("#norm-radar-tooltip-value" + normRadarNum).text(tipValue);
                            d3.select("#norm-radar-tooltip-desc" + normRadarNum).text(dotData.axis);
                            d3.select("#norm-radar-tooltip" + normRadarNum)
                                    .transition()
                                    .style("display", "block")
                                    .style("left", posX + "px")
                                    .style("top", posY + "px");

                        })
                                .on('mouseout', function() {
                                    d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("r", 3); // 3

                                    d3.select("#norm-radar-tooltip" + normRadarNum)
                                            .transition()
                                            .style("display", "none");

                                });
                    }
                } else { // other points
                    if (!isNaN(lineData[i].value)) {
                        if (!isNaN(lineData[i + 1].value)) {
                            // lines
                            x1 = cnfg.w / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin(i * cnfg.radians / total));
                            y1 = cnfg.h / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos(i * cnfg.radians / total));

                            x2 = cnfg.w / 2 * (1 - (Math.max(lineData[i + 1].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin((i + 1) * cnfg.radians / total));
                            y2 = cnfg.h / 2 * (1 - (Math.max(lineData[i + 1].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos((i + 1) * cnfg.radians / total));
                            normRadarChartGroup.append("line")
                                    .attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x2)
                                    .attr("y2", y2)
                                    .attr("stroke", color(series))
                                    .style("stroke-width", "3px");
                        }
                        // dots
                        var radarPoint = normRadarChartGroup.append("circle")
                                .attr("class", "radar-chart-serie" + series)
                                .attr("cx", function() {
                                    return cnfg.w / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.sin(i * cnfg.radians / total));
                                })
                                .attr("cy", function() {
                                    return cnfg.h / 2 * (1 - (Math.max(lineData[i].value, 0) / normRadarMaxValue) * cnfg.factor * Math.cos(i * cnfg.radians / total));
                                })
                                .attr("fill", color(series))
                                .attr("fill-opacity", 1)
                                .attr("stroke", color(series))
                                .attr("stroke-opacity", 0.2)
                                .attr("r", 0)
                                .attr("stroke-width", 0)
                                .attr("data-i", i);
                        radarPoint.transition()
                                .delay(200)
                                .duration(500)
                                .attr("r", 3) // 3
                                .attr("stroke-width", 6);
                        radarPoint.on('mouseover', function() {
                            var i = d3.select(this).attr("data-i");
                            var dotData = lineData[i];
                            d3.select(this)
                                    .transition()
                                    .duration(250)
                                    .attr("r", 6); // 8

                            var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("cx")) - 6;
                            var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("cy")) - 90;

                            var tipValue = (dotData.dispvalue).toFixed(cnfg.valuePrecision);
                            tipValue = +tipValue; // drop any "extra" zeroes at the end

                            d3.select("#norm-radar-tooltip-title" + normRadarNum).text(function() {
                                return dataArray[x].name;
                            });
                            d3.select("#norm-radar-tooltip-value" + normRadarNum).text(tipValue);
                            d3.select("#norm-radar-tooltip-desc" + normRadarNum).text(dotData.axis);
                            d3.select("#norm-radar-tooltip" + normRadarNum)
                                    .transition()
                                    .style("display", "block")
                                    .style("left", posX + "px")
                                    .style("top", posY + "px");

                        })
                                .on('mouseout', function() {
                                    d3.select(this)
                                            .transition()
                                            .duration(250)
                                            .attr("r", 3); // 3

                                    d3.select("#norm-radar-tooltip" + normRadarNum)
                                            .transition()
                                            .style("display", "none");

                                });
                    }
                }
            }
            series++;
        });
        //

        // legend
        var radarLegendGroup = svg.append("g")
                .attr("id", "radarLegendGroup")
                .attr("transform", "translate(" + 0 + ", " + chartMargin.top + ")");

        var segmentWidth = (cnfg.w + cnfg.ExtraWidthX) / dataArray.length;
        //Create color squares
        radarLegendGroup.selectAll(".clrsqrbox")
                .data(dataArray)
                .enter()
                .append("rect")
                .attr("y", 0)
                .attr("width", 28)
                .attr("height", 16)
                .attr("rx", 1)
                .attr("ry", 1)
                .style("stroke", "#888888")
                .style("stroke-width", "1px")
                .style("fill", "none")
                .attr("x", function(d, i) {
                    return (i * segmentWidth) + (segmentWidth / 3) - 2;
                });
        radarLegendGroup.selectAll(".clrsqr")
                .data(dataArray)
                .enter()
                .append("rect")
                .attr("y", 2)
                .attr("width", 24)
                .attr("height", 12)
                .attr("rx", 1)
                .attr("ry", 1)
                .style("fill", function(d, i) {
                    return color(i);
                })
                .attr("x", function(d, i) {
                    return (i * segmentWidth) + (segmentWidth / 3);
                });

        //Create legend text next to squares
        radarLegendGroup.selectAll('text')
                .data(dataArray)
                .enter()
                .append("text")
                .attr("y", 13)
                .style("font-size", "14px")
                .attr("fill", "#00152E")
                .attr("class", "legendText")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return (i * segmentWidth) + (segmentWidth / 3) + 34;
                });

    };
}

var globalNormRadarNumber = 0;