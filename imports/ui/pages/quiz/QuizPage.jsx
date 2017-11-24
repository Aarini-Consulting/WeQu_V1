import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from './Quiz';

export default class QuizPage extends React.Component {
  render() {
    return (
        <div className="fillHeight">
        <Menu location={this.props.location} history={this.props.history}/>
        <Quiz/>
        </div>
    );
  }
}