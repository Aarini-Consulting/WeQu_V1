import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';

var d3 = require("d3");
var d3MeasureText = require('d3-measure-text');
d3MeasureText.d3 = d3;

export default class GroupQuizResultGraphVerticalBar extends React.Component {
    componentDidMount() {	
        this.updateChart(this.props);
    }

    componentWillReceiveProps(nextProps) {  		
        this.updateChart(nextProps);
    }

    getTextWidth(text, fontSize, fontFace) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    } 

    updateChart(props) {
        // options
        var margin = {"top": 20, "right": 0, "bottom": 20, "left": 0 }
        var width = 600;
        var height = 300;
        var colorRange = ["#40BFBB","#6A62B3","#F95A37","#05a5d5","#37AC68","#F54B73"];

        if(props.isEmpty){
            colorRange = ["#d1d1d1"];
        }

        
        /* data format
        var data = [
            {amount:50, text:"red"},
            {amount:100, text:"teal"},
            {amount:125, text:"yellow"},
            {amount:75, text:"purple"},
            {amount:25, text:"green"}
        ];
        */

        var defaultXAxisFontSize = 13;

        var xAxisFontSize = defaultXAxisFontSize;

        var data = props.data;

        var dataTextArray = data.map((d)=>d.text);
        
        // scales
        var xScale = d3.scaleBand()
            .range([0, width-2])
            .padding(0.3)
            .domain(dataTextArray);

        var yMax = d3.max(data, function(d){return d.amount});

        var textLengthMaxCount = d3.max(dataTextArray, function(d){return d.length});

        var singleCharLengthPx = this.getTextWidth('a', defaultXAxisFontSize);

        var textLengthMaxPx = textLengthMaxCount * singleCharLengthPx;

        var maxAvailablePx = width;

        if(data.length > 0){
            maxAvailablePx = (width/data.length) - 2;
        }

        if(textLengthMaxPx > maxAvailablePx){
            var defaultMaxLengthCount = maxAvailablePx/singleCharLengthPx;
            var diff = textLengthMaxCount - defaultMaxLengthCount;

            xAxisFontSize = (1-(diff/textLengthMaxCount)) * defaultXAxisFontSize;
        }

        var yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height - margin.bottom, margin.top]);

        var colorScale = d3.scaleOrdinal().domain(dataTextArray).range(colorRange);
        
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
                return xScale(d.text)
            })
            .attr('y', (d) => {
                return yScale(d.amount)
            })
            .attr('width', xScale.bandwidth() - margin.left)
            .attr('height', (d) => {
                return height - margin.bottom - yScale(d.amount)
            })
            .attr('fill', (d) => {
                return colorScale(d.text);
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
        
        //draw x-axis
        svg.append('g')
            .attr("class", "group-quiz-graph vertical x-axis")
            .attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
            .call(xAxis);

        //place label
        svg.selectAll(".text")  		
            .data(data)
            .enter()
            .append("text")
            .attr("class","group-quiz-graph vertical label")
            .attr("x", ((d) => {
                return xScale(d.text) + (xScale.bandwidth()/2); 
            }))
            .attr("y", (d) => { 
                return yScale(d.amount); 
            })
            .attr("dy", "-0.25em")
            .text((d) => {
                return d.amount; 
            });
        
        //adjust label position
        svg.selectAll("text.group-quiz-graph.vertical.label")
            .attr("x", function(d) {
                return xScale(d.text) + (xScale.bandwidth()/2) - this.getBBox().width/2;
            });
        
        //adjust axis font size
        svg.select("g.group-quiz-graph.vertical.x-axis")
        .selectAll("g.tick")
        .each(function(d, i){
            d3.select(this).style("font-size",`${xAxisFontSize}px`);
        });
}

    render() {
        return (
            <div className="group-quiz-graph-wrapper" ref="groupQuizResultGraph">
            </div>
        );
    }
}
