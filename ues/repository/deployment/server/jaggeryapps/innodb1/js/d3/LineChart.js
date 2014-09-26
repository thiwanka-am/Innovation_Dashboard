function LineChart(area, data, options) {
    var cnfg = {
        marginTop: 40,
        marginRight: 20,
        marginBottom: 40,
        marginLeft: 50,
        chartTitle: "",
        xAxisTitle: "",
        yAxisTitle: "",
        lineColor: "#A52A2A",
        valuePrecision: 2,
        nanMessage: "Not available"
    };

    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cnfg[i] = options[i];
            }
        }
    }

    var areaId = area.charAt(0) === "#" ? area : "#" + area;
    var chartMargin = {top: cnfg.marginTop, right: cnfg.marginRight, bottom: cnfg.marginBottom, left: cnfg.marginLeft};

    this.globalLineNum = globalLineNumber++;

    $("body").append('<div id="line-tooltip' + this.globalLineNum + '"></div>');
    $("#line-tooltip" + this.globalLineNum).css({"position": "absolute", "background": "rgba(0, 0, 0, 0.8)", "color": "white", "font-family": "Arial", "font-size": "14px", "font-weight": "lighter", "z-index": "100", "pointer-events": "none"});
    $("#line-tooltip" + this.globalLineNum).append('<div id="line-tooltip-content' + this.globalLineNum + '" style="padding: 5px 10px 5px 10px;">');
    $("#line-tooltip-content" + this.globalLineNum).append('<span id="line-tooltip-desc' + this.globalLineNum + '" style="font-size: 12px;">desc of tooltip</span><br/>');
    $("#line-tooltip-content" + this.globalLineNum).append('<span id="line-tooltip-value' + this.globalLineNum + '" style="font-size: 16px;">12</span>');

    $("#line-tooltip" + this.globalLineNum).append('<svg style="position: absolute; width: 12px; height: 12px;"><polygon points="0,0 12,0 6,10" style="background: black; fill: rgba(0, 0, 0, 0.8);"></polygon></svg>');

    $("#line-tooltip" + this.globalLineNum).hide();

    this.dataArray = data;

    this.setData = function(newData) {
        this.dataArray = newData;
    };
    
    this.setOptions = function(newOptions) {
    	if ('undefined' !== typeof newOptions) {
            for (var i in newOptions) {
                if ('undefined' !== typeof newOptions[i]) {
                    cnfg[i] = newOptions[i];
                }
            }
        }
    };

    this.draw = function() {
        d3.select(areaId).select("svg").remove();
        var lineNum = this.globalLineNum;
        var dataArray = this.dataArray;

        var chartWidth = $(areaId).width() - chartMargin.left - chartMargin.right;
        var chartHeight = $(areaId).height() - chartMargin.top - chartMargin.bottom;

        var svg = d3.select(areaId)
                .append("svg")
                .attr("class", "d3-line-chart")
                .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                .style("font-size", "10px")
                .style("font-family", "sans-serif");

        var lineChartGroup = svg.append("g")
                .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        var xScale = d3.scale.ordinal()
                .domain(dataArray.map(function(d) {
                    return d.name;
                }))
                .rangeRoundBands([0, chartWidth], 1, 0.3);

        var minYValue = (d3.min(dataArray.map(function(d) {
            return d.value;
        })) - 5) < 0 ? 0 : (d3.min(dataArray.map(function(d) {
            return d.value;
        })) - 5);

        var maxYValue = d3.max(dataArray.map(function(d) {
            return d.value;
        })) + 1;

        var yScale = d3.scale.linear()
                .domain([minYValue, maxYValue])
                .range([chartHeight, 0]);

        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

        var line = d3.svg.line()
                .x(function(d, i) {
                    return xScale(dataArray[i].name);
                })
                .y(function(d, i) {
                    if (isNaN(d)) {
                        // find previous not nan value
                        var prevI = i - 1;
                        while (isNaN(dataArray[prevI].value)) {
                            prevI--;
                        }
                        // find previous not nan value
                        var nextI = i + 1;
                        while (isNaN(dataArray[nextI].value)) {
                            nextI++;
                        }
                        var val = dataArray[prevI].value + (((dataArray[nextI].value - dataArray[prevI].value) / (nextI - prevI)) * (i - prevI));
                        return yScale(val);
                    }
                    return yScale(dataArray[i].value);
                })
                .interpolate("linear");

        lineChartGroup.append("g")
                .selectAll("g.rule")
                .data(yScale.ticks())
                .enter()
                .append("g")
                .attr("class", "rule")
                .append("line")
                .style("stroke", "#dddddd")
                .style("shape-rendering", "crispEdges")
                .attr("y1", yScale)
                .attr("y2", yScale)
                .attr("x1", 0)
                .attr("x2", chartWidth);

        lineChartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (chartHeight) + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrapLineText, xScale.rangeBand());

        lineChartGroup.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(cnfg.yAxisTitle);

        // chart title
        lineChartGroup.append("text")
                .attr("x", (chartWidth / 2))
                .attr("y", 5 - (chartMargin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(cnfg.chartTitle);
        

        var path = lineChartGroup.append("path")
                .datum(dataArray.map(function(d) {
                    return d.value;
                }))
                .style("stroke", cnfg.lineColor)
                .style("stroke-width", "4px")
                .style("fill", "none")
                .attr("d", line)
                .transition()
                .duration(500)
                .ease("linear")
                .attrTween("stroke-dasharray", tweenDash);

        var pointsLine = lineChartGroup.append("g")
                .selectAll("circle")
                .data(dataArray)
                .enter()
                .append("circle")
                .attr("fill", cnfg.lineColor)
                .attr("fill-opacity", 1)
                .attr("stroke", cnfg.lineColor)
                .attr("stroke-opacity", 0.2)
                .attr("r", 0)
                .attr("stroke-width", 0);
        pointsLine.transition()
                .delay(200)
                .duration(500)
                .attr("cx", line.x())
                .attr("cy", function(d, i) {
                    if (isNaN(d.value)) {
                        // find previous not nan value
                        var prevI = i - 1;
                        while (isNaN(dataArray[prevI].value)) {
                            prevI--;
                        }
                        // find previous not nan value
                        var nextI = i + 1;
                        while (isNaN(dataArray[nextI].value)) {
                            nextI++;
                        }
                        var val = dataArray[prevI].value + (((dataArray[nextI].value - dataArray[prevI].value) / (nextI - prevI)) * (i - prevI));
                        return yScale(val);
                    }
                    return yScale(dataArray[i].value);
                })
                .attr("r", function(d, i) {
                    if (isNaN(d.value)) {
                        return 2;
                    }
                    return 3;
                })
                .attr("stroke-width", function(d, i) {
                    if (isNaN(d.value)) {
                        return 4;
                    }
                    return 6;
                });
        pointsLine.on("mouseover", function(d, i) {
            var tipValue = 0;
            var pointR = 0;

            if (isNaN(d.value)) {
                tipValue = cnfg.nanMessage;
                pointR = 2;
            } else {
                tipValue = (Number(d.value)).toFixed(cnfg.valuePrecision);
                tipValue = +tipValue; // drops any "extra" zeroes at the end
                pointR = 8;
            }

            d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("r", pointR);

            var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("cx")) - 6;
            var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("cy")) - 68;

            d3.select("#line-tooltip-desc" + lineNum).text(d.name);
            d3.select("#line-tooltip-value" + lineNum).text(tipValue);
            d3.select("#line-tooltip" + lineNum)
                    .transition()
                    .style("display", "block")
                    .style("left", posX + "px")
                    .style("top", posY + "px");
        })
                .on("mouseout", function(d, i) {
                    var pointR = 0;

                    if (isNaN(d.value)) {
                        pointR = 2;
                    } else {
                        pointR = 3;
                    }

                    d3.select(this)
                            .transition()
                            .duration(250)
                            .attr("r", pointR);

                    d3.select("#line-tooltip" + lineNum)
                            .transition()
                            .style("display", "none");
                });


        // function to animate line chart
        function tweenDash() {
            var l = this.getTotalLength();
            var i = d3.interpolateString("0," + l, l + "," + l);
            return function(t) {
                return i(t);
            };
        }

        // function to wrap x axis tick lables
        function wrapLineText(text, width) {
            text.each(function() {
                var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

    };
}

var globalLineNumber = 0;