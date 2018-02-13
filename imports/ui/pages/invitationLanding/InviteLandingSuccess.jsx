import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

class InviteLandingSuccess extends React.Component {
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
        return (
            <section className={"gradient whiteText alignCenter"}>
                <h2 className="scriptInvitationFillData marginTop25 marginTop25">
                Well done {getUserName(this.props.quizUser.profile)}!
                </h2>

                {this.props.skillData.top3.length > 0 &&
                <div>
                    <h2>
                        You have discovered that<br/>
                        {getUserName(this.props.senderUser.profile)}'s top strengths are
                    </h2>
                    <div className="columtop w-row">
                    {this.renderSkills(this.props.skillData.top3)}
                    </div>
                </div>
                }
                
    
                <h2>Which strength do you have?</h2>
    
                {/* <button className="loginLinkedin LLBColor customDimension" type="button">
                    <img src="/img/icon_linkedin.png"/> <span className="white-text"> Sign up with LinkedIn </span>
                </button>  */}
                
                <div id="error"></div>
    
                
                {this.props.quizUser.profile.trial
                ?
                <Link to={`/sign-up/${this.props.quizUser._id}`} className="next transparent customDimension margin30 font-white">
                Sign up with email
                </Link>
                :
                <Link to={"/"} className="next transparent customDimension margin30 font-white">
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
    var handleUsers = Meteor.subscribe('users',{_id : props.feedback.to}, {}, {
        onError: function (error) {
                console.log(error);
            }
      });

    if(handleUsers.ready()){
        senderUser = Meteor.users.findOne({_id : props.feedback.to});
        skillData = calculateTopWeak([props.feedback]);
        dataReady = true;
    }

  return {
      dataReady:dataReady,
      senderUser: senderUser,
      skillData:skillData
  };
})(InviteLandingSuccess);
