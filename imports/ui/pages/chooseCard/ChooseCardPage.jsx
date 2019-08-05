import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import Loading from '/imports/ui/pages/loading/Loading';
import SessionWait from '/imports/ui/pages/quizClient/SessionWait';

import {PlayCard} from '/collections/playCard';

import ChooseCard from './ChooseCard';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

class ChooseCardPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          selectedCard:undefined,
          selectedCardConfirmed:false,
        }
    }

    selectCard(card){
        this.setState({
            selectedCard:card
        });
    }

    confirmCardSelected(){
        this.setState({
            selectedCardConfirmed:true
        });
    }

    renderCardToChoose(cardsToChoose){
        return cardsToChoose.map((card)=>{
            return(
                <div className="w-inline-block" key={card.cardId}>
                    <button onClick={this.selectCard.bind(this,card)}>{card.subCategory}</button>
                </div>
            );
        });
    }

    render() {
        if(this.props.dataReady){
            let selfRankDone = this.props.cardChosenSelfGroupDoneCount == this.props.group.userIds.length;
            let selfRankFinished = selfRankDone && this.props.cardChosenBySelfDiscussionFinishedCount == this.props.group.userIds.length;

            if(this.props.cardChosenSelfGroupDoneCount < this.props.group.userIds.length ){
                //do self rank
                if(this.props.cardChosenBySelf && !this.props.cardChosenBySelf.cardChosen){
                    return(
                        <ChooseCard group={this.props.group} selectedPlayCard={this.props.cardChosenBySelf} forSelf={true}/>
                    );
                }else if(this.props.cardChosenSelfGroupDoneCount > 0){
                    return(
                        <div className="fillHeight weq-bg">
                            <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingLine1</T></div>
                            <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingLine2</T></div>
                            <div className="font-rate padding-wrapper">{(this.props.cardChosenSelfGroupDoneCount)}/{(this.props.group.userIds.length)}</div>
                        </div>
                    );
                }else{
                    return(
                        <section className="ranker-container fontreleway purple-bg">
                            <Loading/>
                        </section>
                    );
                }
            }else if(selfRankDone){
                //do turn taking
                if(selfRankFinished && this.props.chooseCardForOther){
                    if(!this.props.chooseCardForOther.cardChosen){
                        return(
                            <ChooseCard 
                            group={this.props.group} 
                            selectedPlayCard={this.props.chooseCardForOther} 
                            selectedPlayCardOwner={this.props.chooseCardForOtherOwner}
                            forSelf={false} 
                            />
                        );
                    }else if(this.props.chooseCardForOtherGroupDoneCount < this.props.group.userIds.length-1 ){
                        if(this.props.chooseCardForOtherGroupDoneCount > 0){
                            return(
                                <div className="fillHeight weq-bg">
                                    <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingLine1</T></div>
                                    <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingLine2</T></div>
                                    <div className="font-rate padding-wrapper">{(this.props.chooseCardForOtherGroupDoneCount)}/{(this.props.group.userIds.length-1)}</div>
                                </div>
                            );
                        }else{
                            <section className="ranker-container fontreleway purple-bg">
                                <Loading/>
                            </section>
                        }
                        
                    }else{
                        return(
                            <div className="fillHeight weq-bg">
                                <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.PleaseWaitNextTurn</T></div>
                            </div>
                        );
                    }
                }else if(selfRankFinished && this.props.targetedForOthersFeedback){
                    if(this.props.cardChosenByOtherGroupDoneCount < this.props.group.userIds.length-1){
                        var firstName = this.props.currentUser && this.props.currentUser.profile.firstName;
                        return(
                            <div className="fillHeight weq-bg">
                                {firstName &&
                                    <div className="font-rate padding-wrapper">Hi <b>{firstName}</b>,</div>
                                }
                                <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingForYouLine1</T></div>
                                <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.OthersSelectingForYouLine2</T></div>
                                <div className="font-rate padding-wrapper">{(this.props.cardChosenByOtherGroupDoneCount)}/{(this.props.group.userIds.length-1)}</div>
                            </div>
                        );
                    }else{
                        return(
                            <div className="fillHeight weq-bg">
                                <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.EveryoneHasPickedForYouLine1</T></div>
                                <div className="font-rate padding-wrapper"><T>weq.chooseCardPlace.EveryoneHasPickedForYouLine2</T></div>
                            </div>
                        );
                    }
                }
                else{
                    return(
                        <SessionWait/>
                    )
                }
                
            }
        }else{
            return(
                <section className="ranker-container fontreleway purple-bg">
                    <Loading/>
                </section>
            );
        }
    }
}

