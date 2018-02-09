import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Menu from '/imports/ui/pages/menu/Menu';
import QuizSummary from '/imports/ui/pages/quiz/QuizSummary';

export default class LoginAfterQuiz extends React.Component {
  render() {
    return (
      <div className="fillHeight">
        <Menu location={this.props.location} history={this.props.history}/>
        <QuizSummary quizUser={undefined} 
            feedback={undefined}
            continue={()=>{this.props.history.replace('/quiz');}}
            next={undefined}/>
      </div>
    );
  }
    

  componentWillUnmount(){
    setLoginScript('finish');
  }
}