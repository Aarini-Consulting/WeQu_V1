import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import {PlayCard} from '/collections/playCard';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

import Loading from '../loading/Loading';

import {groupTypeIsShort,groupTypeShortList} from '/imports/helper/groupTypeShort.js';

class PersonTurnPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showResult: false,
            showTargetAnswer: false,
            loading:false
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.chooseCardForOtherOwner && prevProps.chooseCardForOtherOwner && this.props.chooseCardForOtherOwner._id != prevProps.chooseCardForOtherOwner._id){
            this.setState(
                {showResult:false,
                showTargetAnswer:false
                }
            );
        }
    }

    showResult(){
        this.setState(
            {showResult:true}
        );
    }

    showTargetAnswer(){
        this.setState(
            {showTargetAnswer:true}
        );
    }

    finishDiscussion(){
        if(!this.state.loading){
            this.setState(
                {loading:true}, ()=>{
                    Meteor.call( 'play.card.finish.discussion', this.props.groupId, this.props.playCardType, this.props.chooseCardForOtherOwner._id, ( error, response ) => {
                        if ( error ) {
                            console.log(error);
                        }

                        this.setState(
                            {loading:false}
                        );
                    });
                }
            );
        }
    }

    renderInstructionCard(){
        let targetPlayCard = this.props.targetPlayCard;
        if(targetPlayCard && targetPlayCard.cardsToChoose){
            return targetPlayCard.cardsToChoose.map((card)=>{
                let languageCode = i18n.getLocale().split("-")[0];
                let languageCodeComplete = i18n.getLocale();
                let backgroundUrl
                if (languageCode == 'es') {
                    backgroundUrl = `https://s3-eu-west-1.amazonaws.com/wequ/cards/${languageCodeComplete}/card(${card.cardId}).png`;
                }else{
                    backgroundUrl = `https://s3-eu-west-1.amazonaws.com/wequ/cards/${languageCode}/card(${card.cardId}).png`;
                }
                return (
                    <div className={`play-card-list-container`} key={`card-${card.cardId}`}>
                        <img className={`play-card-display`} src={`${backgroundUrl}`}/>
                    </div>
                );
            });
        }else{
            return(
                <h1>nodata</h1>
            );
        }
    }

    renderInstruction(playCardType, groupType, personName){
            let criticismText = "weq.personTurnPage.InstructionCriticismLine1v1";

            if(groupType === groupTypeShortList[2]){
                criticismText = "weq.personTurnPage.InstructionCriticismLine1v2";
            }

            if(playCardType == "praise"){
                return (
                    <div>
                        <ul className="play-card-page-list">
                            <li><span><b>{personName}</b> <T>weq.personTurnPage.InstructionPraiseLine1</T></span></li>
                            <li><span><T>weq.personTurnPage.InstructionPraiseLine2</T> {personName} <T>weq.personTurnPage.InstructionPraiseLine2P2</T></span></li>
                        </ul>
                        <div className="div-block-center">
                            <div className={"play-card-list-result-row"}>
                                {this.renderInstructionCard()}
                            </div>
                        </div>
                    </div>
                );
            }else if(playCardType == "criticism"){
                return(
                    <div>
                        <ul className="play-card-page-list">
                            <li><span><b>{personName}</b>: {i18n.getTranslation(criticismText)}.</span></li>
                            <li><span><T>weq.personTurnPage.InstructionCriticismLine2</T> <b>{personName}</b> <T>weq.personTurnPage.InstructionCriticismLine2P2</T></span></li>
                        </ul>
                        <div className="div-block-center">
                            <div className={"play-card-list-result-row"}>
                                {this.renderInstructionCard()}
                            </div>
                        </div>
                    </div>
                );
            }
    }

    renderResult(){
        let targetPlayCard = this.props.targetPlayCard;
        if(targetPlayCard && targetPlayCard.cardsToChoose){
            return targetPlayCard.cardsToChoose.map((card)=>{
                let resultFiltered = this.props.result.filter((res)=>{
                    return res.cardChosen && res.cardChosen[0] && res.cardChosen[0].cardId == card.cardId;
                });

                let gradeList=[];

                let highlight = this.state.showTargetAnswer && targetPlayCard 
                && targetPlayCard.cardChosen && targetPlayCard.cardChosen[0]
                && targetPlayCard.cardChosen[0].cardId == card.cardId;

                if(highlight){
                    //when result is revealed, put target playcard in the list of result
                    resultFiltered.push(targetPlayCard);
                }

                //sort the data descending based on its grade
                resultFiltered.sort((a, b) => {
                    return b.grade - a.grade;
                });

                let userIdList = resultFiltered.map((res)=>{
                    gradeList.push(res.grade);
                    return res.from;
                });

                let languageCode = i18n.getLocale().split("-")[0];
                let backgroundUrl = `https://s3-eu-west-1.amazonaws.com/wequ/cards/${languageCode}/card(${card.cardId}).png`;

                return (
                    <div className={`play-card-list-container ${highlight ? "highlight" : ""}`} key={`card-${card.cardId}`}>
                        <img className={`play-card-display ${highlight ? "highlight" : ""}`} src={`${backgroundUrl}`}/>
                        <div className="play-card-user-list">
                            {this.renderCardUserList(card.cardId, userIdList, gradeList)}
                        </div>
                    </div>
                );
            });
        }else{
            return(<h1>nodata</h1>);
        }
    }

    renderCardUserList(cardId, userIdList, gradeList){
        return userIdList.map((userId, index)=>{
            let grade = gradeList && gradeList[index] && Math.ceil(gradeList[index]*3);
            let targetPlayCard = this.props.targetPlayCard;

            let highlight = false;

            let username = this.props.resultUserNames[userId];

            if(userId == targetPlayCard.from && userId == targetPlayCard.to){
                highlight = true;
                username = this.props.personName;
            }

            return (
                <div className={`play-card-user-list-entry ${highlight ? "highlight" : ""}`} key={`user-${cardId}-${index}`}>
                    {grade &&
                        <div className="play-card-list-user-grade">
                            <img src={`/img/playCard/smile-${grade}.png`}/>
                        </div>   
                    }
                    <span>{username}</span>
                </div>
            );
        });
    }

    render() {
        if(this.props.dataReady && !this.state.loading){
            let playCardType = this.props.playCardType;
            let personName = this.props.personName;
            if(this.state.showResult){
                return(
                    <React.Fragment>
                        <div className="play-card-page-title"><T>weq.personTurnPage.InstructionResultTitle</T></div>
                        <ul className="play-card-page-list">
                            <li><span><b>{personName}</b> <T>weq.personTurnPage.InstructionResultLine1</T> <b>{personName}</b> <T>weq.personTurnPage.InstructionResultLine2</T></span></li>
                        </ul>
                        <div className={"play-card-list-result-row"}>
                            {this.renderResult()}
                        </div>
                        
                        <div className="button-action-person-turn">
                            {this.state.showTargetAnswer 
                            ?
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.finishDiscussion.bind(this)}>
                                <T>weq.personTurnPage.FinishDiscussion</T>
                            </div>
                            :
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.showTargetAnswer.bind(this)}>
                                <T>weq.personTurnPage.FinishDiscussion</T>
                            </div>
                            }
                            
                        </div>
                    </React.Fragment>
                );
            }else{
                return(
                    <React.Fragment>
                        <div className="play-card-page-title">Now it's {personName}'s turn</div>
                        {this.renderInstruction(playCardType, this.props.groupType, personName)}

                        <div className="button-action-person-turn">
                            {this.props.cardChosenByOtherDoneCount == (this.props.totalUser-1) 
                                ?
                                <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.showResult.bind(this)}>
                                    <T>weq.personTurnPage.RevealResult</T>
                                </div>
                                :
                                <div className="font-rate f-bttn play-card wait w-inline-block noselect">
                                    <T>weq.personTurnPage.WaitResult</T>
                                </div>
                            }
                        </div>
                        <div className="play-card-counter-wrapper">
                            <div className="play-card-counter">{this.props.cardChosenByOtherDoneCount}/{this.props.totalUser-1}</div>
                        </div>
                    </React.Fragment>
                );
            }
        }else{
            return(
                <React.Fragment>
                    <Loading/>
                </React.Fragment>
            )
        }
    }
}

