import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Accounts } from 'meteor/accounts-base'

import Loading from '/imports/ui/pages/loading/Loading';

class CheckLoginVerified extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    if(!Meteor.loggingIn() && !Meteor.userId()){
        Session.set( "loginRedirect", this.props.location.pathname);
        return(
          <Redirect to="/login"/>
        ); 
    }else{
        if(this.props.dataReady){
            if(this.props.currentUser && this.props.currentUser.emails && this.props.currentUser.emails[0].verified){
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

  if(Meteor.user()){
      dataReady = true;
  }
  return {
    dataReady: dataReady,
    currentUser: Meteor.user(),
    token: props.match.params.token,
  };
})(CheckLoginVerified);