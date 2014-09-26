function PieChart(area, data, options) {
    var cnfg = {
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
        colors: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#AAAA11", "#E67300", "#B77322", "#16D620"]
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
    var legendWidth = 120;

    this.globalPieNum = globalPieNumber++;

    $("body").append('<div id="pie-tooltip' + this.globalPieNum + '"></div>');
    $("#pie-tooltip" + this.globalPieNum).css({"position": "absolute", "background": "rgba(0, 0, 0, 0.8)", "color": "white", "font-family": "Arial", "font-size": "14px", "font-weight": "lighter", "z-index": "100", "pointer-events": "none"});
    $("#pie-tooltip" + this.globalPieNum).append('<div id="pie-tooltip-content' + this.globalPieNum + '" style="padding: 5px 10px 5px 10px;">');
    $("#pie-tooltip-content" + this.globalPieNum).append('<span id="pie-tooltip-desc' + this.globalPieNum + '" style="font-size: 12px;">desc of tooltip</span><br/>');
    $("#pie-tooltip-content" + this.globalPieNum).append('<span id="pie-tooltip-value' + this.globalPieNum + '" style="font-size: 16px;">value of tooltip</span>');

    $("#pie-tooltip" + this.globalPieNum).hide();
    
    this.dataArray = data;
    
    this.setData = function(newData){
        this.dataArray = newData;
    };

    this.draw = function() {
        d3.select(areaId).select("svg").remove();
        var pieNum = this.globalPieNum;
        var dataArray = this.dataArray;
		
		$("#pie-tooltip" + parseInt(pieNum)).hide();

        var chartWidth = $(areaId).width() - chartMargin.left - legendWidth - chartMargin.right;
        var chartHeight = $(areaId).height() - chartMargin.top - chartMargin.bottom;
        var radius = Math.min(chartWidth, chartHeight) / 2;

        var color = d3.scale.ordinal()
                .range(cnfg.colors);

        var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0)
                .startAngle(function(d) {
                    return d.startAngle;
                })
                .endAngle(function(d) {
//                    return (d.value / 1000) * 2 * Math.PI;
                    return d.endAngle;
                });

        var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d.value;
                });

        var svg = d3.select(areaId)
                .append("svg")
                .attr("width", chartWidth + chartMargin.left + legendWidth + chartMargin.right)
                .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
                .style("font-size", "10px")
                .style("font-family", "sans-serif");

        var pieChartGroup = svg.append("g")
                .attr("transform", "translate(" + ((chartWidth / 2) + chartMargin.left) + "," + ((chartHeight / 2) + chartMargin.top) + ")");

        var defs = pieChartGroup.append("defs");
        var grads = defs.selectAll("radialGradient")
                .data(dataArray)
                .enter()
                .append("radialGradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", "120%")
                .attr("id", function (d, i){
                    return "pieGrad-" + pieNum + "-" + i;
                });
        grads.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", function(d, i){
                    return color(i);
                })
                .attr("stop-opacity", 1);
        grads.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", "#000000")
                .attr("stop-opacity", 1);

        var arcGroup = pieChartGroup.selectAll(".arc")
                .data(pie(dataArray))
                .enter()
                .append("g")
                .attr("class", "arc");

        arcGroup.append("path")
                .attr("stroke", "#ffffff")
                .attr("stroke-width", "1")
                .attr("fill", function(d, i) {
                    return "url(#pieGrad-" + pieNum + "-" + i + ")";
                    //return color(d.data.name);
                })
                .transition()
                .ease("cubic-in-out")
                .duration(2000)
                //.attrTween("d", arcTween)
                .attrTween("d", function(b) {
                    var i = d3.interpolate({value: 0}, b);
                    return function(t) {
                        return arc(i(t));
                    };
                })
                //.attr("d", arc)
                ;


        arcGroup.selectAll("path")
                .on("mouseover", function(d) {
                    d3.select(this)
                            .attr("fill-opacity", 0.9);

                    var posX = d3.event.pageX - d3.mouse(this)[0] + Number(d3.select(this).attr("x")) + (Number(d3.select(this).attr("width")) / 2);
                    var posY = d3.event.pageY - d3.mouse(this)[1] + Number(d3.select(this).attr("y")) - 58;

                    d3.select("#pie-tooltip-desc" + pieNum).text(d.data.name);
                    d3.select("#pie-tooltip-value" + pieNum).text(d.data.value);
                    d3.select("#pie-tooltip" + pieNum)
                            .transition()
                            .style("display", "block")
                            .style("left", d3.event.pageX + "px")
                            .style("top", d3.event.pageY + "px");
                })
                .on("mouseout", function() {
                    d3.select(this)
                            .attr("fill-opacity", 1);

                    d3.select("#pie-tooltip" + pieNum)
                            .transition()
                            .style("display", "none");
                })
                .on("click", function(d, i) {
					if(d.data.type == "aoi"){
						fetchCustomData("saoi", d.data.id, d.data.name);
					} else if (d.data.type == "saoi"){
						//fetchCustomData("aoi");
					}
					/*
                    var isExpanded = d3.select(this).attr("class") === "expanded";

                    if (!isExpanded) {
                        // close all expanded slices
                        pieChartGroup.selectAll(".expanded")
                                .transition()
                                .duration(400)
                                .attr("transform", "translate(0,0)")
                                .each("end", function() {
                                    d3.select(this).attr("class", "");
                                });

                        d3.select(this)
                                .transition()
                                .duration(400)
                                .attr("transform", function(d, i) {
                                    var c = arc.centroid(d),
                                            x = c[0],
                                            y = c[1],
                                            h = Math.sqrt(x * x + y * y),
                                            pullOutSize = 10;

                                    return "translate(" + ((x / h) * pullOutSize) + ',' + ((y / h) * pullOutSize) + ")";
                                })
                                .each("end", function() {
                                    d3.select(this).attr("class", "expanded");
                                });
                    } else {
                        d3.select(this)
                                .transition()
                                .duration(400)
                                .attr("transform", "translate(0,0)")
                                .each("end", function() {
                                    d3.select(this).attr("class", "");
                                });
                    }*/

                });

        function arcTween(a) {
            console.log(a);
            var i = d3.interpolate({value: a.previous}, a);
            return function(t) {
                return arc(i(t));
            };
        }

        var total = d3.sum(dataArray.map(function(d) {
            return d.value;
        }));

        arcGroup.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".35em")
                .attr("stroke", "none")
                .attr("stroke-width", "0")
                .attr("fill", "#ffffff")
                .style("text-anchor", "middle")
                .style("font-family", "Arial")
                .style("font-size", "12px")
                .style("pointer-events", "none")
                .text(function(d) {
                    var percentage = ((d.data.value / total) * 100).toFixed(1);
                    percentage = +percentage; // drops any "extra" zeroes at the end
                    if (percentage > 5) {
                        return percentage + "%";
                    } else {
                        return "";
                    }

                });

        // legend
        var legendGroup = svg.append("g")
                .attr("transform", "translate(" + (chartMargin.left + (chartWidth / 2) + radius + 20) + "," + (chartMargin.top + (chartHeight / 2) - radius) + ")");

        var legend = legendGroup.selectAll(".leg")
                .data(dataArray)
                .enter()
                .append("g");

        legend.append("rect")
                .attr("x", 0)
                .attr("y", function(d, i) {
                    return i * 25;
                })
                .attr("width", "14px")
                .attr("height", "14px")
                .attr("fill", function(d, i) {
                    return color(i);
                });

        legend.append("text")
                .attr("dy", ".35em")
                .attr("stroke", "none")
                .attr("stroke-width", "0")
                .attr("fill", "#000000")
                .style("text-anchor", "start")
                .style("font-family", "Arial")
                .style("font-size", "12px")
                .attr("x", 20)
                .attr("y", function(d, i) {
                    return (i * 25) + 8;
                })
                .text(function(d) {
                    return d.name;
                });
    };
}

var globalPieNumber = 0;