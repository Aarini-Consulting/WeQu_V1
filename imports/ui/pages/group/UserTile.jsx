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
import SkillCategories from '/imports/ui/pages/profile/SkillCategories';

class UserTile extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
      }
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

  renderCategorySkills(skills){
    return skills.map((skill) => {
        return (
            <div key={skill.name} className="skillElement">
              <div className="title font-title font18" style={{width:20+"%"}}>
                {skill.name} </div>
              <div className="underBar" style={{width:40+"%"}}>
                <div className={"bar "+skill.category} style={{width:skill.value + "%"}}></div>
              </div>
              <div className="font-title font18 marginleft3P" style={{width:10+"%"}}>
              {skill.total <= 0 
              ?"0"
              :(skill.scored/skill.total)
              }
              </div>
            </div>
        );
      });
  }

  renderCategories(){
    return this.props.categories.map((cat) => {
        return (
            <div key={cat.name}>
                <div className="skillElement">
                  <div className="title font-title font18">{cat.name}</div>
                  <div className="underBar" style={{width:20+"%",visibility:"hidden"}}></div>
                </div>
                {this.renderCategorySkills(cat.skills)}
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
                <div className="font-tile font-title-title font18">Comparisons</div>
                {/* <img className="image-9" sizes="(max-width: 479px) 81vw, 288px" src="/img/Radar.png" srcSet="/img/Radar-p-500.png 500w, /img/Radar.png 630w" width="90"/> */}
                <svg height="300" width="300" 
                style={{zminMinHeight:300+"px", backgroundImage:"url('/img/skills2.png')", backgroundSize: "cover"}}>
                  {this.props.myScore &&
                    <Radar points = {dataForRadar(this.props.myScore)} color="white" outline="#E96956"/>
                  }
                  {this.props.otherScore &&
                    <Radar points = {dataForRadar(this.props.otherScore)} color="#E96956" outline="white"/>
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

                  <div className="col-md-12 col-sm-12 col-xs-12">
                    {this.renderCategories()}
                  </div> 
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
  var otherScore;
  var himselfAnswered = 0;
  var inviteesAnsweredHim = 0;
  var skillData;
  var categories;
  var handleFeedback;
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
        handleFeedback = Meteor.subscribe('feedback',{'to' : user._id},{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        if(handleFeedback.ready()){

          // var myfeedback = Feedback.find({ 'from': user._id, 'to' : user._id }).fetch();
          // myScore = calculateScore(joinFeedbacks(myfeedback));

          var otherFeedback = Feedback.find({ 'from': { '$ne': user._id }, 'to' : user._id }).fetch();
          otherscore = calculateScore(joinFeedbacks(otherFeedback));

          himselfAnswered = questionHimselfAnswered(user._id);
          inviteesAnsweredHim = questionInviteesAnsweredHim(user._id);

          skillData = calculateTopWeak(Feedback.find({to: user._id }).fetch());

          var joinedQset = Feedback.find({ 'to' : user._id }).fetch().map((fb, index)=>{
              return fb.qset;
          })
            
          var otherscore = calculateScore(joinedQset, true);

          var i=0;
          categories = _.map(_.keys(framework), function(category) {
                  return {
                      name : i18n[category],
                      category : category,
                      skills : _.map(framework[category], function(skill){
                          var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                          if(otherscore.total[skill] > 0) {
                              data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                          }
                          return data;
                      })
                  }
          });
          
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
      categories:categories,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(UserTile);
