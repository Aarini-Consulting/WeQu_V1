import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

import Loading from '/imports/ui/pages/loading/Loading';
import Radar from './Radar';
import Strength from './Strength';
import ShareProfile from './ShareProfile';
import SkillSet from './SkillSet';
import SectionProfile from './SectionProfile';

import '/imports/startup/client/wequ-profile.webflow.css';

class Profile extends React.Component {
  render() {
    if(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.loginScript){
      return (
      <section className="feed" id="feed">

      <div className="sectionname">
        <div className="profilename w-container">
          {/* <div className="left profileclick" id="prevPerson" style="visibility:{{#if prevPerson}}visible{{else}}hidden{{/if}}">
            <img className="profilearrow" height="80" src="/img/arrowLeft.png"/>
          </div> */}
          <div className="profilefac">
            {/* <img className="avatarprofile" src="{{pictureUrl}}"/> */}
            <img src="/img/avatar.png" className="avatarprofile" id="specificUser" data-filter-id={Meteor.userId()}/>
            <div className="fontprofilename fontreleway">
            {this.props.currentUser.profile.firstName + " " + this.props.currentUser.profile.lastName} 
            </div>
          </div>
          {/* <div className="profileclick right" id="nextPerson" style="visibility:{{#if nextPerson}}visible{{else}}hidden{{/if}}">
            <img className="profilearrow" height="80" src="/img/arrowRight.png"/>
          </div> */}
        </div>
      </div>

      <div className="sectionprogress" id="sectionprogress">
        <div className="row w-row webflow-row">
          {/* <div className="columprogress w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
            <span className="fontmyself fontreleway progressnumber" href="#">{{questionHimselfAnswered}}</span>
            <div className="fontprogress fontreleway fontwidthmobile small">Answers by {{username profile}}</div>
          </div> */}
            <div className="columprogress w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
              <span className="fontothers fontreleway progressnumber" href="#">{6}</span>
              <div className="fontprogress fontreleway small">Answers by myself</div>
            </div>
            <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
              <span className="font2 fontothers fontreleway progressnumber" href="#">{9}</span>
              <div className="fontprogress fontreleway small">Answers by others</div>
            </div>
          </div>
        </div>

        <div className="progressdesdiv">
          <div className="fontprogressdes fontreleway small">Below&nbsp;information is being generated based on the inputs from you and your teammates</div>
        </div>
          
        <Radar/>

        <div className="divbttn" id="finish">
          <a className="fontbttn profilebttn w-button">
          invite my teammates to learn how they see me
          </a>
	      </div>

        <Strength/>

        <ShareProfile/>

        <SkillSet quizPerson={Meteor.userId()}/>

        <SectionProfile/>
      </section>
      );
    }
    else{
        return(
          <Loading/>
        );
    }
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(Profile);

