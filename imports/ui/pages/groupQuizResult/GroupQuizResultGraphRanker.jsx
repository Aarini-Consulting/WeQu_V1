import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';

var d3 = require("d3");

export default class GroupQuizResultGraphRanker extends React.Component {
    renderRankCards(){
        if(this.props.data && this.props.data.length > 0){
            var colorRange = ["#3e9f32","#6A62B3","#fd9a3e","#05a5d5","#6A1B58","#fc808c"];

            var colorScale = d3.scaleOrdinal().domain(this.props.data.map((d)=>d.text)).range(colorRange);

            return this.props.data.map((value,index,array)=>{
                var style={};
                var styleHamburger={};

                if(!this.props.isEmpty){
                    style={
                        backgroundColor:colorScale(value.text),
                        color:"#fff",
                        border:0
                    };

                    styleHamburger={
                        color:"#fff",
                    };
                    
                    var prev = array[index-1];
                    var next = array[index+1];

                    if(prev && prev.amount == value.amount){
                        style.marginTop = 0+"em";
                        style.borderTop = 0+"em";
                    }
    
                    if(next && next.amount == value.amount){
                        style.marginBottom = 0+"em";
                    }
                }

                return(
                    <div className={`group-quiz-graph ranker-item noselect`} style={style} key={`master-ranker-entry-${index}`}>
                        <div className="rate-hamburger" style={styleHamburger}>
                            <i className="fas fa-bars"></i>
                        </div>
                        <div className={"group-quiz-graph ranker-item-text noselect"}>
                            {!this.props.isEmpty && value.text.toString()}
                        </div>
                    </div>
                );
            });
        }
    }
    render() {
        return (
            <div className="group-quiz-graph ranker-wrapper">
                {this.renderRankCards()}
            </div>
        );
    }
}
