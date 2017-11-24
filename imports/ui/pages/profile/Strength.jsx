import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

class Strength extends React.Component {
  render() {
    return (
        <div className="sectiongreybg sectionprofile">
        {/* <div className="sectiongreybg sectionprofile">
          <center> There is no information about {{userType}} </center>
        </div> */}
            <div className="titlesection w-container"><img className="iconwrapper" src="/img/iconSkills.png"/>
            <div className="fontreleway fonttitle">{{userType}} MORE TRUE Skills</div>
            </div>

            {/* <threeSkills data=top3/> */}

            <div className="fontreleway fonttitle">{{userType}} LESS TRUE Skills</div>

            {/* <threeSkills data=weak3/> */}

            <p className="fontreleway paratopskills">These skills are selected based on the questions you and your teammates have answered about you.
            <br/>The more questions you answered, the more accurate your profile becomes.
            </p>

            <div className="sectionprofile sectiongreybg paddingTopInverse45" id="outer">
            <a className="fontbttn profilebttn w-button" id="specificUser">Answer more questions about {{userType}}</a>
            </div>
        </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(Strength);

