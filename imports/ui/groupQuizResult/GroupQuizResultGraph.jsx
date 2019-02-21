import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';

var d3 = require("d3");

export default class GroupQuizResultGraph extends React.Component {
    componentDidMount() {	
        this.updateChart(this.props);
    }

    componentWillUpdate(nextProps) {  		
        this.updateChart(nextProps);
    }

    updateChart(props) {
        // options
        var margin = {"top": 20, "right": 0, "bottom": 20, "left": 0 }
        var width = 600;
        var height = 300;
        var colorRange = ["#3e9f32","#6A62B3","#fd9a3e","#05a5d5","#6A1B58","fc808c"];

        
        // data
        var data = [[50, "red"], [100, "teal"], [125, "yellow"], [75, "purple"], [25, "green"]];
        
        // scales
        var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.3)
            .domain(['red','teal','yellow','purple','green']);

        var yMax = d3.max(data, function(d){return d[0]});

        var yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height - margin.bottom, margin.top]);

        var colorScale = d3.scaleOrdinal().domain(data).range(colorRange);
        
        var canvas = ReactDOM.findDOMNode(this.refs.groupQuizResultGraph);
        d3.select(canvas).select("svg").remove();

        // svg element
        var svg = d3.select(canvas)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0,0,${width},${height}`);
        
        // bars 
        var rect = svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', (d, i) => { 
                return xScale(d[1])
            })
            .attr('y', (d) => {
                return yScale(d[0])
            })
            .attr('width', xScale.bandwidth() - margin.left)
            .attr('height', (d) => {
                return height - margin.bottom - yScale(d[0])
            })
            .attr('fill', (d) => {
                return colorScale(d);
            })
            .attr('margin-right', "0.5em")
            .attr('margin-left', "0.5em");
        
        // axes
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(data.length)
            // .tickFormat(d3.format('d'))
            .tickFormat((d,i)=>
                {
                    return d;
                });

        // var yAxis = d3.axisLeft()
        //     .scale(yScale)
        //     .tickFormat(d3.format('d'));
        
        //draw x-axis
        svg.append('g')
            .attr("class", "group-quiz-graph-x-axis")
            .attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
            .call(xAxis);

        // svg.append('g')
        //     .attr('transform', 'translate(' + [margin.left, 0] + ')')
        //     .call(yAxis);

        //place label
        svg.selectAll(".text")  		
            .data(data)
            .enter()
            .append("text")
            .attr("class","group-quiz-graph-label")
            .attr("x", ((d) => {
                return xScale(d[1]) + (xScale.bandwidth()/2); 
            }))
            .attr("y", (d) => { 
                return yScale(d[0]); 
            })
            .attr("dy", "-0.25em")
            .text((d) => {
                return d[0]; 
            });
        
        //adjust label position
        svg.selectAll("text.group-quiz-graph-label")
            .attr("x", function(d) {
                return xScale(d[1]) + (xScale.bandwidth()/2) - this.getBBox().width/2;
            });
    }

    render() {
        return (
            <div className="group-quiz-graph-wrapper" ref="groupQuizResultGraph">
            </div>
        );
    }
}
