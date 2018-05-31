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

import Typeform from '/imports/ui/pages/survey/Typeform';

class QuizRankWait extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ready:false,
            waitForOthers: false,
            everyoneReady: false
        };
    }

    confirmReadiness(){
        this.setState({
            ready: true,
        });

        Meteor.call( 'set.readiness', this.props.group._id,this.props.feedbackRank._id, (error, result)=>{
            if(error){
              console.log(error)
            }else{
              console.log("ready")
            }
          });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.dataReady){
            if(this.props.feedbackRank && nextProps.feedbackRank && this.props.feedbackRank._id != nextProps.feedbackRank._id){
                this.setState({
                    ready: false,
                });
            }else if(nextProps.feedbackRank && nextProps.feedbackRank.isSelected){
                this.setState({
                    ready: true,
                });
            }

            if(nextProps.otherFeedbackRanksReady && nextProps.otherFeedbackRanksReady.length == nextProps.group.emails.length){
                this.setState({
                    everyoneReady: true,
                });
            }
        }
    }
    

    render() {
        if(this.props.dataReady){
            console.log(Meteor.userId());
            if(this.props.targetedForOthersFeedback){
                return(
                    <div>
                        <h1>Please standby, the others are evaluating your personalities</h1>
                    </div>
                )
            }else{
                var ready = this.props.feedbackRank.isSelected;
                var everyoneReady = (this.props.otherFeedbackRanksReady && this.props.otherFeedbackRanksReady.length == (this.props.group.emails.length - 1));
                if(this.props.group.emails.length == this.props.group.emailsSelfRankCompleted.length){
                    if(ready && everyoneReady){
                        return (
                            <QuizRankOther user={this.props.currentUser} group={this.props.group}/>
                        );
                    }
                    else{
                        return (
                            <div>
                                {ready && 
                                !(everyoneReady) &&
                                    <div>
                                        <h1>waiting for others to click ready</h1>
                                    </div>
                                }

                                {!ready &&
                                    <div>
                                    <h1>press ready to proceed</h1>
                                    <a onClick={this.confirmReadiness.bind(this)}>Ready</a>
                                    </div>
                                } 
                            </div>
                        )
                    }
                
                }else{
                    return (
                        <h1>please wait for others to finish ranking themself</h1>
                    );
                }
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
    var users;
    var groupId;
    var feedbackRank;
    var otherFeedbackRanksReady;
    var targetedForOthersFeedback = false;

    if(props.user && props.user.profile.selfRank){
        groupId = props.user.profile.selfRank;
        currentUser = props.user;
    }else if(props.group){
        groupId = props.group._id;
        currentUser = Meteor.user();
    }

    var handleGroup = Meteor.subscribe('group',{_id:groupId},{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    if(handleGroup.ready()){
        group = Group.findOne({_id:groupId});

        var handleFeedbackRank = Meteor.subscribe('feedbackRank',
        {groupId:props.group._id,rank:{$exists: false}},
        {sort: { "createdAt": 1 }}, {
            onError: function (error) {
                    console.log(error);
            }
        });

        if(handleFeedbackRank.ready()){
            if(group){
                var allAvailableFeedbackRank = FeedbackRank.find(
                    {groupId:props.group._id,rank:{$exists: false}
                },
                {sort: { "createdAt": 1 }}
                ).fetch();

                var uniqueOrder = [...new Set(allAvailableFeedbackRank.map(fbr => fbr.to))];
                
                console.log(uniqueOrder);

                if(uniqueOrder[0] == Meteor.userId()){
                    feedbackRank = undefined;
                    targetedForOthersFeedback = true;
                }
                else{
                    feedbackRank = FeedbackRank.findOne(
                        {groupId:props.group._id,from:Meteor.userId(),to:uniqueOrder[0],rank:{$exists: false}
                    });
                    targetedForOthersFeedback = false;
                }

                otherFeedbackRanksReady = FeedbackRank.find(
                    {groupId:props.group._id,rank:{$exists: false},isSelected:true
                }).fetch();

                currentUser = Meteor.user();
                dataReady = true;
            }
        }
    }
  return {
      users:users,
      group:group,
      otherFeedbackRanksReady:otherFeedbackRanksReady,
      feedbackRank:feedbackRank,
      targetedForOthersFeedback:targetedForOthersFeedback,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizRankWait);
