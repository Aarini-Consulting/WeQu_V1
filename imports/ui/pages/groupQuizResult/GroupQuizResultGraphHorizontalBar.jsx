import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';

var d3 = require("d3");

export default class GroupQuizResultGraphVerticalBar extends React.Component {
    componentDidMount() {	
        this.updateChart(this.props);
    }

    componentWillUpdate(nextProps) {  		
        this.updateChart(nextProps);
    }

    updateChart(props) {
        // options
        var margin = {"top": 20, "right": 0, "bottom": 20, "left": 40 }
        var width = 600;
        var height = 300;
        var colorRange = ["#3e9f32","#6A62B3","#fd9a3e","#05a5d5","#6A1B58","#fc808c"];

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

        var data = props.data;

        //data is drawn in reverse, so we reverse the data array here to maintain order
        data = data.slice().reverse();

        var dataTextArray = data.map((d)=>d.text);
        var dataAmountArray = data.map((d)=>d.amount);
        
        // scales
        var xMax = d3.max(data, function(d){return d.amount});

        var xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([margin.left, width - margin.right]);

        var yScale = d3.scaleBand()
            .range([height - margin.bottom, margin.top])
            .padding(0.6)
            .domain(dataTextArray);

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
            .attr('width', (d) => {
                if(!d.amount || d.amount < 1){
                    return 0;
                }else{
                    return xScale(d.amount);
                }
            })
            .attr('x', (d) => {
                return margin.left;
            })
            .attr('y', (d) => {
                return yScale(d.text)
            })
            .attr('height', yScale.bandwidth())
            .attr('fill', (d) => {
                return colorScale(d.text);
            })
            .attr('margin-right', "0.5em")
            .attr('margin-left', "0.5em");
        
        // axes
        // var xAxis = d3.axisBottom()
        //     .scale(xScale)
        //     .ticks(data.length)
        //     // .tickFormat(d3.format('d'))
        //     .tickFormat((d,i)=>
        //         {
        //             return d;
        //         });

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(data.length)
            // .tickFormat(d3.format('d'))
            .tickFormat((d,i)=>
                {
                    return dataAmountArray[i] + "%";
                });
        
        //draw x-axis
        // svg.append('g')
        //     .attr("class", "group-quiz-graph-x-axis")
        //     .attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
        //     .call(xAxis);

        svg.append('g')
            .attr("class", "group-quiz-graph horizontal x-axis")
            .attr('transform', 'translate(' + [margin.left, 0] + ')')
            .call(yAxis);

        //place label
        svg.selectAll(".text")  		
            .data(data)
            .enter()
            .append("text")
            .attr("class","group-quiz-graph horizontal label")
            .attr("x", ((d) => {
                return margin.left + 3;
            }))
            .attr("y", (d) => { 
                return yScale(d.text);
            })
            .attr("dy", "-0.25em")
            .text((d) => {
                return d.text; 
            });
        
        // //adjust label position
        // svg.selectAll("text.group-quiz-graph-label")
        //     .attr("x", function(d) {
        //         return xScale(d.text) + (xScale.bandwidth()/2) - this.getBBox().width/2;
        //     });
    }

    render() {
        return (
            <div className="group-quiz-graph-wrapper" ref="groupQuizResultGraph">
            </div>
        );
    }
}
