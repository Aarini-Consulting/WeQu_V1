import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';

import Loading from './loading/Loading';
// import ScriptLoginInit from './ScriptLoginInit'; 
import EmailVerified from './accounts/EmailVerified'; 
import Quiz from './quiz/Quiz';
import QuizPregame from './quizPregame/QuizPregame'; 
import QuizPregameReminder from './quizPregame/QuizPregameReminder'; 
import Profile from './profile/Profile'; 
import ScriptLoginAfterQuiz from './ScriptLoginAfterQuiz'; 
import Invite from './invite/Invite';

import {init} from '/imports/ui/pages/profile/minBlock';

import Menu from '/imports/ui/pages/menu/Menu';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showPregameReminder:false,
        }
    }

    componentDidMount(){
        this.setState({
            showPregameReminder: (this.props.groups && this.props.groups.length > 0),
          });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showPregameReminder: (nextProps.groups && nextProps.groups.length > 0),
        });
    }

    render() {
        if(this.props.dataReady){
            if(this.props.currentUser && this.props.currentUser.profile  && !this.props.currentUser.profile.pictureUrl){
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

            if(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.pregame){
                return(
                    <QuizPregame user={this.props.currentUser}/>
                );
            }
            else{
                if(Roles.userIsInRole( Meteor.userId(), 'GameMaster' )){
                    return(
                        <Redirect to="/invite-group"/>
                    )
                }else{
                    return(
                        <div className="fillHeight">
                            <section className="section summary fontreleway groupbg">
                            <h1>im home</h1>
                            </section>
                        </div>
                    )
                }
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
    var groups;

    if(Meteor.userId()){
        if(Meteor.user()){
            var email = Meteor.user().emails[0].address;
            handleGroup = Meteor.subscribe('group',{
                $and : [ {"emails" : email }, 
                { "emailsPregameCompleted" : {$nin:[email]}}]
                
            },{}, {
                onError: function (error) {
                      console.log(error);
                  }
            });

            if(handleGroup.ready()){
                groups = Group.find({
                    $and : [ {"emails" : email }, 
                    { "emailsPregameCompleted" : {$nin:[email]}}]
                    
                }).fetch();

                dataReady = true;
            }
        }
    }else{
        dataReady = true;
    }
    
    return {
        dataReady:dataReady,
        groups:groups,
        currentUser: Meteor.user()
    };
  })(Home);

