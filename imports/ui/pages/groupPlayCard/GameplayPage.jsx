import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import WelcomePage from './WelcomePage';

import {PlayCard} from '/collections/playCard';
import PersonTurnPage from './PersonTurnPage';

import Loading from '../loading/Loading';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

class GameplayPage extends React.Component {
    constructor(props){
        super(props);
    }

    finishPlayCardSelf(){
        Meteor.call( 'play.card.self.finish.discussion', this.props.group._id, ( error, response ) => {
            if ( error ) {
                console.log(error);
            }
        });
    }

    nextRound(){
        Meteor.call( 'play.card.next.round', this.props.group._id,(error, result)=>{
            if(error){
              console.log(error)
            }
        });
    }

    render() {
        if(this.props.dataReady){
            if(this.props.cardChosenBySelfDoneCount < this.props.group.userIds.length){
                return(
                    <div className="tap-content-wrapper play-card">
                        <React.Fragment>
                        <WelcomePage groupType={this.props.groupType} selectedCardType={this.props.selectedCardType} inGameplay={true}/>
                        <div className="button-action-person-turn">
                            <div className="font-rate f-bttn play-card wait w-inline-block noselect">
                                <T>weq.gamePlayPage.WaitingForResult</T>
                            </div>
                        </div>
                        <div className="play-card-counter-wrapper">
                            <div className="play-card-counter">{this.props.cardChosenBySelfDoneCount}/{this.props.group.userIds.length}</div>
                        </div>
                        </React.Fragment>
                    </div>
                );
            }
            else if(this.props.cardChosenBySelfDoneCount == this.props.group.userIds.length && 
                this.props.cardChosenBySelfDiscussionFinished < this.props.group.userIds.length){
                return(
                    <div className="tap-content-wrapper play-card">
                        <React.Fragment>
                            <WelcomePage groupType={this.props.groupType} selectedCardType={this.props.selectedCardType} inGameplay={true}/>
                            <div className="button-action-person-turn">
                                <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.finishPlayCardSelf.bind(this)}>
                                    <T>weq.gamePlayPage.Next</T>
                                </div>
                            </div>
                            <div className="play-card-counter-wrapper">
                                <div className="play-card-counter">{this.props.cardChosenBySelfDoneCount}/{this.props.group.userIds.length}</div>
                            </div>
                        </React.Fragment>
                    </div>
                );
            }
            else if(this.props.chooseCardForOtherOwner){
                return(
                    <div className="tap-content-wrapper play-card">
                        <PersonTurnPage
                            playCardType={this.props.group.playCardTypeActive}
                            groupId={this.props.group._id}
                            groupType={this.props.group.groupType}
                            chooseCardForOtherOwner={this.props.chooseCardForOtherOwner}
                            cardChosenByOtherDoneCount={this.props.cardChosenByOtherDoneCount}
                            totalUser={this.props.group.userIds.length}
                            result={this.props.selectedUserCardResult}
                        />
                    </div>
                );
            }else if(this.props.cardChosenBySelfDoneCount == this.props.group.userIds.length && !this.props.chooseCardForOtherOwner){
                let nextRoundAvailable = this.props.group && this.props.group.playCardTypeList && this.props.group.playCardTypeList.length > 0 &&
                (!this.props.group.playCardTypeCompleted || 
                    (this.props.group.playCardTypeCompleted && this.props.group.playCardTypeCompleted.length < this.props.group.playCardTypeList.length)
                );
    
                return(
                    <div className="tap-content-wrapper play-card-finish">
                        <React.Fragment>
                            <div className="play-card-page-title"><T>weq.gamePlayPage.InstructionTitle</T></div>
                            <div className="play-card-page-subtitle"><T>weq.gamePlayPage.InstructionSubTitle</T></div>
    
                            <ul className="play-card-page-list">
                                <li><span><T>weq.gamePlayPage.InstructionLine1</T></span></li>
                                {nextRoundAvailable
                                    &&
                                    <li><span><T>weq.gamePlayPage.InstructionLine2</T></span></li>
                                }
                            </ul>
                            {nextRoundAvailable
                                &&
                                <div className="button-action-person-turn">
                                    <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" 
                                    onClick={this.nextRound.bind(this)}>
                                        <T>weq.gamePlayPage.NextRound</T>
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    </div>
                );
            }
        }else{
            return(
                <Loading/>
            )
        }
    }
}

export default withTracker((props) => {
    let dataReady;
    let cardChosenBySelfDiscussionFinished=0;
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
                "playCardType":props.group.playCardTypeActive
            },{sort: { "createdAt": 1 }}
        ).fetch();

        cardsInPlay.forEach((cardInPlay)=>{
            if(cardInPlay.from == cardInPlay.to && cardInPlay.cardChosen){
                cardChosenBySelfDoneCount += 1;

                if(cardInPlay.discussionFinished){
                    cardChosenBySelfDiscussionFinished += 1;
                }
            }

            //get data for turn taking
            if(cardInPlay.from != cardInPlay.to && !cardInPlay.discussionFinished){
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
        dataReady = true;
    }

    return {
        cardChosenBySelfDiscussionFinished:cardChosenBySelfDiscussionFinished,
        cardChosenBySelfDoneCount:cardChosenBySelfDoneCount,
        cardChosenByOtherDoneCount:cardChosenByOtherDoneCount,
        chooseCardForOtherOwner:chooseCardForOtherOwner,
        selectedUserCardResult:selectedUserCardResult,
        dataReady:dataReady
    };
  })(GameplayPage);
