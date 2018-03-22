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

import {init} from '/imports/ui/pages/profile/minBlock';

class ScriptLogin extends React.Component {
  render() {
        if(this.props.dataReady){
            if(this.props.currentUser && this.props.currentUser.profile  && this.props.currentUser.profile.loginScript){
                if(!this.props.currentUser.profile.pictureUrl){
                    //create random gravatar image and store it in profile
                    var gravatar = init({
                        divId          : "gravatar",
                        time           : 200,
                        randomColor    : false,
                        pause           :true
                      });
                    Meteor.call('store.profile.picture',gravatar.toDataURL(), (error, result) => {
                        if(error){
                            console.log(error);
                        }
                    })
                }

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
            }else{
                Session.set( "loggedOut", true);
                Meteor.logout((error)=>{
                    if(error){
                      console.log(error);
                      return false;
                    }else{
                        this.props.history.replace('/login');
                    }
                  });
                return false;
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

