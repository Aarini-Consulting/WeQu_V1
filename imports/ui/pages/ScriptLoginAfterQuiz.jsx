import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Menu from '/imports/ui/pages/menu/Menu';
import QuizSummary from '/imports/ui/pages/quiz/QuizSummary';

import Loading from '/imports/ui/pages/loading/Loading';

class LoginAfterQuiz extends React.Component {
  render() {
    if(this.props.dataReady){
      return (
        <div className="fillHeight">
          <Menu location={this.props.location} history={this.props.history}/>
          <QuizSummary quizUser={undefined} 
              feedback={undefined}
              continue={()=>{this.props.history.replace('/quiz');}}
              next={this.props.feedback 
                ? this.props.feedback.groupId
                  ?()=>{this.props.history.push(`/quiz/${this.props.feedback.to}/${this.props.feedback.groupId}`)} 
                  :()=>{this.props.history.push(`/quiz/${this.props.feedback.to}`)}
                : 
                  undefined}/>
        </div>
      );
    }else{
      return(<Loading/>);
    }
    
  }
    

  componentWillUnmount(){
    setLoginScript('finish');
  }
}

export default withTracker((props) => {
  var dataReady;
  var feedback;
  
  handleFeedback = Meteor.subscribe('feedback', 
    {
      $or : [ 
      {from:Meteor.userId()},
      {to:Meteor.userId()} 
      ]}, 
    
    {}, 
    {
      onError: function (error) {
              console.log(error);
          }
      });
  
  if(handleFeedback.ready()){
    feedback = Feedback.findOne({to:{ '$ne': Meteor.userId() }});
    dataReady = true;
  }
  return {
    dataReady:dataReady,
    feedback:feedback
  };
})(LoginAfterQuiz);
