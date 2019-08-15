import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from './loading/Loading';
import EmailVerified from './accounts/EmailVerified';

import Menu from '/imports/ui/pages/menu/Menu';
import LandingSurveyComponent from './survey/LandingSurveyComponent';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {Group} from '/collections/group';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showPopup:false,
            popupSelectedGroup:undefined
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.groups && nextProps.groups && this.props.groups.length > 0 && nextProps.groups.length > 0){
            var existingGroupsArray = this.props.groups.map((group)=>{
                return group._id;
            });
            nextProps.groups.forEach((group, index)=>{
                var oldIndex = existingGroupsArray.indexOf(group._id);
                if(oldIndex > -1){
                    var oldGroup = this.props.groups[oldIndex];
                    if(oldGroup._id == group._id){
                        var placeCardStarted = !oldGroup.isPlaceCardActive && group.isPlaceCardActive;
                        var groupQuizStarted = !oldGroup.currentGroupQuizId && group.currentGroupQuizId;
                        var playCardStarted = !oldGroup.playCardTypeActive && group.playCardTypeActive;
            
                        if(groupQuizStarted || placeCardStarted || playCardStarted){
                            this.setState({ 
                                showPopup: true,
                                popupSelectedGroup: group
                            });
                        }
                    }
                }
            })
        }
    }

    renderGroups(){
        return this.props.groups.map((group, index) => {
            var userId = this.props.currentUser._id;
            var readySurvey;
            if(group.userIdsSurveyed && group.userIdsSurveyed.indexOf(userId) > -1){
              readySurvey = true;
            }
            var ready = (readySurvey);
            var started = group.isActive;
            var finished = group.isFinished;
            var status;

            if(finished){
                status = <div className="w-inline-block group-entry-right s-4"><T>weq.home.CompletedSession</T></div>;
            }
            else if(started){
                status = <div className="w-inline-block group-entry-right s-3"><T>weq.home.LiveSession</T></div>;
            }
            else if(ready && !started){
                status = <div className="w-inline-block group-entry-right s-2"><T>weq.home.WaitForSession</T></div>
            }else if(!ready){
                status = <div className="w-inline-block group-entry-right s-1"><T>weq.home.JustInvited</T></div>
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
            // if(this.props.currentUser && this.props.currentUser.profile  && !this.props.currentUser.profile.pictureUrl){
            //     //create random gravatar image and store it in profile
            //     var gravatar = init({
            //         divId          : "gravatar",
            //         time           : 200,
            //         randomColor    : false,
            //         pause           :true
            //       });
            //     Meteor.call('store.profile.picture',gravatar.toDataURL(), (error, result) => {
            //         if(error){
            //             console.log(error);
            //         }
            //     })
            // }
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
                                            <Link className="cursor-pointer" to="/settings"><T>weq.home.Account</T></Link>
                                            </div>
                                        </div>
                                    }
                                    <div className="ring home"></div>
                                    <div className="font-rate"><T>weq.home.Welcome</T></div>
                                    <br/>
                                    {/* <div className="font-rate f-em1"><T>weq.home.GroupSelection</T></div> */}

                                    <div className="w-block home-group-list-wrapper">
                                        <div className="group-row">
                                            <div className="w-inline-block group-entry-left header">Group</div>
                                            <div className="w-inline-block group-entry-right header">Session Status</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-block home-group-list-wrapper">
                                    {this.renderGroups()}
                                </div>

                                {this.state.showPopup &&
                                    <SweetAlert
                                    type={"confirm"}
                                    message={`A group session "${this.state.popupSelectedGroup.groupName}" has begun`}
                                    imageUrl={"/img/gameMaster/interactive.gif"}
                                    confirmText={"Join session now"}
                                    cancelText={"Not now"}
                                    onCancel={() => {
                                        this.setState({ 
                                            showPopup: false, 
                                            popupSelectedGroup:undefined 
                                        });
                                    }}
                                    onConfirm={() => {
                                        // this.setState({ 
                                        //     showPopup: false,
                                        //     popupSelectedGroup:undefined
                                        // });
                                        this.props.history.push(`/quiz/${ this.state.popupSelectedGroup._id }`);
                                    }}/>
                                }
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
                                            <Link className="cursor-pointer" to="/settings"><T>weq.home.Account</T></Link>
                                            </div>
                                        </div>
                                    }
                                    
                                    <div className="ring home"></div>
                                    <div className="font-rate"><T>weq.home.Welcome</T></div>
                                </div>
                                <div className="w-block home-group-list-wrapper">
                                    <div style={{height:100+"%"}}>
                                    <br/>
                                    <br/>
                                        <div className="w-block noselect">
                                            <div className="fontreleway f-popup-title"><T>weq.home.NoGroupSelection</T></div>
                                            {!isGameMaster &&
                                                <div className="fontreleway f-popup-title"><T>weq.home.CertifiedCoach</T></div>
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
        if(Meteor.user()){
            var userId = Meteor.user()._id;
            handleGroup = Meteor.subscribe('group',{
                "userIds" : userId 
                
            },{}, {
                onError: function (error) {
                      console.log(error);
                  }
            });

            if(handleGroup.ready()){
                groups = Group.find({
                    "userIds" : userId
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

