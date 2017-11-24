import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

class SkillSet extends React.Component {
  render() {
    return (
        <div>
          <div className="sectionprofile sectionskills" id="sectionskills">
          <div className="titlesection w-container"><img className="iconwrapper" src="/img/icon24.png"/>
            <div className="fontreleway fonttitle">{"usertype"} Character Skill Set</div>
          </div>
          {/* {#if sectionEmpty.isTrue} */}
          <div className="skillcovergrey"></div>
          {/* {else}
          
          {{> profileSkills}} */}
        </div>

        {/* {#if sectionEmpty.isTrue} */}
        <div className="sectionempty">
          <p className="fontreleway paraskillset paratopskills">Expand your self knowledge by unlocking your character skills from honest to listening to resilient.
            <br/>In order to generate a reliable view, it requires inputs from at least three teammates of you.</p>
            <a className="_24skillsbttn fontbttn profilebttn w-button" href="/invite">invite {3} more teammates to view my complete skill set</a>
          </div>
        </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(SkillSet);

