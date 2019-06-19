import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Typeform from '/imports/ui/pages/survey/Typeform';

import {Group} from '/collections/group';

class LandingSurveyComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      surveyCompleted:false,
    }
  }

  typeformSubmitted(){
    this.setState({
      surveyCompleted: true,
    });

    Meteor.call('survey.typeform.completed', this.props.group._id , this.props.currentUser._id,
    (err, result) => {
      if(err){
        console.log(err);
      }
    });
  }

  render() {
    if(this.props.dataReady){
        if(this.props.group && !(this.props.surveyCompleted || this.state.surveyCompleted)){
          return(
            <Typeform onSubmitCallback={this.typeformSubmitted.bind(this)} groupLanguage={this.props.group.groupLanguage}/>
          )
        }else{
          return(
            <Redirect to={`/quiz/${this.props.group._id}`}/>
          )
        }
    }else{
      return(
        <Loading/>
      );
    }
  }
}

export default withTracker((props) => {
  var dataReady;
  var group;
  var quizUser;
  var surveyCompleted;
  

  var currentUser;
  if(props.user){
    currentUser = props.user;
  }else{
    currentUser = Meteor.user();
  }
  var handleGroup;

  if(currentUser){
    var userId = currentUser._id;
    handleGroup = Meteor.subscribe('group',{
        "userIds" : userId
    },{}, {
        onError: function (error) {
              console.log(error);
          }
    });
    
    if(handleGroup.ready()){
        if(currentUser.profile && currentUser.profile.selfRank){
            group = Group.findOne({_id:currentUser.profile.selfRank});
        }else{
            group = Group.findOne({_id:props.groupId});
        }
        
        surveyCompleted = group && group.userIdsSurveyed && group.userIdsSurveyed.indexOf(userId) > -1;
        dataReady = true;
    }
  }
   
  return {
      group:group,
      surveyCompleted:surveyCompleted,
      currentUser: currentUser,
      quizUser: quizUser,
      dataReady:dataReady,
  };
})(LandingSurveyComponent);
