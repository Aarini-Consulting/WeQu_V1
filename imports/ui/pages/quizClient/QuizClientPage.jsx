import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

import Typeform from '/imports/ui/pages/survey/Typeform';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/helper/complexLinkTranslate';
import GroupQuizClientPage from '/imports/ui/pages/groupQuizClient/GroupQuizClientPage';
import SessionFinished from './SessionFinished';
import SessionWait from './SessionWait';

import {Group} from '/collections/group';
import ChooseCardPage from '/imports/ui/pages/chooseCard/ChooseCardPage';
import QuizRankPage from '/imports/ui/pages/quizRank/QuizRankPage';

class QuizClientPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showMenu:false,
            surveyCompleted: false,
        };
    }

    toggleMenu(){
        this.setState({
            showMenu:!this.state.showMenu
        });
    }

    selectLanguage(languageCode){
        var supportedLocale = Meteor.settings.public.supportedLocale;
        var langObj;

        supportedLocale.forEach((sl)=>{
            var lang = sl.split("-")[0];
            if(langObj){
                langObj[lang] = sl;
            }else{
                langObj = {[lang]:sl};
            }
        });

        if(langObj[languageCode]){
            locale = langObj[languageCode];
        }else{
            locale = supportedLocale[0];
        }

        Meteor.call( 'user.set.locale', locale, ( error, response ) => {
            if ( error ) {
              console.log(error);
            }
        });

        this.toggleMenu();
    }

    typeformSubmitted(){
        this.setState({
            surveyCompleted: true,
        });

        Meteor.call('survey.typeform.completed', this.props.group._id , this.props.currentUser._id,
        (err, result) => {
            if(err){
            console.log(err);
            }
        });
    }

    renderMenuItem(){
        return Meteor.settings.public.languages.map((lang,index)=>{
            return (
                <div key={lang.code+index} className="div-block-center" onClick={this.selectLanguage.bind(this,lang.code)}>
                    <div className="flag-menu-item">
                        <div className="flag-menu-item-text">
                            {lang.name}
                        </div>
                    </div>
                </div>
            )
        })
    }

    renderContent() {
        if(this.props.group.isActive){
            if(this.props.group.isFinished){
                return(
                    <SessionFinished/>
                );
            }else if(this.props.group.currentGroupQuizId){
                return(
                    <GroupQuizClientPage group={this.props.group}/>
                );
            }
            else if(this.props.group.playCardTypeActive){
                return(
                    <ChooseCardPage group={this.props.group}/>
                );
            }
            else if(this.props.group.isPlaceCardActive){
                return(
                    <QuizRankPage user={this.props.currentUser} group={this.props.group}/>
                );
            }else{
                return(
                    <SessionWait/>
                );
            }
        }else{
            return(
                <div className="fillHeight weq-bg survey-done-screen">
                    <br/>
                    <div className="font-rate padding-wrapper">
                        {complexLinkTranslate("quizRankPage.FinishMessage")}
                    </div>
                    <div className="w-block cursor-pointer">
                        <Link className="font-rate f-bttn w-inline-block noselect" to={"/"}>
                            Home
                        </Link>
                    </div>
                </div>
            )
        }
    }
    
    render() {
        if(this.props.dataReady){
            if(this.props.isGroupMember){
                if(this.props.surveyCompleted || this.state.surveyCompleted){
                    var locale = i18n.getLocale();
                    var languageCode;
                    if(locale.toString().length > 2){
                        languageCode = locale.split("-")[0];
                    }else{
                        languageCode = locale;
                    }

                    // var selectedLang = Meteor.settings.public.languages.find((lang)=>{
                    //     return lang.code == languageCode;
                    // })

                    return(
                        <div style={{height:100+"%"}}>
                            <a className="w-clearfix quiz-toggle" onClick={this.toggleMenu.bind(this)}>
                                <i className="fas fa-language fa-2x"></i>
                            </a>

                            {this.renderContent()}

                            {this.state.showMenu &&
                                <div className="flag-menu-open">
                                    {this.renderMenuItem()}
                                </div>
                            }
                        </div>
                    );
                }else{
                    return(
                        <Typeform onSubmitCallback={this.typeformSubmitted.bind(this)} groupLanguage={this.props.group.groupLanguage}/>
                    )
                }
            }else{
                return(
                    <Redirect to="/"/>
                )
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
    var group;
    var currentUser;
    var surveyCompleted;
    var isGroupMember;

    if(props.user && props.user.profile.selfRank){
        var handleGroup = Meteor.subscribe('group',{_id:props.user.profile.selfRank},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });
        currentUser = props.user;
        if(handleGroup.ready() && currentUser){
            group = Group.findOne({_id:props.user.profile.selfRank});
            dataReady = true;
        }
    }else if(props.match.params.gid){
        var handleGroup = Meteor.subscribe('group',{_id:props.match.params.gid},{}, {
            onError: function (error) {
                  console.log(error);
            }
        });
        currentUser = Meteor.user();

        if(handleGroup.ready() && currentUser){
            group = Group.findOne({_id:props.match.params.gid});
            var userId = currentUser._id;
            isGroupMember = group && group.userIds && group.userIds.indexOf(userId) > -1;
            surveyCompleted = group && group.userIdsSurveyed && group.userIdsSurveyed.indexOf(userId) > -1;
            
            dataReady = true;
        }
    }else{
        dataReady = true;
    }
   
  return {
      group:group,
      currentUser:currentUser,
      surveyCompleted:surveyCompleted,
      isGroupMember:isGroupMember,
      dataReady:dataReady,
  };
})(QuizClientPage);
