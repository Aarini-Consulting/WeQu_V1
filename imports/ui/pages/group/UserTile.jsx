import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

import Radar from '/imports/ui/pages/profile/Radar';
import Strength from '/imports/ui/pages/profile/Strength';

import SkillSetUserTile from '/imports/ui/pages/group/SkillSetUserTile';

class UserTile extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
        feedback:undefined
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataReady){
      if(!this.state.feedback){
        this.setState({
          feedback:nextProps.allFeedback
        });
      }
    }
  }


  setFeedbackState(fb){
    this.setState({ feedback: fb });
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
              <div className="tile-radar fontreleway"><img className="title-icon" src="/img/iconRadar.png"/>
                {/* <div className="font-tile font-title-title font18">Comparisons</div> */}
                {/* <img className="image-9" sizes="(max-width: 479px) 81vw, 288px" src="/img/Radar.png" srcSet="/img/Radar-p-500.png 500w, /img/Radar.png 630w" width="90"/> */}
                <svg height="300" width="300" 
                style={{zminMinHeight:300+"px", backgroundImage:"url('/img/skills2.png')", backgroundSize: "cover"}}>
                  {this.props.myScore &&
                    <Radar points = {dataForRadar(this.props.myScore)} color="white" outline="#E96956"/>
                  }
                </svg>
                
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
              <div className="title-skillgraph">
                <img className="title-icon" src="/img/icon24.png" width="12"/>
                <div className="font-tile font-title-title font18">Character Skills</div>
                <div className="row">
                  <div className="w-button" onClick={this.setFeedbackState.bind(this,this.props.allFeedback)}>
                    ALL
                  </div>
                  <div className="w-button" onClick={this.setFeedbackState.bind(this,this.props.othersFeedback)}>
                    OTHERS
                  </div>
                  <div className="w-button" onClick={this.setFeedbackState.bind(this,this.props.myFeedback)}>
                    MINE
                  </div>
                </div>
                <div className="row">
                  <SkillSetUserTile feedback={this.state.feedback}/>
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
              <div className="tile-radar"><img className="title-icon" src="/img/iconRadar.png"/>
                <div className="font-tile font-title-title font18">Comparisons</div>
                <img className="image-9" sizes="(max-width: 479px) 81vw, 288px" src="/img/Radar.png" srcSet="/img/Radar-p-500.png 500w, /img/Radar.png 630w" width="90"/>
                <img className="title-icon" src="/img/iconSkills.png" width="12"/>
                <div className="font-tile font-title-title font18">MORE TRUE Skills</div>
                <div className="row-2 w-row">
                  <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/connector.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
                  <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/creative.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
                  <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/doer.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
                </div>
                <div className="font-tile font-title-title font18">LESS TRUE Skills</div>
                <div className="w-row">
                  <div className="w-col w-col-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/connector.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
                  <div className="w-col w-col-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/creative.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
                  <div className="w-col w-col-4 w-col-small-4 w-col-tiny-4">
                    <div className="title-skillicon-div">
                      <img className="title-skill-icon" src="/img/doer.png"/>
                      <div className="font-skillicon font-tile">skill name</div>
                    </div>
                  </div>
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

    if(props.feedbackCycle){
      var cycleStart = props.feedbackCycle.from;
      var cycleEnd = props.feedbackCycle.createdAt;
      
      handleUsers = Meteor.subscribe('users',{
        $or : [ {"emails.address" : props.email  }, { "profile.emailAddress" : props.email}],
        $and: [ {  updatedAt:{"$lte":cycleEnd} }, {  updatedAt:{"$gt":cycleStart} } ]
      }, {}, {
        onError: function (error) {
                console.log(error);
            }
      });
    }else{
      handleUsers = Meteor.subscribe('users',{$or : [ {"emails.address" : props.email  }, { "profile.emailAddress" : props.email}]}, {}, {
        onError: function (error) {
                console.log(error);
            }
      });
    }

    if(handleUsers.ready()){
      user = Meteor.users.findOne({$or : [ {"emails.address" : props.email  }, { "profile.emailAddress" : props.email}]} );

      if(user){
        handleFeedback = Meteor.subscribe('feedback',{'to' : user._id},{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        if(handleFeedback.ready()){

          myFeedback = Feedback.find({ 'from': user._id, 'to' : user._id }).fetch();
          myScore = calculateScore(joinFeedbacks(myFeedback));

          othersFeedback = Feedback.find({ 'from': { '$ne': user._id }, 'to' : user._id }).fetch();
          allFeedback = Feedback.find({'to' : user._id }).fetch();

          himselfAnswered = questionHimselfAnswered(user._id);
          inviteesAnsweredHim = questionInviteesAnsweredHim(user._id);

          skillData = calculateTopWeak(Feedback.find({to: user._id }).fetch());
          
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
