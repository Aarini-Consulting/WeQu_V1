import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

class QuizPregame extends React.Component {
  render() {
    if(this.props.dataReady){
        return (
            <div className="fillHeight">
            <h1>Hi, you have pending pregame quiz</h1>
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
    var dataReady;
    var group;
    if(props.user && props.user.profile.pregame){
        var handleGroup = Meteor.subscribe('group',{_id:props.user.profile.pregame},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.user.profile.pregame}).fetch();
            dataReady = true;
        }
    }else if(props.match.params.gid){
        var handleGroup = Meteor.subscribe('group',{_id:props.match.params.gid},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.match.params.gid}).fetch();
            dataReady = true;
        }
    }else{
        dataReady = true;
    }
   
  return {
      group:group,
      dataReady:dataReady,
  };
})(QuizPregame);
