import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from './loading/Loading';
// import ScriptLoginInit from './ScriptLoginInit'; 
import EmailVerified from './accounts/EmailVerified'; 
import Quiz from './quiz/Quiz';
import Profile from './profile/Profile'; 
import ScriptLoginAfterQuiz from './ScriptLoginAfterQuiz'; 
import Invite from './invite/Invite';

import {init} from '/imports/ui/pages/profile/minBlock';

import Menu from '/imports/ui/pages/menu/Menu';
import LandingSurveyComponent from './survey/LandingSurveyComponent';

class Home extends React.Component {
    constructor(props){
        super(props);
    }

    renderGroups(){
        return this.props.groups.map((group, index) => {
            var email = this.props.currentUser.emails[0].address;
            var readySurvey;
            if(group.emailsSurveyed && group.emailsSurveyed.indexOf(email) > -1){
              readySurvey = true;
            }
            var ready = (readySurvey);
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
            var isGameMaster = Roles.userIsInRole( Meteor.userId(), 'GameMaster' );
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
            if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
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
            else if(this.props.currentUser && this.props.currentUser.emails && this.props.currentUser.emails[0].verified){
                if(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.selfRank){
                    return(
                        <LandingSurveyComponent user={this.props.currentUser}/>
                    );
                }
                else{
                    if(this.props.groups && this.props.groups.length > 0){
                        return(
                            <section className="section home fontreleway">
                                <div className="w-block home-top weq-bg">
                                    {isGameMaster
                                    ?
                                        <div className="margin-bottom-menu">
                                        <Menu location={this.props.location} history={this.props.history}/>
                                        </div>
                                    :
                                        <div className="screentitlewrapper w-clearfix">
                                            <div className="fontreleway font-invite-title edit w-clearfix">
                                            <Link className="cursor-pointer" to="/settings">Settings</Link>
                                            </div>
                                        </div>
                                    }
                                    <div className="ring"></div>
                                    <div className="font-rate rank-separator-top">Welcome!</div>
                                    <div className="font-rate f-em1">Select a group below</div>
                                </div>
                                <div className="w-block home-group-list-wrapper">
                                    {this.renderGroups()}
                                </div>
                            </section>
                        )
                    }else{
                        return(
                            <section className="section home fontreleway">
                                <div className="w-block home-top weq-bg">
                                    {isGameMaster
                                    ?
                                        <div className="margin-bottom-menu">
                                        <Menu location={this.props.location} history={this.props.history}/>
                                        </div>
                                    :
                                        <div className="screentitlewrapper w-clearfix">
                                            <div className="fontreleway font-invite-title edit w-clearfix">
                                            <Link className="cursor-pointer" to="/settings">Settings</Link>
                                            </div>
                                        </div>
                                    }
                                    
                                    <div className="ring"></div>
                                    <div className="font-rate rank-separator-top">Welcome!</div>
                                </div>
                                <div className="w-block home-group-list-wrapper">
                                    <div className="fillHeight">
                                    <br/>
                                    <br/>
                                        <div className="w-block noselect">
                                            <div className="fontreleway f-popup-title">No group</div>
                                            {!isGameMaster &&
                                                <div className="fontreleway f-popup-title">You must be a WeQ Certified Master Coach to create a new group</div>
                                            }
                                        </div>
                                    </div>
                                    {/* <img src="https://orig00.deviantart.net/798a/f/2012/319/2/9/nothing_to_do_here_gif_by_cartoonzack-d5l4eqj.gif"/> */}
                                </div>
                            </section>
                        );
                    }
                }
            }else if(this.props.currentUser){
                return(
                    <EmailVerified/>
                )
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
    var groups;

    if(Meteor.userId()){
        if(Meteor.user() && Meteor.user().emails){
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

                },{
                    sort: { groupName: -1 }
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

