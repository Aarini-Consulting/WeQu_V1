import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/ui/complexLinkTranslate';

import Star from '/imports/ui/stars/Star';

class StarRatingMultiple extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        ratings:undefined
      };
  }
  stepFinished(){
    this.setState({
        savingData:true
    },()=>{
        this.props.submitAction(this.state.ratings);
    });
  }

  setRating(line, value){
    var current = this.state.ratings;
    if(current){
      current[line] = value;
    }else{
      current = {[line]:value};
    }

    this.setState({
      ratings: current,
    });
  }

  renderRateEntry(){
    return this.props.starItems.map((starQuestion, index) => {
      return(
        <div className="rate-box star w-clearfix noselect" key={`star-rate-${index}-${starQuestion}`}>
          <div className={"font-rate-quality star noselect"}>{starQuestion.toString()}</div>
          <div className={"font-rate-quality star"}>
            <Star submitCallback={(starValue)=>{this.setRating(starQuestion,starValue)}} rating={0} inactive={false}/>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <section className="ranker-container fontreleway purple-bg">
        <div className="section-name font-rate font-name-header">
            {this.props.group && this.props.group.groupName &&
                this.props.group.groupName
            }
        </div>
        <div className="rate-content">
            <div className="font-rate font-name-header f-white">
                {this.props.question}
            </div>
            <div className="rate-box-container">
              {this.renderRateEntry()}
            </div>
            <div className="w-block cursor-pointer">
                <input className="font-rate f-bttn w-inline-block noselect" type="submit" defaultValue={i18n.getTranslation(`weq.rankSelf.ButtonDone`)} 
                onClick={this.stepFinished.bind(this)}/>
            </div>
        </div>
      </section>
    );
  }
}

export default withTracker((props) => {
  var dataReady;
  var group;
  var handleGroup = Meteor.subscribe('group',{_id : props.groupId},{}, {
      onError: function (error) {
              console.log(error);
          }
  });

  if(handleGroup.ready()){
      group = Group.findOne({_id : props.groupId});
      dataReady = true;
      
  }
  return {
      group:group,
      dataReady:dataReady
  };
})(StarRatingMultiple);
