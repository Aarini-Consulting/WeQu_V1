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
          <Quiz quizUser={this.props.quizUser}/>
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
  var feedback;
  var quizUser;

  if(props.match.params.uid){
    var handle = Meteor.subscribe('users',props.match.params.uid, {
      onError: function (error) {
            console.log(error);
        }
      });
  
    if(handle.ready()){
      if(props.match.params.uid){
        quizUser = Meteor.users.findOne({_id : props.match.params.uid});
      }
     
      dataReady = true;
    }
  }else{
    dataReady = true;
  }

  
   
  return {
      currentUser: Meteor.user(),
      quizUser: quizUser,
      dataReady:dataReady,
  };
})(QuizPage);
