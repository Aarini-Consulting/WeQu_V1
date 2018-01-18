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
    return (
        <section className={"gradient"+(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.gradient)+" whiteText alignCenter"}>
            <h2 className="scriptInvitationFillData marginTop25 marginTop25">
            Well done {getUserName(this.props.quizUser.profile)}!
            </h2>
            <h2>
                You have discovered that<br/>
                {getUserName(this.props.senderUser.profile)}'s top strengths are
            </h2>
            <div className="columtop w-row">
            {this.renderSkills(this.props.skillData)}
            </div>

            <h2>Which strength do you have?</h2>

            {/* <button className="loginLinkedin LLBColor customDimension" type="button">
                <img src="/img/icon_linkedin.png"/> <span className="white-text"> Sign up with LinkedIn </span>
            </button>  */}
            
            <div id="error"></div>

            <button className="next transparent customDimension margin30">
            <Link to={`/sign-up/${this.props.quizUser._id}`} className="font-white">
            Sign up with email
            </Link>
            </button>
            </section>
        );
  }
}

export default withTracker((props) => {

    var handleFeedback = Meteor.subscribe('feedback', {
        onError: function (error) {
              console.log(error);
          }
      });
    var dataReady;
    var senderUser;
    var skillData;
    if(handleFeedback.ready()){
        senderUser = Meteor.users.findOne({_id : props.feedback.from});
        skillData = calculateTopWeak(Feedback.find({to: user._id }).fetch());
        dataReady = true;
    }
    

  return {
      dataReady:dataReady,
      senderUser: senderUser,
      skillData:skillData
  };
})(InviteLandingSuccess);
