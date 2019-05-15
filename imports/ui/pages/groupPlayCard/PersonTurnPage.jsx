import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import {PlayCard} from '/collections/playCard';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

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

    renderInstruction(playCardType, personName){
        if(playCardType == "praise"){
            return (
                <div>
                    <ul>
                        <li><b>{personName}</b>: read cards 3 and 4 out loud</li>
                        <li>everyone in group will choose which card is more applicable to {personName}</li>
                    </ul>
                    <img src={'/img/playCard/instruction-praise.jpg'}/>
                </div>
            );
        }else if(playCardType == "criticism"){
            return(
                <div>
                    <ul>
                        <li><b>{personName}</b>: read cards 5, 6, and 7 out loud</li>
                        <li>everyone in group will choose which card is more applicable to <b>{personName}</b></li>
                    </ul>
                    <img src={'/img/playCard/instruction-criticism.jpg'}/>
                </div>
            );
        }
    }

    renderResult(){
        let targetPlayCard = this.props.targetPlayCard;
        if(targetPlayCard && targetPlayCard.cardsToChoose){
            return targetPlayCard.cardsToChoose.map((card)=>{
                var resultFiltered = this.props.result.filter((res)=>{
                    return res.cardChosen && res.cardChosen[0] && res.cardChosen[0].cardId == card.cardId;
                });

                var gradeList=[];

                let userIdList = resultFiltered.map((res)=>{
                    gradeList.push(res.grade);
                    return res.from;
                });

                let highlight = this.state.showTargetAnswer && targetPlayCard 
                && targetPlayCard.cardChosen && targetPlayCard.cardChosen[0]
                && targetPlayCard.cardChosen[0].cardId == card.cardId;

                return (
                    <div className={`play-card-list-container ${highlight ? "highlight" : ""}`} key={`card-${card.cardId}`}>
                        <h1>{card.cardId}</h1>
                        <div>
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
            return (
                <div key={`user-${cardId}-${index}`}>
                    {grade &&
                        <div className="play-card-list-user-grade">
                            <img src={`/img/playCard/smile-${grade}.png`}/>
                        </div>
                        
                    }
                    
                    {this.props.resultUserNames[userId]}
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
                        <h1>Result</h1>
                        <ul>
                            <li><b>{personName}</b>: Ask 2 people to explain their choice, and mostly listen to the feedback. <b>{personName}</b> may ask followup questions</li>
                        </ul>
                        <div className={"play-card-list-result-row"}>
                            {this.renderResult()}
                        </div>
                        
                        <div className="div-block-center">
                            {this.state.showTargetAnswer 
                            ?
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.finishDiscussion.bind(this)}>
                                Finish discussion
                            </div>
                            :
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.showTargetAnswer.bind(this)}>
                                Finish discussion
                            </div>
                            }
                            
                        </div>
                    </React.Fragment>
                );
            }else{
                return(
                    <React.Fragment>
                        <h1>Now it's {personName}'s turn</h1>
                        {this.renderInstruction(playCardType, personName)}

                        <div className="div-block-center">
                            {this.props.cardChosenByOtherDoneCount == this.props.totalUser-1 &&
                                <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.showResult.bind(this)}>
                                    Reveal Result
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
                <h1>loading</h1>
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
    let personName = (firstName ? firstName : "")+(lastName ? lastName : "");
    let targetPlayCard;

    if(props.result && props.result.length > 0){
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
                    let personName = (firstName ? firstName : "")+(lastName ? lastName : "");
                    resultUserNames[user._id] = personName;
                })
            }
            dataReady = true;
        }
    }else{
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
