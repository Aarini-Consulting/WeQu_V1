import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from './loading/Loading';
// import ScriptLoginInit from './ScriptLoginInit'; 
import EmailVerified from './accounts/EmailVerified'; 
import Quiz from './quiz/Quiz';
import QuizPregame from './quizPregame/QuizPregame';
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

    renderGroups(){
        return this.props.groups.map((group, index) => {
            var email = this.props.currentUser.emails[0].address;
            var readySurvey, readyPregame;
            if(group.emailsSurveyed && group.emailsSurveyed.indexOf(email) > -1){
              readySurvey = true;
            }
            if(group.emailsPregameCompleted && group.emailsPregameCompleted.indexOf(email) > -1){
              readyPregame = true;
            }
            var ready = (readySurvey && readyPregame);
            var started = group.isActive;
            var finished = group.isFinished;
            var status;

            if(finished){
                status = <div className="w-inline-block group-entry-right s-4">This session is completed</div>;
            }
            else if(started){
                status = <div className="w-inline-block group-entry-right s-3">This session is live. Get started now.</div>;
            }
            else if(ready && !started){
                status = <div className="w-inline-block group-entry-right s-2">Please wait until session starts.</div>
            }else if(!ready){
                status = <div className="w-inline-block group-entry-right s-1">Just invited. Get started now.</div>
            }
            return(
                <div className="group-row cursor-pointer" key={group._id} 
                onClick={()=>{
                    this.props.history.push(`/quiz/${ group._id }`);
                }}>
                    <div className="w-inline-block group-entry-left">{group.groupName}</div>
                    {status}
                </div>
            )
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
                        
                            <section className="section home fontreleway">
                            <div className="w-block home-top weq-bg">
                                <div className="screentitlewrapper w-clearfix">
                                    <div className="fontreleway font-invite-title edit w-clearfix">
                                    <Link className="cursor-pointer" to="/settings">Settings</Link>
                                    </div>
                                </div>
                                <div className="ring"></div>
                                <div className="font-rate rank-separator-top">Welcome!</div>
                                <div className="font-rate f-em1">Select a group below</div>
                            </div>
                            <div className="w-block home-group-list-wrapper">
                                {this.renderGroups()}
                            </div>

                            </section>
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
                "emails" : email 
                
            },{}, {
                onError: function (error) {
                      console.log(error);
                  }
            });

            if(handleGroup.ready()){
                groups = Group.find({
                    "emails" : email 

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

