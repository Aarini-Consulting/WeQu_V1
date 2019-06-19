import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

import {Group} from '/collections/group';

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
      else if(this.props.quizUser && this.props.group && this.props.group.userIds.indexOf(this.props.quizUser._id) > -1){ 
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
  var handleUsers = Meteor.subscribe('users',{$or : [ {"emails.address" :props.match.params.email }, { "profile.emailAddress" : props.match.params.email }]}, {}, {
      onError: function (error) {
              console.log(error);
          }
    });

  if(handleGroup.ready() && handleUsers.ready()){
    var group = Group.findOne(props.match.params.id);
    
    if(group){
        quizUser = Meteor.users.findOne({$or : [ {"emails.address" :props.match.params.email }, { "profile.emailAddress" : props.match.params.email }]} );

        if(quizUser){
          Meteor.call('user.set.self.rank', quizUser._id, group._id, (err, result) => {
            if(err){
              console.log(err);
            }
          });
        }
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
