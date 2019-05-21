import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import WelcomePage from './WelcomePage';

import {PlayCard} from '/collections/playCard';
import PersonTurnPage from './PersonTurnPage';

class GameplayPage extends React.Component {
    constructor(props){
        super(props);
    }

    nextRound(){
        Meteor.call( 'play.card.next.round', this.props.group._id,(error, result)=>{
            if(error){
              console.log(error)
            }
        });
    }

    render() {
        if(this.props.cardChosenBySelfDoneCount < this.props.group.userIds.length){
            return(
                <React.Fragment>
                    <WelcomePage groupType={this.props.groupType} inGameplay={true}/>
                    <div className="play-card-counter-wrapper">
                        <div className="play-card-counter">{this.props.cardChosenBySelfDoneCount}/{this.props.group.userIds.length}</div>
                    </div>
                </React.Fragment>
            );
        }else if(this.props.chooseCardForOtherOwner){
            return(
                <PersonTurnPage 
                playCardType={this.props.group.playCardTypeActive}
                groupId={this.props.group._id}
                chooseCardForOtherOwner={this.props.chooseCardForOtherOwner}
                cardChosenByOtherDoneCount={this.props.cardChosenByOtherDoneCount}
                totalUser={this.props.group.userIds.length}
                result={this.props.selectedUserCardResult}
                />
            );
        }else if(this.props.cardChosenBySelfDoneCount == this.props.group.userIds.length && !this.props.chooseCardForOtherOwner){
            let nextRoundAvailable = this.props.group && this.props.group.playCardTypeList && this.props.group.playCardTypeList.length > 0 &&
            (!this.props.group.playCardTypeCompleted || 
                (this.props.group.playCardTypeCompleted && this.props.group.playCardTypeCompleted.length < this.props.group.playCardTypeList.length)
            );

            return(
                <React.Fragment>
                    <h1>Hurray!</h1>
                    You completed the round!

                    <ul>
                        <li>Go to quiz section to reflect on your feedback experience</li>
                        {nextRoundAvailable
                            &&
                            <li>Once you're done with the quizzes, you may continue the next round</li>
                        }
                    </ul>
                    {nextRoundAvailable
                        &&
                        <div className="div-block-center">
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.nextRound.bind(this)}>
                                Next round
                            </div>
                        </div>
                    }
                </React.Fragment>
            );
        }
    }
}

export default withTracker((props) => {
    let dataReady;
    let cardChosenBySelfDoneCount=0;
    let cardChosenByOtherDoneCount=0;
    let turnTakingOrderUserIds = [];
    let turnTakingOrderCards = [];
    let selectedUserCardResult=[];
    let chooseCardForOtherOwner;

    let handlePlayCard = Meteor.subscribe('playCard',
        {
            "groupId":props.group._id,
            "playCardType":props.group.playCardTypeActive
        },{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    if(handlePlayCard.ready()){
        let cardsInPlay = PlayCard.find(
            { 
                "groupId":props.group._id,
                "playCardType":props.group.playCardTypeActive,
                'discussionFinished':{$exists: false}
            },{sort: { "createdAt": 1 }}
        ).fetch();

        cardsInPlay.forEach((cardInPlay)=>{
            if(cardInPlay.from == cardInPlay.to && cardInPlay.cardChosen){
                cardChosenBySelfDoneCount += 1;
            }

            //get data for turn taking
            if(cardInPlay.from != cardInPlay.to){
                turnTakingOrderUserIds.push(cardInPlay.to);
                turnTakingOrderCards.push(cardInPlay);
            }
        });

        //remove duplicate from turn takin array
        turnTakingOrderUserIds = [...new Set(turnTakingOrderUserIds)];

        //self choosing is done
        if(cardChosenBySelfDoneCount == props.group.userIds.length){
            //select other user to be evaluated
            if(turnTakingOrderUserIds.length > 0){
                chooseCardForOtherOwner = Meteor.users.findOne(turnTakingOrderUserIds[0]);

                selectedUserCardResult = turnTakingOrderCards.filter((card)=>{
                    return card.to == turnTakingOrderUserIds[0] && card.cardChosen;
                });

                cardChosenByOtherDoneCount = selectedUserCardResult.length;
            }else{
                Meteor.call('play.card.check.completed', props.group._id,props.group.playCardTypeActive);
            }
        }
        dataReady = true
    }

    return {
        cardChosenBySelfDoneCount:cardChosenBySelfDoneCount,
        cardChosenByOtherDoneCount:cardChosenByOtherDoneCount,
        chooseCardForOtherOwner:chooseCardForOtherOwner,
        selectedUserCardResult:selectedUserCardResult,
        dataReady:dataReady
    };
  })(GameplayPage);
