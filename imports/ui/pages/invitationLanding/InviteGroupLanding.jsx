import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from '/imports/ui/pages/quiz/Quiz';
import SignUp from '../accounts/SignUp';
import Typeform from '/imports/ui/pages/survey/Typeform';

class InviteGroupLanding extends React.Component {
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

    Meteor.call('survey.typeform.completed', this.props.match.params.id , this.props.match.params.email,
    (err, result) => {
      if(err){
        console.log(err);
      }
    });
  }

  render() {
    if(this.props.dataReady){
      if(this.props.currentUser && this.props.currentUser.emails[0].address != this.props.match.params.email){
          return(
              <div className="fillHeight">
              <h1>This link is not meant for you</h1>
              </div>
          )
          
      }
      else if(this.props.quizUser && this.props.group && this.props.group.emails.indexOf(this.props.match.params.email) > -1){
        if(this.props.surveyCompleted || this.state.surveyCompleted){  
          if(this.props.quizUser && !this.props.quizUser.profile.trial){
            if(Meteor.userId()){
              return (
                  <Redirect to={"/"}/>
              );
            }else{
              return (
                  <Redirect to={`/login/${this.props.quizUser._id}`}/>
              );
            } 
          }
          else{
            return (
                // <SignUp history={this.props.history} email={this.props.match.params.email}/>
                <Redirect to={`/sign-up/${this.props.quizUser._id}`}/>
            );
          }
        }
        else{
          return (
            <Typeform onSubmitCallback={this.typeformSubmitted.bind(this)}/>
          );
        } 
        
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
  var group;
  var quizUser;
  var surveyCompleted;
  var handleGroup = Meteor.subscribe('group',{'_id' : props.match.params.id},{}, {
    onError: function (error) {
          console.log(error);
      }
    });
  var handleUsers = Meteor.subscribe('users',{$or : [ {"emails.address" :props.match.params.email }, { "profile.emailAddress" : props.match.params.email }]}, {}, {
      onError: function (error) {
              console.log(error);
          }
    });

  if(handleGroup.ready() && handleUsers.ready()){
    var group = Group.findOne(props.match.params.id);
    
    if(group){
        quizUser = Meteor.users.findOne({$or : [ {"emails.address" :props.match.params.email }, { "profile.emailAddress" : props.match.params.email }]} );
        surveyCompleted = group.emailsSurveyed && group.emailsSurveyed.indexOf(props.match.params.email) > -1;

        if(quizUser){
          Meteor.call('user.set.pregame', quizUser._id, group._id, (err, result) => {
            console.log(err)
          });
        }
    }
    dataReady = true;
  }
   
  return {
      group:group,
      surveyCompleted:surveyCompleted,
      currentUser: Meteor.user(),
      quizUser: quizUser,
      dataReady:dataReady,
  };
})(InviteGroupLanding);
