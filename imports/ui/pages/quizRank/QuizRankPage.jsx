import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';
import QuizRankPlaceCards from '/imports/ui/pages/quizRank/QuizRankPlaceCards';
import QuizRankSelf from './QuizRankSelf';
import QuizRankOther from './QuizRankOther';
import QuizRankWait from './QuizRankWait';

import Typeform from '/imports/ui/pages/survey/Typeform';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/ui/complexLinkTranslate';

class QuizRankPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            surveyCompleted: false,
        };
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
    
    render() {
        if(this.props.dataReady){
            if(this.props.isGroupMember){
                if(this.props.surveyCompleted || this.state.surveyCompleted){
                    if(this.props.group.isActive){
                        if(this.props.selfRankCompleted){
                            if(this.props.group.isFinished){
                                return(
                                    <QuizRankPlaceCards user={this.props.currentUser} group={this.props.group}/>
                                )
                            }else{
                                return(
                                    <QuizRankWait user={this.props.currentUser} group={this.props.group}/>
                                )
                            }
                            
                        }else{
                            return (
                                <QuizRankSelf user={this.props.currentUser} group={this.props.group}/>
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
    var selfRankCompleted;
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
            selfRankCompleted = group.userIdsSelfRankCompleted && group.userIdsSelfRankCompleted.indexOf(userId) > -1;
            dataReady = true;
        }
    }else{
        dataReady = true;
    }
   
  return {
      group:group,
      currentUser:currentUser,
      surveyCompleted:surveyCompleted,
      selfRankCompleted:selfRankCompleted,
      isGroupMember:isGroupMember,
      dataReady:dataReady,
  };
})(QuizRankPage);
