import React from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';

class GamemasterOnly extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    if(!Meteor.loggingIn() && !Meteor.userId()){
        if(!Session.get("loggedOut")){
            Session.set( "loginRedirect", this.props.location.pathname);
        }
        return(
          <Redirect to="/login"/>
        ); 
    }else{
        if(this.props.dataReady){
            if(this.props.currentUser && (Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) || Roles.userIsInRole( Meteor.userId(), 'TrialGameMaster' ))){
                return (
                    this.props.childComponent
                );
            }else{
                return(
                    <Redirect to="/"/>
                  ); 
            }
        }else{
            return(
                <div className="loginwraper">
                    <Loading/>
                </div>
            );
        }
        
        
    }
  }
}

export default withTracker((props) => {
  var dataReady = false;
  var currentUser = Meteor.user();
  if(Meteor.userId() && currentUser){
      dataReady = true;
  }else if(!Meteor.userId()){
      dataReady = true;
  }
  return {
    dataReady: dataReady,
    currentUser: currentUser,
  };
})(GamemasterOnly);