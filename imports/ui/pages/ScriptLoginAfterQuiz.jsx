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
              next={this.props.next}/>
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
  var next;
  
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
    var feedback = Feedback.findOne({to:{ '$ne': Meteor.userId() }});
    if(feedback){
      next = ()=>{
        props.history.push(`/quiz/${feedback.to}`);
      }
    }
    dataReady = true;
  }
  return {
    dataReady:dataReady,
    next:next
  };
})(LoginAfterQuiz);
