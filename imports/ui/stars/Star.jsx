import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import './rating.css'

// Star component -
class Star extends Component {
    constructor(props){
        super(props);
        this.state={
            currentRating:-1,
            stars:[],
            mouseOver:-1
        }
    }

    componentDidMount(){
        if(this.props.rating){
            this.setState({
                currentRating:Number(this.props.rating),
                mouseOver:-1
            });
        }
        this.init();
    }

    /**
     * init
     *
     * @description Initializes the rating widget. Returns nothing.
     */
    init() {
        if(this.state.stars.length < 1){
            var tempStar=[];
            for (var i = 0; i < this.props.maxRating; i++) {
                tempStar.push({index:i,className:"c-rating__item"});
            }
            this.setState({
                stars:tempStar,
            });
        }
    }

    starMouseOver(star,event) {
        this.setState({
            mouseOver:star.index,
        });
    }

    starMouseOut(star, event) {
      this.setState({
        mouseOver:-1,
    });
    }

    starClick(star, event) {
        event.preventDefault();
        if(!this.props.inactive){
            this.setState({
                currentRating:star.index+1,
            });
            if(this.props.submitCallback){
                this.props.submitCallback(star.index+1);
            }
        }
        
    }

    renderStars() {
        var size = 100/this.props.maxRating;

        return this.state.stars.map((star) => {
            
            if(this.props.inactive){
                return (
                    <li 
                    className={star.className + " disabled" + (this.state.currentRating >= star.index+1 ? " is-active" : "")}
                    style={{width:size+"%",paddingBottom:size/2+"%"}}
                    key={star.index}>
                    </li>
                );
            }
            return (
                <li 
                    className={star.className + (this.state.mouseOver >= star.index ? " is-active" 
                        : this.state.currentRating >= star.index+1 ? " is-active" : "")}
                    key={star.index}
                    style={{width:size+"%",paddingBottom:size/2+"%"}}
                    onMouseOver={this.starMouseOver.bind(this, star)}
                    onMouseOut={this.starMouseOut.bind(this, star)}
                    onClick={this.starClick.bind(this, star)}>
                </li>
            );
        });
    }

    render() {
        return(
            <ul className="c-rating" ref="stars">
                {this.renderStars()}
            </ul>
        );
    }
}

Star.propTypes = {
  currentUser: PropTypes.object,
  submitCallback: PropTypes.func,
  maxRating:PropTypes.number,
  rating:PropTypes.number,
  inactive:PropTypes.bool
};

// Specifies the default values for props:
Star.defaultProps = {
  maxRating: 5,
  inactive:false
};

export default withTracker((props) => {
    return {
        currentUser: Meteor.user(),
    };
  })(Star);
