import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

import Loading from '/imports/ui/pages/loading/Loading';

import {Group} from '/collections/group';

class InviteGroupLanding extends React.Component {
  logout(){
    Session.set( "loggedOut", true);
    Meteor.logout()
  }

  render() {
    if(this.props.dataReady){
      if(this.props.currentUser && this.props.currentUser.emails[0].address != this.props.match.params.email){
          return(
              <div className="fillHeight">
                <div className="w-block">
                  <div className="email-link-error header">
                      <img className="email-link-error title-image" src="/img/lost.png"/>
                      <div className="email-link-error title-wrapper">
                        <div className="email-link-error title">
                        <T>weq.InviteGroupLanding.WeAreGettingConfused</T>
                        </div>
                      </div>
                  </div>
                  <div className="email-link-error content">
                  <T>weq.InviteGroupLanding.TheLinkThatyouJustOpenedMeantFor</T> <b>{this.props.match.params.email}</b>.
                    <br/><br/>
                    <T>weq.InviteGroupLanding.HoweverYouAreCurrentlyLogged</T> <b>{this.props.currentUser.emails[0].address}</b>.
                    <br/>
                    <T>weq.InviteGroupLanding.ToUseThisLinkPleaseClickLogoutButton</T>
                    <br/><br/>
                    <div className="div-block-center">
                      <div className="email-link-error logout-bttn" onClick={this.logout.bind(this)}>
                          <T>weq.settings.Logout</T>
                      </div>
                    </div>
                  </div>
                  
                </div>
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
