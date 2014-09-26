function BarChart(area, data, options) {
    var cnfg = {
        marginTop: 40,
        marginRight: 20,
        marginBottom: 40,
        marginLeft: 50,
        chartTitle: "",
        xAxisTitle: "",
        yAxisTitle: "",
        barBottomColor: "#447fb0",
        barTopColor: "#315a7c",
        barBorderColor: "#23415a",
        barBottomHighlightColor: "#be4620",
        barTopHighlightColor: "#a42800",
        barBorderHighlightColor: "#531400",
        valuePrecision: 2
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

    this.globalBarNum = globalBarNumber++;

    $("body").append('<div id="bar-tooltip' + this.globalBarNum + '"></div>');
    $("#bar-tooltip" + this.globalBarNum).css({"position": "absolute", "background": "rgba(0, 0, 0, 0.8)", "color": "white", "font-family": "Arial", "font-size": "14px", "font-weight": "lighter", "z-index": "100", "pointer-events": "none"});
    $("#bar-tooltip" + this.globalBarNum).append('<div id="bar-tooltip-content' + this.globalBarNum + '" style="padding: 5px 10px 5px 10px;">');
    $("#bar-tooltip-content" + this.globalBarNum).append('<span id="bar-tooltip-desc' + this.globalBarNum + '" style="font-size: 12px;">desc of tooltip</span><br/>');
    $("#bar-tooltip-content" + this.globalBarNum).append('<span id="bar-tooltip-value' + this.globalBarNum + '" style="font-size: 16px;">value of tooltip</span>');

    $("#bar-tooltip" + this.globalBarNum).append('<svg style="position: absolute; width: 12px; height: 12px;"><polygon points="0,0 12,0 6,10" style="background: black; fill: rgba(0, 0, 0, 0.8);"></polygon></svg>');

    $("#bar-tooltip" + this.globalBarNum).hide();

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
        var barNum = this.globalBarNum;
        var dataArray = this.dataArray;

        var chartWidth = $(areaId).width() - chartMargin.left - chartMargin.right;
        var chartHeight = $(areaId).height() - chartMargin.top - chartMargin.bottom;

        var svg = d3.select(areaId)
                .append("svg")
                .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                .style("font-size", "10px")
                .style("font-family", "sans-serif");

        var barChartGroup = svg.append("g")
                .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        // gradients
        var defs = barChartGroup.append("defs");
        var grad = defs.append("linearGradient")
                .attr("id", "barGrad-" + barNum)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
        grad.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", cnfg.barBottomColor)
                .attr("stop-opacity", 1);
        grad.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", cnfg.barTopColor)
                .attr("stop-opacity", 1);
        var highlightGrad = defs.append("linearGradient")
                .attr("id", "barHighlightGrad-" + barNum + "-2")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
        highlightGrad.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", cnfg.barBottomHighlightColor)
                .attr("stop-opacity", 1);
        highlightGrad.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", cnfg.barTopHighlightColor)
                .attr("stop-opacity", 1);

        var xScale = d3.scale.ordinal()
                .domain(dataArray.map(function(d) {
                    return d.name;
                }))
                .rangeRoundBands([0, chartWidth], 0.4, 0.2);

        var minYValue = d3.min(dataArray.map(function(d) {
            return d.value;
        })) - 5 < 0 ? 0 : d3.min(dataArray.map(function(d) {
            return d.value;
        })) - 5;
        minYValue = minYValue.toFixed(cnfg.valuePrecision);
        minYValue = +minYValue;
        var maxYValue = d3.max(dataArray.map(function(d) {
            return d.value;
        })) + 1;
        maxYValue = maxYValue.toFixed(cnfg.valuePrecision);
        maxYValue = +maxYValue;
        var yScale = d3.scale.linear()
                .domain([minYValue, maxYValue])
                .range([chartHeight, 0], 0.5);

        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

        barChartGroup.append("g")
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

        barChartGroup.selectAll("rect")
                .data(dataArray)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("rx", 2)
                .attr("ry", 2)
                .attr("x", function(d, i) {
                    return xScale(d.name); // <-- Set x values
                })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d) {
                    return chartHeight;
                })
                .attr("height", 0)
                .attr("fill", "url(#barGrad-" + barNum + ")")
                .attr("stroke-width", "1px")
                .attr("stroke", cnfg.barBorderColor)
                .transition()
                .duration(1000)
                .ease("cubic-in-out")
                .attr("y", function(d, i) {
                    return yScale(d.value);
                })
                .attr("height", function(d) {
                    return chartHeight - yScale(d.value);
                });

        barChartGroup.selectAll("rect")
                .on("mouseover", function(d, i) {
                    d3.select(this)
                            .attr("stroke", cnfg.barBorderHighlightColor)
                            .attr("fill", "url(#barHighlightGrad-" + barNum + "-2)");

                    var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("x")) + (Number(d3.select(this).attr("width")) / 2);
                    var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("y")) - 58;

                    d3.select("#bar-tooltip-desc" + barNum).text(d.name);
                    var tipValue = (d.value).toFixed(cnfg.valuePrecision);
                    tipValue = +tipValue;
                    d3.select("#bar-tooltip-value" + barNum).text(tipValue);
                    d3.select("#bar-tooltip" + barNum)
                            .transition()
                            .style("display", "block")
                            .style("left", posX + "px")
                            .style("top", posY + "px");

                    if (i === dataArray.length - 1) { // last data point
                        //console.log("i: " + i);
                    }

                })
                .on("mousemove", function(d, i) {
                })
                .on("mouseout", function(d, i) {
                    d3.select(this)
                            .attr("stroke", cnfg.barBorderColor)
                            .attr("fill", "url(#barGrad-" + barNum + ")");

                    d3.select("#bar-tooltip" + barNum)
                            .transition()
                            .style("display", "none");
                });

        barChartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrapBarText, xScale.rangeBand());

        barChartGroup.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(cnfg.yAxisTitle);

        // title
        barChartGroup.append("text")
                .attr("x", (chartWidth / 2))
                .attr("y", 5 - (chartMargin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(cnfg.chartTitle);
    };

    // function to wrap x axis tick lables
    function wrapBarText(text, width) {
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
}

var globalBarNumber = 0;