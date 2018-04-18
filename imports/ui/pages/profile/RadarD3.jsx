import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {	
        this.updateChart(this.props);
    }

    componentWillUpdate(nextProps) {  		
        this.updateChart(nextProps);
    }

    updateChart(props) {
        var cfg = {
            w: 300,
            h: 300,
            factor: 1,
            factorLegend: 1,
            radians: 2 * Math.PI,
            maxValue:0,
            radius:4.5
        };

        var id = ReactDOM.findDOMNode(this.refs.chart);
        d3.select(id).select("svg").remove();
        var svg = d3.select(id)
        .append("svg")
        .attr("width", "100%")
        .attr("viewBox", "0,0,300,300")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .style("padding", "19.5%")
        .append("g");

        var allAxis = [
            {axis:"TEAMWORK"},
            {axis:"COMMUNICATION"},
            {axis:"SELF_MANAGEMENT"},
            {axis:"VIRTUE"},
            {axis:"PROBLEM_SOLVING"},
            {axis:"LEADERSHIP"}
        ];

        var total = allAxis.length;

        var series=0;
        var radarData = [];
        var myPoints=[];
        var otherPoints=[];
        if(this.props.myPoints){
            var zeroCount = 0;
            allAxis.map((key)=>{
                if(this.props.myPoints[key.axis] <= 0){
                    zeroCount++;
                }
                myPoints.push({axis:key.axis,
                    value:this.props.myPoints[key.axis],
                    color:"#F86577"
                });
            })
            if(zeroCount < allAxis.length){
                radarData.push(myPoints);
            }
        }
        if(this.props.otherPoints){
            var zeroCount = 0;
            allAxis.map((key)=>{
                if(this.props.otherPoints[key.axis] <= 0){
                    zeroCount++;
                }
                otherPoints.push({axis:key.axis,
                    value:this.props.otherPoints[key.axis],
                    color:"#4D9AD4"
                });
            })
            if(zeroCount < allAxis.length){
                radarData.push(otherPoints);
            }
        }

        cfg.maxValue = Math.max(
            cfg.maxValue, 
            d3.max(radarData, function(i){
                return d3.max(i.map(function(o){
                    return o.value;})
                )
            }));
        // var allAxis = (d[0].map(function(i, j){return i.axis}));


        var axis = svg.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){
                return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));
            })
            .attr("y2", function(d, i){
                return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
            })
            .attr("class", "line")
            .style("stroke", "#CCC6D3")
            .style("stroke-width", "1px")
            .style("pointer-events", "none");


        var total = allAxis.length;

        //draw polygon(s)
        radarData.forEach(function(rd, x){
            var dataValues = [];
            svg.selectAll(".nodes")
                .data(rd, function(j, i){
                dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                ]);
                });
            svg.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", rd[0].color)
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return rd[0].color})
                .style("fill-opacity", 0.1)
                
            series++;
        });

        series = 0;
        //draw circles
        radarData.forEach(function(rd, x){
            var dataValues = [];
            svg.selectAll(".nodes")
                .data(rd).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                ]);
                return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                })
                .attr("cy", function(j, i){
                return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                })
                .attr("data-id", function(j){return j.axis})
                .style("fill", rd[0].color).style("fill-opacity", .9)
            series++;
            });
    }

    render() {
        return (
            <div className="radar-wrapper" 
                style={{
                backgroundImage: "url('/img/radar-bg.png')",
                backgroundSize:"contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
                }}
                >
                <div className="radar" 
                style={{
                margin:"auto",
                marginTop:"auto",
                marginBottom:"auto",
                }} 
                ref="chart"></div>
            </div>            
        );
    }
}