import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

import Loading2 from '/imports/ui/pages/loading/Loading2';

export default class Radar extends React.Component {
  render() {
    return (
      <polygon 
      points={
        this.props.points.VIRTUE +" "+ this.props.points.SELF_MANAGEMENT +" "+ 
        this.props.points.COMMUNICATION +" "+ this.props.points.TEAMWORK +" "+ 
        this.props.points.LEADERSHIP +" "+ this.props.points.PROBLEM_SOLVING
      }
      fill={this.props.color} fillOpacity="0.5" stroke={this.props.outline} strokeWidth="1" />
    );
  }
}

