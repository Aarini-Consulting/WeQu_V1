import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

class Radar extends React.Component {
  render() {
    return (
        <div>
            hello from profile
        </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(Radar);