export default withTracker((props) => {
    let dataReady;
    let cardChosenBySelf;
    let chooseCardForOther;
    let chooseCardForOtherOwner;
    let targetedForOthersFeedback=false;
    let cardChosenSelfGroupDoneCount = 0;
    let cardChosenBySelfDiscussionFinishedCount=0;
    let chooseCardForOtherGroupDoneCount = 0;
    let cardChosenByOtherGroupDoneCount = 0;
    let userId = Meteor.userId();
    let currentUser = Meteor.user();

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
        let allPlayCards = PlayCard.find(
            {
            "groupId":props.group._id,
            "playCardType":props.group.playCardTypeActive,
            },
            {sort: { "createdAt": 1 }
        }).fetch();

        let turnTakingOrderUserIds = [];
        let turnTakingCardTarget={};

        //get last playCard object that current user finished with "card choosing"
        var lastOtherPlayCardSelected = PlayCard.findOne(
            {"groupId":props.group._id,
            "from":Meteor.userId(),
            "to":{$ne:Meteor.userId()},
            "cardChosen":{$exists: true},
            'discussionFinished':{$exists: false}
        },
        {sort: { "updatedAt": -1 }}
        );

        allPlayCards.forEach((playCard)=>{
            //get card set for yourself
            if(playCard.from == userId && playCard.to == userId){
                cardChosenBySelf = playCard;
            }

            //calculate how many users in the same group are done with their own card set
            if(playCard.from == playCard.to && playCard.cardChosen){
                cardChosenSelfGroupDoneCount += 1;
                if(playCard.discussionFinished){
                    cardChosenBySelfDiscussionFinishedCount += 1;
                }
            }

            
            if(playCard.from != userId && playCard.to == userId && playCard.cardChosen && !playCard.discussionFinished){
                cardChosenByOtherGroupDoneCount += 1;
            }

            //on the last playcard object that user finished with "card choosing"
            //calculate how many users in the same group are also done with "card choosing" 
            //for the same user that the last playcard object points to
            if(lastOtherPlayCardSelected && 
                lastOtherPlayCardSelected.to != lastOtherPlayCardSelected.from && 
                lastOtherPlayCardSelected.to == playCard.to && 
                playCard.cardChosen && 
                !playCard.discussionFinished){
                chooseCardForOtherGroupDoneCount +=1;
            }

            //get data for turn taking
            if(playCard.from != playCard.to && !playCard.discussionFinished){
                turnTakingOrderUserIds.push(playCard.to);
                if(playCard.from == userId){
                    turnTakingCardTarget[playCard.to] = playCard;
                }
            }
        });

        //remove duplicate from turn takin array
        turnTakingOrderUserIds = [...new Set(turnTakingOrderUserIds)];

        //self choosing is done
        if(cardChosenSelfGroupDoneCount == props.group.userIds.length){
            //select other user to be evaluated
            if(turnTakingOrderUserIds.length > 0){
                //don't select user unless discussionFinished is true or no user is ever selected before
                if(!lastOtherPlayCardSelected || (lastOtherPlayCardSelected && lastOtherPlayCardSelected.discussionFinished)){
                    if(turnTakingOrderUserIds[0] == userId){
                        chooseCardForOther = undefined;
                        targetedForOthersFeedback = true;
                    }else{
                        chooseCardForOther = turnTakingCardTarget[turnTakingOrderUserIds[0]];
                        if(chooseCardForOther){
                            chooseCardForOtherOwner = Meteor.users.findOne(chooseCardForOther.to);
                        }
                    }
                }else if(lastOtherPlayCardSelected){
                    chooseCardForOther = lastOtherPlayCardSelected;
                    if(chooseCardForOther){
                        chooseCardForOtherOwner = Meteor.users.findOne(lastOtherPlayCardSelected.to);
                    }
                }
            }
        }
        dataReady = true;
    }

    return {
        currentUser:currentUser,
        cardChosenBySelf:cardChosenBySelf,
        cardChosenBySelfDiscussionFinishedCount:cardChosenBySelfDiscussionFinishedCount,
        cardChosenSelfGroupDoneCount:cardChosenSelfGroupDoneCount,
        cardChosenByOtherGroupDoneCount:cardChosenByOtherGroupDoneCount,
        chooseCardForOther:chooseCardForOther,
        chooseCardForOtherOwner:chooseCardForOtherOwner,
        chooseCardForOtherGroupDoneCount:chooseCardForOtherGroupDoneCount,
        targetedForOthersFeedback:targetedForOthersFeedback,
        dataReady:dataReady
    };
})(ChooseCardPage);
