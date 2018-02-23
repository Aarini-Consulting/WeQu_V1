import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from './Quiz';

class QuizPage extends React.Component {
  render() {
    if(this.props.dataReady){
      if(!this.props.match.params.uid ||(this.props.match.params.uid && this.props.quizUser)){
        return (
          <div className="fillHeight">
          <Menu location={this.props.location} history={this.props.history}/>
          <Quiz quizUser={this.props.quizUser} group={this.props.group}/>
          </div>
        );
      }else{
        return(
          // <h1>quizuser not found</h1>
          <Redirect to={"/404"}/>
        );
      }
    }else{
      return(
        <Loading/>
      );
    }
  }
}

export default withTracker((props) => {
  var dataReady;
  var quizUser;
  var group;

  if(props.match.params.uid){
      if(props.match.params.uid){
        var handleUsers = Meteor.subscribe('users',{_id : props.match.params.uid},{}, {
          onError: function (error) {
                  console.log(error);
              }
        });

        if(handleUsers.ready()){
          
          quizUser = Meteor.users.findOne({_id : props.match.params.uid});
          if(quizUser && props.match.params.gid){
            var handleGroups = Meteor.subscribe('group',{_id : props.match.params.gid},{}, {
              onError: function (error) {
                      console.log(error);
                  }
            });
            if(handleGroups.ready()){
              group = Group.findOne({_id:props.match.params.gid});
              dataReady = true;
            }
            
          }
          else{
            dataReady = true;
          }
          
        }
      }
  }else{
    dataReady = true;
  }

  
   
  return {
      currentUser: Meteor.user(),
      quizUser: quizUser,
      group: group,
      dataReady:dataReady,
  };
})(QuizPage);
