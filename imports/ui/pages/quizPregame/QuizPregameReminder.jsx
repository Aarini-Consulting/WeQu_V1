import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

class QuizPregameReminder extends React.Component {
  render() {
    if(this.props.dataReady){
        var link = "/pregame";
        if(this.props.groups && this.props.groups.length == 1){
            link = `pregame/${ this.props.groups[0]._id }`;
        }
        return (
            <div className="fillHeight">
            <h1>Hi, you have pending pregame quiz</h1>
            {this.props.groups && this.props.groups.length > 0 &&
                <Link to={link} className="loginBtn">Let's do this</Link>
            }
            <div onClick={this.props.hideReminder}>ignore</div>
            </div>
        );
    }else{
      return(
        <Loading/>
      );
    }
  }
}

export default withTracker((props) => {
   
  return {
      dataReady:true,
  };
})(QuizPregameReminder);