export default withTracker((props) => {
    let dataReady;
    let resultUserData=[];
    let resultUserNames={};
    let firstName = props.chooseCardForOtherOwner.profile.firstName;
    let lastName = props.chooseCardForOtherOwner.profile.lastName;
    let personName = (firstName ? firstName : "")+" "+(lastName ? lastName : "");
    let targetPlayCard;

        let handlePlayCard = Meteor.subscribe('playCard',
            {
                "groupId":props.groupId,
                "playCardType":props.playCardType,
            },{}, {
            onError: function (error) {
                console.log(error);
            }
        });

        if(handlePlayCard.ready()){
            targetPlayCard = PlayCard.findOne({
                "groupId":props.groupId,
                "playCardType":props.playCardType,
                "from":props.chooseCardForOtherOwner._id,
                "to":props.chooseCardForOtherOwner._id,
            });

            let userIds = props.result.map((res)=>{
                return res.from;
            });

            resultUserData = Meteor.users.find({_id:{$in:userIds}}).fetch();

            if(resultUserData.length > 0){
                resultUserData.forEach((user)=>{
                    let firstName = user.profile.firstName;
                    let lastName = user.profile.lastName;
                    let personName = (firstName ? firstName : "")+" "+(lastName ? lastName : "");
                    resultUserNames[user._id] = personName;
                })
            }
            dataReady = true;
        }
  
    
    return {
        dataReady: dataReady,
        targetPlayCard:targetPlayCard,
        resultUserData:resultUserData,
        resultUserNames:resultUserNames,
        personName:personName,

    };
  })(PersonTurnPage);
