import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

import RadarD3 from '/imports/ui/pages/profile/RadarD3';
import Strength from '/imports/ui/pages/profile/Strength';

import SkillSetUserTile from '/imports/ui/pages/group/SkillSetUserTile';

class UserTile extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
        feedback:undefined,
        feedbackCompare:undefined,
        feedbackActive:undefined
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataReady){
      if(!this.state.feedback){
        this.setFeedbackState(nextProps.allFeedback,undefined,"ALL");
      }else if(this.state.feedbackActive){
        switch(this.state.feedbackActive){
          case "ALL":
            this.setFeedbackState(nextProps.allFeedback,undefined,"ALL");
            break;
          case "OTHERS":
            this.setFeedbackState(nextProps.othersFeedback,nextProps.allFeedback,"OTHERS");
            break;
          case "MINE":
            this.setFeedbackState(nextProps.myFeedback,nextProps.allFeedback,"MINE");
            break;
        }
      }
    }
  }


  setFeedbackState(fb, compare, id){
    this.setState({ 
      feedback: fb,
      feedbackCompare: compare,
      feedbackActive: id 
    });
  }

  renderSkills(skillData){
    return skillData.map((data) => {
        return (
          <div key={"skill-highlight-"+data.skill} className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
            <div className="title-skillicon-div"><img className="title-skill-icon" src={"/img/skills/"+data.skill+".png"}/>
              <div className="font-skillicon font-tile">{data.text}</div>
            </div>
          </div>
        );
      });
  }

  render() {
    if(this.props.dataReady){
      if(this.props.user){
        return(
          <div className="column-3 w-clearfix w-col w-col-4 w-col-stack">
              <div className="profile-tile-wrapper w-clearfix">
              <div className="tile-name w-clearfix">
                {/* <a className="tile-arrow-left tile-nav-arrow w-hidden-main w-hidden-medium w-inline-block">
                <img className="w-hidden-main w-hidden-medium" src="/img/arrowLeft.png" width="10"/>
                </a> */}
                <div className="font-tile-name">{this.props.email}</div>
                <div className="name-stat">
                  <div className="w-row">
                    <div className="column-2 w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                      <div className="font-number-username font-tile">{this.props.himselfAnswered}</div>
                      <div className="tile-name-stat-number">
                        <div className="font-byusername font-title">By {getUserName(this.props.user.profile)}</div>
                      </div>
                    </div>
                    <div className="w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                      <div className="font-by-teammates font-number-username font-tile">{this.props.inviteesAnsweredHim}</div>
                      <div className="font-title">By teammates</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile-content fontreleway cream"><img className="titleIcon" src="/img/iconRadar.png"/>
                <div className="font-tile font-title-title font18">Comparisons</div>
                {/* <img className="image-9" sizes="(max-width: 479px) 81vw, 288px" src="/img/Radar.png" srcSet="/img/Radar-p-500.png 500w, /img/Radar.png 630w" width="90"/> */}
                <div className="tile-content-wrapper">
                  <RadarD3 myPoints={this.props.myScore} otherPoints={this.props.otherScore}/>
                </div>

                <div className="radarAgenda tile">
                  <div><img src="/img/Diamond_Myself.png"/>
                    <span className="marginleft10 my-color">  
                      How <span className="text-capitalize"> {getUserName(this.props.user.profile)}</span> sees himself  
                    </span>
                  </div>
                  <div><img src="/img/Diamond_Others.png" className="t50"/>
                    <span className="marginleft10 other-color">
                      How others see <span className="text-capitalize">{getUserName(this.props.user.profile)}</span> 
                    </span> 
                  </div>
                </div>
              </div>

              <div className="tile-content top-weak">
                <img className="title-icon" src="/img/iconSkills.png" width="12"/>
                <div className="font-tile font-title-title font18">MORE TRUE Skills</div>
                <div className="row-2 w-row">
                  {this.renderSkills(this.props.skillData.top3)}
                </div>

                <div className="font-tile font-title-title font18">LESS TRUE Skills</div>
                <div className="w-row">
                  {this.renderSkills(this.props.skillData.weak3)}
                </div>
              </div>
              <div className="tile-content title-skillgraph">
                <img className="title-icon" src="/img/icon24.png" width="12"/>
                <div className="font-tile font-title-title font18">Character Skills</div>
                <div className="tile-content">
                  <div className={"tap-1 w-button " + (this.state.feedbackActive == "ALL" ? "active":"") + " tap-1-tile"} 
                  onClick={this.setFeedbackState.bind(this,this.props.allFeedback,undefined,"ALL")}>
                    ALL
                  </div>
                  <div className={"tap-1 _2 w-button " + (this.state.feedbackActive == "OTHERS" ? "active":"") + " tap-1-tile"} 
                  onClick={this.setFeedbackState.bind(this,this.props.othersFeedback,this.props.allFeedback,"OTHERS")}>
                    OTHERS
                  </div>
                  <div className={"tap-1 _3 w-button " + (this.state.feedbackActive == "MINE" ? "active":"") + " tap-1-tile"} 
                  onClick={this.setFeedbackState.bind(this,this.props.myFeedback,this.props.allFeedback,"MINE")}>
                    His/Hers
                  </div>
                </div>
                <div className="row">
                  <SkillSetUserTile feedback={this.state.feedback} feedbackCompare={this.state.feedbackCompare}/>
                </div>
              </div>
              </div>
        </div>
        )
      }else {
        return(
          <div className="column-3 w-clearfix w-col w-col-4 w-col-stack">
              <div className="profile-tile-wrapper w-clearfix">
              <div className="tile-name w-clearfix">
                <div className="font-tile-name">{this.props.email}</div>
                <div className="name-stat">
                  <div className="w-row">
                    <div className="column-2 w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                      <div className="font-number-username font-tile">0</div>
                      <div className="tile-name-stat-number">
                        <div className="font-byusername font-title">By Username</div>
                      </div>
                    </div>
                    <div className="w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6">
                      <div className="font-by-teammates font-number-username font-tile">0</div>
                      <div className="font-title">By teammates</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tile-content fontreleway cream"><img className="title-icon" src="/img/iconRadar.png"/>
                <div className="font-tile font-title-title font18">Comparisons</div>
                <img className="image-9" sizes="(max-width: 479px) 81vw, 288px" src="/img/Radar.png" srcSet="/img/Radar-p-500.png 500w, /img/Radar.png 630w" width="90"/>
              </div>
              <div className="tile-content fontreleway">
                <img className="title-icon" src="/img/iconSkills.png" width="12"/>
                <div className="font-tile font-title-title font18">MORE TRUE Skills</div>
                <div className="row-2 w-row">
                N/A
                </div>
                <div className="font-tile font-title-title font18">LESS TRUE Skills</div>
                <div className="w-row">
                N/A
                </div>
              </div>
              <div className="title-skillgraph">
                <img className="title-icon" src="/img/icon24.png" width="12"/>
                <div className="font-tile font-title-title font18">Character Skills</div>
              </div>
              </div>
        </div>
        )
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
  var user;
  var myScore;
  var otherScore;
  var himselfAnswered = 0;
  var inviteesAnsweredHim = 0;
  var skillData;
  var categories={};
  var handleFeedback;
  var othersFeedback;
  var myFeedback;
  var allFeedback;
  var handleUsers;

  if(props.email){
    handleUsers = Meteor.subscribe('users',{$or : [ {"emails.address" : props.email  }, { "profile.emailAddress" : props.email}]}, {}, {
      onError: function (error) {
              console.log(error);
          }
    });

    if(handleUsers.ready()){
      user = Meteor.users.findOne({$or : [ {"emails.address" : props.email  }, { "profile.emailAddress" : props.email}]} );

      if(user){

        if(props.feedbackCycle){
          var cycleStart = props.feedbackCycle.from;
          var cycleEnd = props.feedbackCycle.to;
          
          handleFeedback = Meteor.subscribe('feedback',
          {
            'to' : user._id,
            $or: [ 
              { 'from': user._id },
              {$and: [ {"from":{ '$ne': user._id }},{  updatedAt:{"$lte":cycleEnd} }, {  updatedAt:{"$gte":cycleStart} } ]}
            ],
          },
          {}, {
            onError: function (error) {
                  console.log(error);
              }
          });
        }else{
          handleFeedback = Meteor.subscribe('feedback',{'to' : user._id,},{}, {
            onError: function (error) {
                  console.log(error);
              }
          });
        }
        

        if(handleFeedback.ready()){

          myFeedback = Feedback.find({'from': user._id, 'to' : user._id }).fetch();
          myScore = calculateScore(joinFeedbacks(myFeedback));

          othersFeedback = Feedback.find({'groupId':props.group._id, 'from': { '$ne': user._id }, 'to' : user._id }).fetch();
          otherScore = calculateScore(joinFeedbacks(othersFeedback));

          allFeedback = Feedback.find({'to' : user._id }).fetch();

          himselfAnswered = questionHimselfAnswered(user._id);
          inviteesAnsweredHim = questionInviteesAnsweredHim(user._id, props.group._id);

          skillData = calculateTopWeak(Feedback.find({'to': user._id }).fetch());
          
          dataReady = true;
        }      
      }else{
        dataReady = true;
      }
    }
  }
  return {
      user: user,
      myScore:myScore,
      otherScore:otherScore,
      himselfAnswered:himselfAnswered,
      inviteesAnsweredHim:inviteesAnsweredHim,
      skillData:skillData,
      allFeedback:allFeedback,
      myFeedback:myFeedback,
      othersFeedback:othersFeedback,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(UserTile);
