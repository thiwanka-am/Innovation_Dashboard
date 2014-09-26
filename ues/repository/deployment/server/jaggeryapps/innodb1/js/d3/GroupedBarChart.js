function GroupedBarChart(area, data, options) {
    var cnfg = {
        marginTop: 40,
        marginRight: 20,
        marginBottom: 40,
        marginLeft: 50,
        chartTitle: "",
        xAxisTitle: "",
        yAxisTitle: "",
        barHighlightColor: "#109618",
        barHighlightColorRotationDegree: 20,
        barBorderColor: "#23415a",
        barBorderHighlightColor: "#531400",
        colors: ["#990099", "#0099C6", "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"],
        colorRotationDegree: 20,
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

    this.globalGroupedBarNum = globalGroupedBarNumber++;

    $("body").append('<div id="grouped-bar-tooltip' + this.globalGroupedBarNum + '"></div>');
    $("#grouped-bar-tooltip" + this.globalGroupedBarNum).css({"position": "absolute", "background": "rgba(0, 0, 0, 0.8)", "color": "white", "font-family": "Arial", "font-size": "14px", "font-weight": "lighter", "z-index": "100", "pointer-events": "none"});
    $("#grouped-bar-tooltip" + this.globalGroupedBarNum).append('<div id="grouped-bar-tooltip-content' + this.globalGroupedBarNum + '" style="padding: 5px 10px 5px 10px;">');
    $("#grouped-bar-tooltip-content" + this.globalGroupedBarNum).append('<span id="grouped-bar-tooltip-desc' + this.globalGroupedBarNum + '" style="font-size: 12px;">desc of tooltip</span><br/>');
    $("#grouped-bar-tooltip-content" + this.globalGroupedBarNum).append('<span id="grouped-bar-tooltip-value' + this.globalGroupedBarNum + '" style="font-size: 16px;">value of tooltip</span>');

    $("#grouped-bar-tooltip" + this.globalGroupedBarNum).append('<svg style="position: absolute; width: 12px; height: 12px;"><polygon points="0,0 12,0 6,10" style="background: black; fill: rgba(0, 0, 0, 0.8);"></polygon></svg>');

    $("#grouped-bar-tooltip" + this.globalGroupedBarNum).hide();

    this.dataArray = data;

    this.setData = function(newData) {
        this.dataArray = newData;
    };

    this.draw = function() {
        d3.select(areaId).select("svg").remove();
        var groupedBarNum = this.globalGroupedBarNum;
        var dataArray = this.dataArray;

        var chartWidth = $(areaId).width() - chartMargin.left - chartMargin.right;
        var chartHeight = $(areaId).height() - chartMargin.top - chartMargin.bottom;

        var svg = d3.select(areaId)
                .append("svg")
                .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                .style("font-size", "10px")
                .style("font-family", "sans-serif");

        var groupedBarChartGroup = svg.append("g")
                .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        // gradients
        var defs = groupedBarChartGroup.append("defs");
        var grads = defs.selectAll("grads")
                .data(dataArray[0].data)
                .enter()
                .append("linearGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("id", function(d, i) {
                    return "groupedBarGrad-" + groupedBarNum + "-" + i;
                });
        grads.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function(d, i) {
                    return cnfg.colors[i];
                })
                .attr("stop-opacity", 1);
        grads.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", function(d, i) {
                    return getGroupedBarComplementryColor(cnfg.colors[i], cnfg.colorRotationDegree);
                })
                .attr("stop-opacity", 1);

        var highlightGrad = defs.append("linearGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%")
                .attr("id", "gbHighlightGrad-" + groupedBarNum);
        highlightGrad.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", cnfg.barHighlightColor)
                .attr("stop-opacity", 1);
        highlightGrad.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", function() {
                    return getGroupedBarComplementryColor(cnfg.barHighlightColor, cnfg.barHighlightColorRotationDegree);
                })
                .attr("stop-opacity", 1);

        var legendNames = dataArray[0].data.map(function(d) {
            return d.key;
        });

        var x0Scale = d3.scale.ordinal()
                .domain(dataArray.map(function(d) {
                    return d.name;
                }))
                .rangeRoundBands([0, chartWidth], .1);

        var x1Scale = d3.scale.ordinal()
                .domain(legendNames).rangeRoundBands([0, x0Scale.rangeBand()]);

        var minY = d3.min(dataArray.map(function(d1) {
            return d3.min(d1.data.map(function(d2) {
                return d2.value;
            }));
        }));
        var minYValue = minY - 5 < 0 ? 0 : minY - 5;
        minYValue = minYValue.toFixed(cnfg.valuePrecision);
        minYValue = +minYValue;
        var maxYValue = d3.max(dataArray.map(function(d1) {
            return d3.max(d1.data.map(function(d2) {
                return d2.value;
            }));
        }));
        maxYValue = maxYValue.toFixed(cnfg.valuePrecision);
        maxYValue = +maxYValue;

        var yScale = d3.scale.linear()
                .domain([minYValue, maxYValue])
                .range([chartHeight, 0]);

        var xAxis = d3.svg.axis()
                .scale(x0Scale)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

        groupedBarChartGroup.append("g")
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

        var barBundleGroup = groupedBarChartGroup.selectAll(".barbundle")
                .data(dataArray)
                .enter()
                .append("g")
                .attr("class", "g")
                .attr("transform", function(d) {
                    return "translate(" + x0Scale(d.name) + ",0)";
                });

        barBundleGroup.selectAll("rect")
                .data(function(d) {
                    return d.data;
                })
                .enter()
                .append("rect")
                .attr("rx", 2)
                .attr("ry", 2)
                .attr("width", x1Scale.rangeBand())
                .attr("x", function(d) {
                    return x1Scale(d.key);
                })
                .attr("y", function() {
                    return chartHeight;
                })
                .attr("height", 0)
                .attr("fill", function(d, i) {
                    return "url(#groupedBarGrad-" + groupedBarNum + "-" + i + ")";
                })
                .attr("stroke-width", "1px")
                .attr("stroke", cnfg.barBorderColor)
                .transition()
                .duration(1000)
                .ease("cubic-in-out")
                .attr("y", function(d) {
                    return yScale(d.value);
                })
                .attr("height", function(d) {
                    return chartHeight - yScale(d.value);
                });

        barBundleGroup.selectAll("rect")
                .on("mouseover", function(d, i) {
                    d3.select(this)
                            .attr("stroke", cnfg.barBorderHighlightColor)
                            .attr("fill", function() {
                                return "url(#gbHighlightGrad-" + groupedBarNum + ")";
                            });

                    var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("x")) + (Number(d3.select(this).attr("width")) / 2);
                    var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("y")) - 58;

                    d3.select("#grouped-bar-tooltip-desc" + groupedBarNum).text(d.key);
                    var tipValue = (d.value).toFixed(cnfg.valuePrecision);
                    tipValue = +tipValue;
                    d3.select("#grouped-bar-tooltip-value" + groupedBarNum).text(tipValue);
                    d3.select("#grouped-bar-tooltip" + groupedBarNum)
                            .transition()
                            .style("display", "block")
                            .style("left", posX + "px")
                            .style("top", posY + "px");
                })
                .on("mouseout", function(d, i) {
                    d3.select(this)
                            .attr("stroke", cnfg.barBorderColor)
                            .attr("fill", function() {
                                return "url(#groupedBarGrad-" + groupedBarNum + "-" + i + ")";
                            });

                    d3.select("#grouped-bar-tooltip" + groupedBarNum)
                            .transition()
                            .style("display", "none");
                });

        groupedBarChartGroup.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrapGroupedBarText, x0Scale.rangeBand());

        groupedBarChartGroup.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(cnfg.yAxisTitle);

        // legend
        var legend = groupedBarChartGroup.selectAll(".legend")
                .data(legendNames.slice())
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                    return "translate(0," + i * 20 + ")";
                });
        legend.append("rect")
                .attr("x", chartWidth - 18)
                .attr("width", 16)
                .attr("height", 16)
                .attr("stroke", cnfg.barBorderColor)
                .attr("stroke-width", "1px")
                .style("fill", function(d, i) {
                    return cnfg.colors[i];
                });
        legend.append("text")
                .attr("x", chartWidth - 24)
                .attr("y", 8)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                    return d;
                });

        // title
        groupedBarChartGroup.append("text")
                .attr("x", (chartWidth / 2))
                .attr("y", 5 - (chartMargin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(cnfg.chartTitle);

    };

    // function to wrap x axis tick lables
    function wrapGroupedBarText(text, width) {
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

    function getGroupedBarComplementryColor(hexColor, rotationDeg) {
        var rgb = hexToRgb(hexColor);
        var HSL = RgbToHsl(rgb[0], rgb[1], rgb[2]);
        var complementryHSL = getComplementaryHslColor(HSL[0], HSL[1], HSL[2], rotationDeg);
        var rgb2 = HslToRgb(complementryHSL[0], complementryHSL[1], complementryHSL[2]);
        var hexColor2 = rgbToHex(rgb2[0], rgb2[1], rgb2[2]);
        return hexColor2;
    }

    /**
     * Converts HSL color to GRB color
     * @param {Number} H Hue value (0 - 360) in degrees
     * @param {Number} S Saturation value (0 - 100) in percentage
     * @param {Number} L Lightness value (0 - 100) in percentage
     * @returns {Array} RGB values in [xxx, xxx, xxx] format
     */
    function HslToRgb(H, S, L) {
        H = H / 360;
        S = S / 100;
        L = L / 100;

        var R, G, B;
        if (S === 0) { //HSL from 0 to 1
            R = L * 255;                      //RGB results from 0 to 255
            G = L * 255;
            B = L * 255;
        } else {
            var var_1, var_2;
            if (L < 0.5) {
                var_2 = L * (1 + S);
            } else {
                var_2 = (L + S) - (S * L);
            }
            var_1 = 2 * L - var_2;

            R = 255 * Hue_2_RGB(var_1, var_2, H + (1 / 3));
            G = 255 * Hue_2_RGB(var_1, var_2, H);
            B = 255 * Hue_2_RGB(var_1, var_2, H - (1 / 3));
        }

        return [Math.round(R), Math.round(G), Math.round(B)];
    }

    function Hue_2_RGB(v1, v2, vH)             //Function Hue_2_RGB
    {
        if (vH < 0) {
            vH += 1;
        }
        if (vH > 1) {
            vH -= 1;
        }
        if ((6 * vH) < 1) {
            return (v1 + (v2 - v1) * 6 * vH);
        }
        if ((2 * vH) < 1) {
            return (v2);
        }
        if ((3 * vH) < 2) {
            return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
        }
        return (v1);
    }

    function getComplementaryHslColor(hue, sat, lit, rotationDeg) {
        var newHue = (hue + rotationDeg) % 360;
        return [newHue, sat, lit];
    }

    /**
     * Converts RGB color to HSL color
     * @param {type} R Red value (0 - 255)
     * @param {type} G Green value (0 - 255)
     * @param {type} B Blue value (0 - 255)
     * @returns {Array} HSL values in [degrees, percentage, percentage] format
     */
    function RgbToHsl(R, G, B) {
        var var_R = (R / 255); // RGB from 0 to 255
        var var_G = (G / 255);
        var var_B = (B / 255);

        var var_Min = d3.min([var_R, var_G, var_B]); //Min. value of RGB
        var var_Max = d3.max([var_R, var_G, var_B]); //Max. value of RGB
        var del_Max = var_Max - var_Min; //Delta RGB value

        var H, S, L = (var_Max + var_Min) / 2;

        if (del_Max === 0) { //This is a gray, no chroma...
            H = 0; //HSL results from 0 to 1
            S = 0;
        } else { //Chromatic data...
            if (L < 0.5) {
                S = del_Max / (var_Max + var_Min);
            } else {
                S = del_Max / (2 - var_Max - var_Min);
            }

            var del_R = (((var_Max - var_R) / 6) + (del_Max / 2)) / del_Max;
            var del_G = (((var_Max - var_G) / 6) + (del_Max / 2)) / del_Max;
            var del_B = (((var_Max - var_B) / 6) + (del_Max / 2)) / del_Max;

            if (var_R === var_Max) {
                H = del_B - del_G;
            } else if (var_G === var_Max) {
                H = (1 / 3) + del_R - del_B;
            } else if (var_B === var_Max) {
                H = (2 / 3) + del_G - del_R;
            }

            if (H < 0) {
                H += 1;
            }
            if (H > 1) {
                H -= 1;
            }
        }

        H = Math.round(H * 360);
        S = S * 100;
        L = L * 100;
        return [H, S, L];
    }

    function hexToRgb(h) {
        return [parseInt((cutHex(h)).substring(0, 2), 16), parseInt((cutHex(h)).substring(2, 4), 16), parseInt((cutHex(h)).substring(4, 6), 16)];
    }

    function cutHex(h) {
        return (h.charAt(0) === "#") ? h.substring(1, 7) : h;
    }

    function rgbToHex(R, G, B) {
        return "#" + toHex(R) + toHex(G) + toHex(B);
    }

    function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) {
            return "00";
        }
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    }
}

var globalGroupedBarNumber = 0;