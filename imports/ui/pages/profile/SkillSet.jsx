import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading2 from '/imports/ui/pages/loading/Loading2';
import SkillCategories from './SkillCategories';

class SkillSet extends React.Component {
  constructor(props){
      super(props);
      this.state={
        sectionEmpty:true,
        count:0,
        feedback:undefined,
        feedbackCompare:undefined,
        feedbackActive:undefined
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
        count:countAlpha,
      });
      this.setFeedbackState(nextProps.allFeedback,undefined,"ALL");
    }
  }

  setFeedbackState(fb, compare, id){
    this.setState({ 
      feedback: fb,
      feedbackCompare: compare,
      feedbackActive: id 
    });
  }

  render() {
    if(this.props.dataReady){
      return (
          <div className="width-100">
            <div className="sectionprofile sectionskills" id="sectionskills">
            <div className="titlesection w-container"><img className="iconwrapper" src="/img/icon24.png"/>
              <div className="fontreleway fonttitle">
              {this.props.quizPerson == Meteor.userId()
                      ?"My "
                      :getUserName(this.props.user.profile) + " "
              }
              Character Skill Set</div>
            </div>
            {this.state.sectionEmpty
            ?
              <div className="skillcovergrey"></div>
            :
            <div className= "skillcovergrey2 fontreleway">
                <div className="row">
                  <div className={"tap-1 w-button " + (this.state.feedbackActive == "ALL" ? "active":"")} 
                  onClick={this.setFeedbackState.bind(this,this.props.allFeedback,undefined,"ALL")}>
                    ALL
                  </div>
                  <div className={"tap-1 _2 w-button " + (this.state.feedbackActive == "OTHERS" ? "active":"")} 
                  onClick={this.setFeedbackState.bind(this,this.props.othersFeedback,this.props.allFeedback,"OTHERS")}>
                    OTHERS
                  </div>
                  <div className={"tap-1 _3 w-button " + (this.state.feedbackActive == "MINE" ? "active":"")} 
                  onClick={this.setFeedbackState.bind(this,this.props.myFeedback,this.props.allFeedback,"MINE")}>
                    {this.props.quizPerson == Meteor.userId()
                      ?"MINE"
                      :getUserName(this.props.user.profile)
                    }
                  </div>
                </div>
                <SkillCategories feedback={this.state.feedback} feedbackCompare={this.state.feedbackCompare}/>       
            </div>
            }
            
          </div>

          {this.state.sectionEmpty &&
            <div className="sectionempty">
              <p className="fontreleway paraskillset paratopskills">Expand your self knowledge by unlocking your character skills from honest to listening to resilient.
                <br/>In order to generate a reliable view, it requires inputs from at least three teammates of you.</p>
                <Link className="_24skillsbttn fontbttn profilebttn w-button" to="/invite">
                Invite {this.state.count} more teammates to view my complete skill set
                </Link>
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

  var myFeedback;
  var othersFeedback;
  var allFeedback;
  var user;

  var handle = Meteor.subscribe('connections', 
    { $or : [ {inviteId:Meteor.userId()},{userId:Meteor.userId()}
      ] 
    },
    {},
    {
      onError: function (error) {
              console.log(error);
          }
      });
  var handleUsers = Meteor.subscribe('users',{_id : props.quizPerson},{}, {
    onError: function (error) {
            console.log(error);
        }
  });
  var handleGroup;

  if(Meteor.user() && handle.ready() && handleUsers.ready()){
    connections = Connections.find( { $or : [ {inviteId:Meteor.userId()}, 
      {userId:Meteor.userId()}
      ] }                                                       
    ).fetch();

    let email = ( Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address ) || ( Meteor.user()  && Meteor.user().profile.emailAddress) ;
    
    handleGroup = Meteor.subscribe('group',{emails:email},{}, {
      onError: function (error) {
              console.log(error);
          }
      });

    if(handleGroup.ready()){
      groups = Group.find({emails:email}).fetch();

      user = Meteor.users.findOne({_id: props.quizPerson});

      handleFeedback = Meteor.subscribe('feedback',{'to' : props.quizPerson},{}, {
        onError: function (error) {
              console.log(error);
          }
      });

      if(handleFeedback.ready()){
        myFeedback = Feedback.find({ 'from': props.quizPerson, 'to' : props.quizPerson }).fetch();
        othersFeedback = Feedback.find({ 'from': { '$ne': props.quizPerson }, 'to' : props.quizPerson }).fetch();
        allFeedback = Feedback.find({'to' : props.quizPerson }).fetch();
        dataReady = true;
      }
    }
  }


  return {
      currentUser: Meteor.user(),
      myFeedback:myFeedback,
      othersFeedback:othersFeedback,
      allFeedback:allFeedback,
      connections:connections,
      groups:groups,
      user:user,
      dataReady:dataReady,
  };
})(SkillSet);

