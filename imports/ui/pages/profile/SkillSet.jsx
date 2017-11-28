import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

import Loading2 from '/imports/ui/pages/loading/Loading2';
import SkillCategories from './SkillCategories';

class SkillSet extends React.Component {
  constructor(props){
      super(props);
      this.state={
        sectionEmpty:true,
        count:0
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataReady){
      let allEmails = [];
      if(nextProps.groups.length > 0){
        nextProps.groups.forEach((data) => {
           data.emails.forEach((d) => {
             allEmails.push(d);
           });
          
          //count3+= data.emails.length;
        });
        allEmails = [...new Set(allEmails)];
      }
      let countAlpha="", i= 3;
      let count = i-nextProps.connections.length-allEmails.length ;
      if(count==1){
        countAlpha = "ONE"
      }
      else if(count==2){
        countAlpha = "TWO"
      }
      else if(count==3){
        countAlpha = "THREE"
      }
      let bool = (nextProps.quizPerson == Meteor.userId()) && nextProps.connections.length+allEmails.length < 3;

      this.setState({
        sectionEmpty:bool,
        count:countAlpha
      });
    }
  }

  render() {
    if(this.props.dataReady){
      return (
          <div>
            <div className="sectionprofile sectionskills" id="sectionskills">
            <div className="titlesection w-container"><img className="iconwrapper" src="/img/icon24.png"/>
              <div className="fontreleway fonttitle">{this.props.userType} Character Skill Set</div>
            </div>
            {this.state.sectionEmpty
            ?
              <div className="skillcovergrey"></div>
            :
            <div className= "skillcovergrey2">
                <SkillCategories quizPerson={this.props.quizPerson}/>        
            </div>
            }
            
          </div>

          {this.state.sectionEmpty &&
            <div className="sectionempty">
              <p className="fontreleway paraskillset paratopskills">Expand your self knowledge by unlocking your character skills from honest to listening to resilient.
                <br/>In order to generate a reliable view, it requires inputs from at least three teammates of you.</p>
                <a className="_24skillsbttn fontbttn profilebttn w-button" href="/invite">invite {this.state.count} more teammates to view my complete skill set</a>
            </div>
          }
          </div>
      );
    }else{
      return(
        <Loading2/>
      );
    }
    
  }
}

export default withTracker((props) => {
  var dataReady;
  var connections;
  var groups;
  var userType;
  var handle = Meteor.subscribe('connections', {
      onError: function (error) {
              console.log(error);
          }
      });
      
  var handleGroup = Meteor.subscribe('group', {
    onError: function (error) {
            console.log(error);
        }
    });
    if(Meteor.user() && (handle.ready() && handleGroup.ready())){
      connections = Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
        {email : Meteor.user().emails && Meteor.user().emails[0].address},
        {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
      ).fetch();

      let email = ( Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address ) || ( Meteor.user()  && Meteor.user().profile.emailAddress) ;
      groups = Group.find({emails:email}).fetch();

      if(props.quizPerson == Meteor.userId())
      {
        userType = "My"; 
      }
      else
        {
          let user = Meteor.users.findOne({_id: props.quizPerson});
          if(user){
            userType = (user.profile.firstName +" "+user.profile.lastName);
          }
        }
      dataReady = true;
    }
  

  return {
      currentUser: Meteor.user(),
      connections:connections,
      groups:groups,
      usertype:userType,
      dataReady:dataReady,
  };
})(SkillSet);

