import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from '/imports/ui/pages/quiz/Quiz';

class InviteLanding extends React.Component {
  render() {
    if(this.props.dataReady){
        if(this.props.quizUser && Meteor.userId() && Meteor.userId() != this.props.quizUser._id){
            return(
                <div className="fillHeight">
                <h1>This link is not meant for you</h1>
                </div>
            )
            
        }
      else if(this.props.quizUser && this.props.feedback){
        return (
          <div className="fillHeight">
          <Quiz quizUser={this.props.quizUser} feedback={this.props.feedback} inviteLanding={true}/>
          </div>
        );
      }
    //   else if(this.props.quizUser && this.props.feedback && this.props.feedback.done){
    //     return(
    //         <Redirect to={"/"}/>
    //       );
    //   }
      else{
        return(
          <Redirect to={"/404"}/>
        );
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
  var feedback;
  var quizUser;

  var handleFeedback = Meteor.subscribe('feedback',{'_id' : props.match.params.id},{}, {
    onError: function (error) {
          console.log(error);
      }
  });

  if(handleFeedback.ready()){
    var feedback = Feedback.findOne({_id:props.match.params.id});
    
    if(feedback){
        quizUser = Meteor.users.findOne({_id : feedback.from});
    }
    dataReady = true;
  }
   
  return {
      feedback:feedback,
      currentUser: Meteor.user(),
      quizUser: quizUser,
      dataReady:dataReady,
  };
})(InviteLanding);
