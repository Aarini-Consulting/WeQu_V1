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
            feedbackRank: undefined,
        };
    }

    confirmReadiness(){
        Meteor.call( 'set.readiness', this.props.group._id,this.props.feedbackRank._id, (error, result)=>{
            if(error){
              console.log(error)
            }
          });
    }

    // componentWillReceiveProps(nextProps){
    //     if(nextProps.dataReady){
    //         if(nextProps.feedbackRank){
    //             if(){
    //                 //do nothing because waiting for others
    //             }else{
    //                 this.setState({
    //                     feedbackRank: nextProps.feedbackRank,
    //                 });
    //             }
    //         }
    //     }
        
    // }

    render() {
        if(this.props.dataReady){
            if(this.props.targetedForOthersFeedback){
                return(
                    <div className="fillHeight weq-bg">
                        <div className="font-rate">Sit back and relax, the others are evaluating you</div>
                        <div className="font-rate">{this.props.otherFeedbackRanksGiven.length}/{this.props.group.emails.length-1}</div>
                    </div>
                )
            }else if(this.props.feedbackRank){
                var ready = this.props.feedbackRank.isSelected;
                var everyoneReady = (this.props.otherFeedbackRanksReady && this.props.otherFeedbackRanksReady.length == (this.props.group.emails.length - 1));
                if(this.props.group.emails.length == this.props.group.emailsSelfRankCompleted.length){
                    // if((!ready && this.props.waitForOthersFeedback)){
                    //     return (
                    //     <div>
                    //         <h1>Please wait other user completes their feedback</h1>
                    //         <h1>{this.props.otherFeedbackRanksGiven.length}/{this.props.group.emails.length-1}</h1>
                    //     </div>
                    //     );
                    // }
                    if((ready && everyoneReady) 
                    // || this.props.otherFeedbackRanksGiven.length < this.props.group.emails.length-1
                    ){
                        return (
                            <QuizRankOther user={this.props.currentUser} group={this.props.group} feedbackRank={this.props.feedbackRank}/>
                        );
                    }
                    else{
                        if(ready && !(everyoneReady)){
                            return(
                                <div className="fillHeight weq-bg">
                                    <div className="font-rate">Waiting for others to be ready</div>
                                    <div className="font-rate">{this.props.otherFeedbackRanksReady.length}/{this.props.group.emails.length-1}</div>
                                </div>
                            )
                        }

                        if(!ready){
                            var firstName = this.props.quizUser && this.props.quizUser.profile.firstName;
                            var lastName = this.props.quizUser && this.props.quizUser.profile.lastName;
                            return(
                                <div className="fillHeight weq-bg">
                                    <div className="font-rate">The whole team will now rank:</div>
                                    <br/>
                                    <div className="font-rate">
                                    {firstName+ " " + lastName}
                                    </div>
                                    <br/>
                                    <div className="font-rate">You will have 60 seconds</div>
                                    <br/>
                                    <div className="font-rate">Sit back and relax {this.props.quizUser && this.props.quizUser.profile.firstName}</div>
                                    <br/>
                                    <div className="w-block cursor-pointer">
                                        <div className="font-rate f-bttn w-inline-block noselect" onClick={this.confirmReadiness.bind(this)}>
                                            Proceed
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    }
                }else{
                    return (
                        <div className="fillHeight weq-bg">
                            <div className="font-rate">
                            All done! 
                            Please wait until everyone in the group completes their self-ranking...
                            </div>
                        </div>
                    );
                }
            }
            else{
                if (this.props.waitForOthersFeedback){
                    return(
                        <div className="fillHeight weq-bg">
                            <div className="font-rate">Waiting for others to be ready</div>
                            <div className="font-rate">{this.props.otherFeedbackRanksGiven.length}/{this.props.group.emails.length-1}</div>
                        </div>
                    )
                    
                }else{
                    return false;
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
    var otherFeedbackRanksGiven;
    var targetedForOthersFeedback = false;
    var waitForOthersFeedback;
    var previousFeedback;
    var quizUser;

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
        {groupId:group._id},
        {
            onError: function (error) {
                    console.log(error);
            }
        });

        if(handleFeedbackRank.ready()){
            if(group){
                var allAvailableFeedbackRank = FeedbackRank.find(
                    {groupId:group._id,rank:{$exists: false}
                },
                {sort: { "createdAt": 1 }}
                ).fetch();

                var uniqueQuizTargetOrder = [...new Set(allAvailableFeedbackRank.map(fbr => fbr.to))];

                previousFeedback = FeedbackRank.findOne(
                    {groupId:group._id,from:Meteor.userId(),to:{$ne:Meteor.userId()},isSelected:true
                },
                {sort: { "updatedAt": -1 }}
                );

                if(!previousFeedback || (previousFeedback && previousFeedback.rank)){
                    //no previous feedback or previous feedback is completed
                    if(uniqueQuizTargetOrder[0] == Meteor.userId()){
                        feedbackRank = undefined;
                        targetedForOthersFeedback = true;
                    }
                    else{
                        feedbackRank = FeedbackRank.findOne(
                            {groupId:group._id,from:Meteor.userId(),to:uniqueQuizTargetOrder[0],rank:{$exists: false}
                        });
                        targetedForOthersFeedback = false;
                    }
                    otherFeedbackRanksGiven = FeedbackRank.find(
                        {groupId:group._id,to:uniqueQuizTargetOrder[0], rank:{$exists: true},isSelected:true
                    }).fetch();

                    otherFeedbackRanksReady = FeedbackRank.find(
                        {groupId:group._id,to:uniqueQuizTargetOrder[0],isSelected:true
                    }).fetch();

                    quizUser = Meteor.users.findOne(uniqueQuizTargetOrder[0]);

                }else{
                    //previous feedback is incomplete
                    feedbackRank = FeedbackRank.findOne(
                        {groupId:group._id,from:Meteor.userId(),to:previousFeedback.to,rank:{$exists: false}
                    });
                    targetedForOthersFeedback = false;
                    otherFeedbackRanksGiven = FeedbackRank.find(
                        {groupId:group._id,to:previousFeedback.to, rank:{$exists: true},isSelected:true
                    }).fetch();
    
                    otherFeedbackRanksReady = FeedbackRank.find(
                        {groupId:group._id,to:previousFeedback.to,isSelected:true
                    }).fetch();

                    quizUser = Meteor.users.findOne(previousFeedback.to);

                }

                waitForOthersFeedback = !feedbackRank && (otherFeedbackRanksGiven.length >= 1) && (otherFeedbackRanksGiven.length < (group.emails.length-1));

                currentUser = Meteor.user();
                dataReady = true;
            }
        }
    }
  return {
      quizUser:quizUser,
      users:users,
      group:group,
      otherFeedbackRanksReady:otherFeedbackRanksReady,
      otherFeedbackRanksGiven:otherFeedbackRanksGiven,
      feedbackRank:feedbackRank,
      targetedForOthersFeedback:targetedForOthersFeedback,
      waitForOthersFeedback:waitForOthersFeedback,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizRankWait);
