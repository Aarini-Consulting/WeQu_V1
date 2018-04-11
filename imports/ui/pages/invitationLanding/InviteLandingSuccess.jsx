import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Radar from '/imports/ui/pages/profile/Radar';0
import Loading from '/imports/ui/pages/loading/Loading';

class InviteLandingSuccess extends React.Component {
    renderSkills(skillData){
        return skillData.map((data) => {
            return (
              <div key={"skill-highlight-"+data.skill} className="skillcolumn w-col w-col-4 w-col-medium-4 w-col-small-small-stack w-col-tiny-tiny-stack">
                <div className="skillblock">
                    <img className="iconskill swapDescription1 swap1{{skill}} active" src={"/img/skills/"+data.skill+".png"}/>
                    <div className="fontreleway skillname">{data.text}</div>
                </div>
              </div>
            );
          });
      }

  render() {
      if(this.props.dataReady){
        return (
            <section className={"feed"}>
                <h2 className="fontreleway fontprofilename w-block scriptInvitationFillData">
                Well done {getUserName(this.props.quizUser.profile)}!
                </h2>

                {this.props.skillData.top3.length > 0 &&
                <div>
                    <div className="w-block">
                    <svg height="300" width="300" 
                        style={{zminMinHeight:300+"px", backgroundImage:"url('/img/skills2.png')", backgroundSize: "cover"}}>
                        {this.props.radarScore &&
                            <Radar points = {dataForRadar(this.props.radarScore)} color="white" outline="#E96956"/>
                        }
                    </svg>
                    </div>
                    <div className="fontreleway fontprofilename w-block">
                        You have discovered that<br/>
                        {getUserName(this.props.senderUser.profile)}'s top strengths are
                    </div>
                    <div className="columtop w-row">
                        {this.renderSkills(this.props.skillData.top3)}
                    </div>
                </div>
                }
                
    
                <div className="fontreleway fontprofilename w-block">Which strength do you have?</div>
                <br/> <br/>
    
                {/* <button className="loginLinkedin LLBColor customDimension" type="button">
                    <img src="/img/icon_linkedin.png"/> <span className="white-text"> Sign up with LinkedIn </span>
                </button>  */}
                
                <div id="error"></div>
    
                
                {this.props.quizUser.profile.trial
                ?
                <Link to={`/sign-up/${this.props.quizUser._id}`} className="bttn bttn-invite w-button">
                Sign up with email
                </Link>
                :
                <Link to={"/"} className="bttn bttn-invite w-button">
                Home
                </Link>
                }
                </section>
            );
      }else{
        return(
            <Loading/>
          );
      }
    
  }
}

export default withTracker((props) => {
    var senderUser;
    var skillData;
    var dataReady;
    var radarScore;

    var handleUsers = Meteor.subscribe('users',{_id : props.feedback.to}, {}, {
        onError: function (error) {
                console.log(error);
            }
      });

    if(handleUsers.ready()){
        senderUser = Meteor.users.findOne({_id : props.feedback.to});
        skillData = calculateTopWeak([props.feedback]);
        radarScore = calculateScore(joinFeedbacks([props.feedback]));
        dataReady = true;
    }

  return {
      dataReady:dataReady,
      radarScore:radarScore,
      senderUser: senderUser,
      skillData:skillData
  };
})(InviteLandingSuccess);
