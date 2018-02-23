import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';

import Loading from './loading/Loading';
// import ScriptLoginInit from './ScriptLoginInit'; 
import EmailVerified from './accounts/EmailVerified'; 
import Quiz from './quiz/Quiz'; 
import Profile from './profile/Profile'; 
import ScriptLoginAfterQuiz from './ScriptLoginAfterQuiz'; 
import Invite from './invite/Invite';

class ScriptLogin extends React.Component {
  render() {
        if(this.props.dataReady && this.props.currentUser.profile){
                switch(this.props.currentUser.profile.loginScript) {
                    case 'init': {
                        var condition = true;
        
                        // TODO : Need more robust condition here
        
                        if(this.props.currentUser && this.props.currentUser.services && this.props.currentUser.services.linkedin != undefined)
                        {
                            condition = true;
                        }
                        else if(Meteor.settings.public.verifyEmail)
                        {
                            condition = this.props.currentUser && this.props.currentUser.emails && this.props.currentUser.emails[0].verified;
                        }
        
                        if(condition)
                        {
                            return (
                                <div className="fillHeight">
                                    <Quiz/>
                                </div>
                            );
                        }
                        else
                        {
                            return (<EmailVerified/>);
                            
                        }
                        break;
        
                    }
                    case 'quiz': {
                        return (
                        <div className="fillHeight">
                            <Quiz/>
                        </div>
                        );
                        break;
                    }
                    case 'after-quiz' :
                        return (<ScriptLoginAfterQuiz location={this.props.location} history={this.props.history}/>)
                        break;
                    default:
                        return (<Redirect to={"/quiz"}/>);
                        break;
                }
        }
        else{
            return(
                <Loading/>
            );
        }
  }
}

export default withTracker((props) => {
    var dataReady;

    if(Meteor.user()){
        dataReady = true;
    }
    return {
        dataReady:dataReady,
        currentUser: Meteor.user()
    };
  })(ScriptLogin);

