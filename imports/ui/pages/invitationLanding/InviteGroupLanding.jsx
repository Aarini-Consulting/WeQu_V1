import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from '/imports/ui/pages/quiz/Quiz';
import SignUp from '../accounts/SignUp';

class InviteGroupLanding extends React.Component {
  render() {
    if(this.props.dataReady){
        if(this.props.currentUser && this.props.currentUser.emails[0].address != this.props.match.params.email){
            return(
                <div className="fillHeight">
                <h1>This link is not meant for you</h1>
                </div>
            )
            
        }
      else if(this.props.group && this.props.group.emails.indexOf(this.props.match.params.email) > -1){
          if(this.props.quizUser){
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
                <SignUp history={this.props.history} email={this.props.match.params.email}/>
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
  var handleGroup = Meteor.subscribe('group',{'_id' : props.match.params.id},{}, {
    onError: function (error) {
          console.log(error);
      }
    });

  if(handleGroup.ready()){
    var group = Group.findOne(props.match.params.id);
    
    if(group){
        quizUser = Meteor.users.findOne({$or : [ {"emails.address" :props.match.params.email }, { "profile.emailAddress" : props.match.params.email }]} );
    }
    dataReady = true;
  }
   
  return {
      group:group,
      currentUser: Meteor.user(),
      quizUser: quizUser,
      dataReady:dataReady,
  };
})(InviteGroupLanding);
