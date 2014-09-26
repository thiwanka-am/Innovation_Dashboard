function IndexBarChart(area, data, options) {
    var cnfg = {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20
    };

    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cnfg[i] = options[i];
            }
        }
    }

    var areaId = area.charAt(0) === "#" ? area : "#" + area;
    var chartDescHeight = 40;
    var chartMargin = {top: cnfg.marginTop, right: cnfg.marginRight, bottom: cnfg.marginBottom, left: cnfg.marginLeft};
    var chartWidth, chartHeight;

    this.globalIndexBarNum = globalIndexBarNumber++;

    var indexBarChartGroup, indexBarChartTriangleGroup;
    var maxScore;

    this.dataArray = data;

    this.setData = function(newData) {
        this.dataArray = newData;
    };

    this.draw = function() {
        d3.select(areaId).select("svg").remove();
        var indexBarNum = this.globalIndexBarNum;
        var dataArray = this.dataArray;
        var getCountryXPosition = this.getCountryXPosition;

        chartWidth = $(areaId).width() - chartMargin.left - chartMargin.right;
        chartHeight = $(areaId).height() - chartDescHeight - chartMargin.top - chartMargin.bottom;

        var svg = d3.select(areaId)
                .append("svg")
                .attr("width", chartWidth + chartMargin.left + chartMargin.right)
                .attr("height", chartHeight + chartDescHeight + chartMargin.top + chartMargin.bottom)
                .style("font-size", "10px")
                .style("font-family", "sans-serif");

        indexBarChartGroup = svg.append("g")
                .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

        indexBarChartTriangleGroup = indexBarChartGroup.append("g")
                .attr("id", "indexBarChartTriangleGroup")
                .attr("transform", "translate(" + 0 + "," + (chartHeight + 2) + ")");

        var indexBarChartTooltipGroup = indexBarChartGroup.append("g")
                //.attr("id", "indexBarChartTooltipGroup")
                .style("font-family", "Helvetica Neue")
                .attr("transform", "translate(" + 0 + "," + (chartHeight + 30) + ")");

        indexBarChartTooltipGroup.append("text")
                .attr("id", "indexBarChartTooltipCountry-" + indexBarNum)
                .attr("x", (chartWidth / 2) - 50) //280
                .attr("y", 10)
                .attr("font-size", "24px")
                .attr("fill", "#00152E")
                .style("font-weight", "bold")
                .style("text-anchor", "end")
                .text("");

        indexBarChartTooltipGroup.append("text")
                .attr("x", (chartWidth / 2) - 20) // 340
                .attr("y", 10)
                .attr("font-size", "14px")
                .attr("fill", "#00152E")
                .style("text-anchor", "start")
                .text("Rank:");

        indexBarChartTooltipGroup.append("text")
                .attr("id", "indexBarChartTooltipRank-" + indexBarNum)
                .attr("x", (chartWidth / 2) + 30)// 380
                .attr("y", 10)
                .attr("font-size", "28px")
                .attr("fill", "#00152E")
                .style("font-weight", "bold")
                .text("");

        indexBarChartTooltipGroup.append("text")
                .attr("class", "legendText")
                .attr("x", (chartWidth / 2) + 100) // 460
                .attr("y", 10)
                .attr("font-size", "14px")
                .attr("fill", "#00152E")
                .text("Score:");

        indexBarChartTooltipGroup.append("text")
                .attr("id", "indexBarChartTooltipScore-" + indexBarNum)
                .attr("class", "legendText")
                .attr("x", (chartWidth / 2) + 150) // 500
                .attr("y", 10)
                .attr("font-size", "28px")
                .attr("fill", "#00152E")
                .style("font-weight", "bold")
                .text("");

        indexBarChartGroup.append("line")
                .attr("x1", 0)
                .attr("y1", chartHeight + 10)
                .attr("x2", chartWidth)
                .attr("y2", chartHeight + 10)
                .style("stroke-width", 1)
                .style("stroke", "#737373");

        indexBarChartTriangleGroup.append("polygon")
                .attr("points", "7,0 14,8 0,8")
                .style("fill", "#737373")
                .style("stroke-width", 1)
                .style("stroke", "#737373");

//        var maxRank = d3.max(dataArray.map(function(d) {
//            return parseInt(d.rank);
//        }));
        maxScore = d3.max(dataArray.map(function(d) {
            return parseFloat(d.score);
        }));
        var slRank = "", slScore = "";

        indexBarChartGroup.selectAll("rect")
                .data(dataArray)
                .enter()
                .append("rect")
                .sort(sortDescItems)
                .style("fill", function(data) {
                    if (data.code.toString() === "LK") {
                        return "#b42d00"; //FF7900
                    } else {
                        return "#215ACD";
                    }
                })
                .attr("id", function(d, i) {
                    return d.code;
                })
                .style("stroke", "#D6E0F6")
                .style("stroke-width", "1px")
                .attr("x", function(data, i) {
                    if (data.code.toString() === "LK") {
                        var xPos = getCountryXPosition("LK", dataArray);
                        indexBarChartTriangleGroup
                                .transition()
                                .ease("linear-in-out")
                                .attr("transform", "translate(" + xPos + "," + (chartHeight + 2) + ")");

                        slRank = data.rank;
                        slScore = data.score;
                        // set values to information at bottom
                        d3.select("#indexBarChartTooltipCountry-" + indexBarNum)
                                .text(data.name);
                        d3.select("#indexBarChartTooltipRank-" + indexBarNum)
                                .text(data.rank);
                        d3.select("#indexBarChartTooltipScore-" + indexBarNum)
                                .text(data.score);
                    }

                    return (i * (chartWidth / dataArray.length));
                })
                .attr("width", (chartWidth / dataArray.length))
                .attr("y", chartHeight)
                .attr("height", 0)
                .transition()
                .duration(400)
                .attr("y", function(data) {
                    return chartHeight - ((chartHeight * data.score) / maxScore);
                })
                .attr("height", function(data, i) {
                    return ((chartHeight * data.score) / maxScore);
                });
        indexBarChartGroup.selectAll("rect")
                .on("mouseover", function(data, i) {
                    d3.select(this)
                            .transition()
                            .style("fill", "#FF7900")
                            .attr("height", function(data) {
                                return ((chartHeight * data.score) / maxScore) + 5;
                            })
                            .attr("y", function(data) {
                                return chartHeight - ((chartHeight * data.score) / maxScore) - 5;
                            });

                    var xPos = getCountryXPosition(d3.select(this).attr("id"), dataArray);
                    indexBarChartTriangleGroup
                            .transition()
                            .ease("linear-in-out")
                            .attr("transform", "translate(" + xPos + "," + (chartHeight + 2) + ")");

                    // set values to information at bottom
                    d3.select("#indexBarChartTooltipCountry-" + indexBarNum).text(data.name);
                    d3.select("#indexBarChartTooltipRank-" + indexBarNum).text(data.rank);
                    d3.select("#indexBarChartTooltipScore-" + indexBarNum).text(data.score);
                })
                .on("mouseout", function(data, i) {
                    var xPos = getCountryXPosition("LK", dataArray);
                    indexBarChartTriangleGroup
                            .transition()
                            .ease("linear-in-out")
                            .attr("transform", "translate(" + xPos + "," + (chartHeight + 2) + ")");

                    d3.select(this)
                            .transition()
                            .style("fill", function(d) {
                                if (d.code.toString() === "LK") {
                                    return "#b42d00";
                                } else {
                                    return "#215ACD";
                                }
                            })
                            .attr("height", function(data) {
                                return ((chartHeight * data.score) / maxScore);
                            })
                            .attr("y", function(data) {
                                return chartHeight - ((chartHeight * data.score) / maxScore);
                            });

                    d3.select("#indexBarChartTooltipCountry-" + indexBarNum).text("Sri Lanka");
                    d3.select("#indexBarChartTooltipRank-" + indexBarNum).text(slRank);
                    d3.select("#indexBarChartTooltipScore-" + indexBarNum).text(slScore);

                });

    };

    this.getCountryXPosition = function(cCode, dataArray) {
        var cXPos = 0;
        dataArray.sort(sortDescItems);
        dataArray.map(function(d, i) {
            if (d.code.toString() === cCode.toString()) {
                var barW = (chartWidth / dataArray.length);
                cXPos = (i * barW) + (barW / 2) - 7;
            }
        });
        return cXPos;
    };

    this.markCountry = function(cCode) {
        var data = this.dataArray;
        var indexBarNum = this.globalIndexBarNum;
        indexBarChartGroup.selectAll("rect")
                .transition()
                .style("fill", function(data) {
                    if (data.code.toString() === cCode.toString()) {
                        // set values to information at bottom
                        d3.select("#indexBarChartTooltipCountry-" + indexBarNum).text(data.name);
                        d3.select("#indexBarChartTooltipRank-" + indexBarNum).text(data.rank);
                        d3.select("#indexBarChartTooltipScore-" + indexBarNum).text(data.score);

                        return "#FF7900";
                    } else if(data.code.toString() === "LK"){
                        return "#b42d00";
                    } else {
                        return "#215ACD";
                    }
                })
                .attr("height", function(data) {
                    if (data.code.toString() === cCode.toString()) {
                        return ((chartHeight * data.score) / maxScore) + 5;
                    } else {
                        return ((chartHeight * data.score) / maxScore);
                    }
                })
                .attr("y", function(data) {
                    if (data.code.toString() === cCode.toString()) {
                        return chartHeight - ((chartHeight * data.score) / maxScore) - 5;
                    } else {
                        return chartHeight - ((chartHeight * data.score) / maxScore);
                    }
                });

        var xPos = this.getCountryXPosition(cCode, data);
        indexBarChartTriangleGroup
                .transition()
                .ease("linear-in-out")
                .attr("transform", "translate(" + xPos + "," + (chartHeight + 2) + ")");
    };

    this.resetCountry = function() {
        var data = this.dataArray;
        var indexBarNum = this.globalIndexBarNum;
        indexBarChartGroup.selectAll("rect")
                .transition()
                .style("fill", function(data) {
                    if (data.code.toString() === "LK") {
                        // set values to information at bottom
                        d3.select("#indexBarChartTooltipCountry-" + indexBarNum).text(data.name);
                        d3.select("#indexBarChartTooltipRank-" + indexBarNum).text(data.rank);
                        d3.select("#indexBarChartTooltipScore-" + indexBarNum).text(data.score);

                        return "#b42d00";
                    } else {
                        return "#215ACD";
                    }
                })
                .attr("height", function(data) {
                    return ((chartHeight * data.score) / maxScore);
                })
                .attr("y", function(data) {
                    return chartHeight - ((chartHeight * data.score) / maxScore);
                });

        var xPos = this.getCountryXPosition("LK", data);
        indexBarChartTriangleGroup
                .transition()
                .ease("linear-in-out")
                .attr("transform", "translate(" + xPos + "," + (chartHeight + 2) + ")");
    };

    var sortDescItems = function(a, b) {
        if (a.score > b.score) {
            return -1;
        } else if (a.score < b.score) {
            return 1;
        }
        return 0;
    };

    var sortAscItems = function(a, b) {
        if (a.score > b.score) {
            return 1;
        } else if (a.score < b.score) {
            return -1;
        }
        return 0;
    };
}

var globalIndexBarNumber = 0;