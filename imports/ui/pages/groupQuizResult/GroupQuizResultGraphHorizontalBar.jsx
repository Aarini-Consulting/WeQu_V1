import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';

var d3 = require("d3");

export default class GroupQuizResultGraphHorizontalBar extends React.Component {
    componentDidMount() {	
        this.updateChart(this.props);
    }

    componentWillReceiveProps(nextProps) {  		
        this.updateChart(nextProps);
    }

    updateChart(props) {
        // options
        var margin = {"top": 20, "right": 12, "bottom": 20, "left": 40 }
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

        var data = props.data;

        //data is drawn in reverse, so we reverse the data array here to maintain order
        data = data.slice().reverse();

        var dataTextArray = data.map((d)=>d.text);
        var dataAmountArray = data.map((d)=>d.amount);
        
        // scales
        var xMax = props.xMaxPoint;
        if(!xMax || props.isEmpty){
            xMax = d3.max(data, function(d){return d.amount});
        }

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
                return xScale(d.amount)-margin.left-margin.right;
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
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(data.length)
            // .tickFormat(d3.format('d'))
            .tickFormat((d,i)=>
                {
                    return dataAmountArray[i];
                });
        
        //draw y-axis
        svg.append('g')
            .attr("class", "group-quiz-graph horizontal x-axis")
            .attr('transform', 'translate(' + [margin.left, 0] + ')')
            .call(yAxis)
        .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", "-0.5em");

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

        
        //place star icon
        svg.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "fas fa-star")
            .attr("x", ((d) => {
                return xScale(d.amount)-margin.right;
            }))
            .attr("y", (d) => { 
                return yScale(d.text); 
            })
            .attr("dy", yScale.bandwidth())
            .attr("dx", -yScale.bandwidth() * 0.75)
            .attr('font-size', function(d) { return yScale.bandwidth() * 1.25} )
            .style('fill', '#A4872B')
            .text((d) => {
                return '\uf005'; 
            });
        
        svg.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "fas fa-star")
            .attr("x", ((d) => {
                return xScale(d.amount)-margin.right;
            }))
            .attr("y", (d) => { 
                return yScale(d.text); 
            })
            .attr("dy", yScale.bandwidth() * 0.9)
            .attr("dx", -yScale.bandwidth() * 0.6)
            .attr('font-size', function(d) { return yScale.bandwidth()} )
            .style('fill', '#D4AF37')
            .text((d) => {
                return '\uf005'; 
            });
    }

    render() {
        return (
            <div className="group-quiz-graph-wrapper" ref="groupQuizResultGraph">
            </div>
        );
    }
}
