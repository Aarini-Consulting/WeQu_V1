import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import Loading from '/imports/ui/pages/loading/Loading';

import {groupTypeIsShort, groupTypeShortList} from '/imports/helper/groupTypeShort.js';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

export default class ChooseCard extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state={
            start: undefined,
            elapsed:0,
            selectedCard:undefined,
            showGrading:false,
            timeoutWarning:false,
            savingData:false
        }
    }

    resetState(){
        this.setState({
            start: undefined,
            elapsed:0,
            selectedCard:undefined,
            showGrading:false,
            timeoutWarning:false,
            savingData:false
        },()=>{
            this.setTimer(true);
        });
    }

    setTimer(bool){
        if(bool){
            this.setState({
                start: new Date(),
                elapsed: 0
            },()=>{
                this.timer = setInterval(this.tick.bind(this), 1000);
            });
        }else{
            clearInterval(this.timer);
        }
    }

    tick(){
        // This function is called every 1000 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        if(this.state.elapsed <= this.props.timerDuration){
            this.setState({elapsed: new Date() - this.state.start});
        }
        else{
            this.stepFinished();
        }
    }

    stepFinished(){
        this.setTimer(false);

        this.setState({
            timeoutWarning:true
        });
    }

    componentDidMount(){
        this.setTimer(true);
    }

    componentWillUnmount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:
        if(this.timer){
            this.setTimer(false);
        }
        
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedPlayCard && prevProps.selectedPlayCard._id && this.props.selectedPlayCard && this.props.selectedPlayCard._id != prevProps.selectedPlayCard._id) {
          this.resetState();
        }
      }

    selectCard(card){
        this.setState({
            selectedCard:card,
            showGrading:true
        });
    }

    submitAnswer(grade){
        Meteor.call( 'play.card.save.choice', this.props.group._id, this.props.selectedPlayCard._id, this.state.selectedCard, grade, (error, result)=>{
            if(error){
                console.log(error)
            }
        });
    }

    submitAction(grade){
        if(this.state.selectedCard){
            this.setTimer(false);

            this.setState({
                savingData:true
            },this.submitAnswer(grade));
        }
    }

    cancelAction(){
        this.setState({
            showGrading:false
        });
    }

    renderCardToChoose(cardsToChoose){
        var groupType = this.props.group.groupType;
        
        return cardsToChoose.map((card, index)=>{
            let selected=" ";

            var displayNumber=index;

            if(this.props.selectedPlayCard.playCardType == "praise"){
                displayNumber = index+3;
            }else if(this.props.selectedPlayCard.playCardType == "criticism"){
                //SHORT-CRITICSM ONLY
                if(groupTypeShortList[2] === groupType){
                    displayNumber = index+3;
                }else{
                    displayNumber = index+5;
                }
                
            }

            if(this.state.selectedCard && this.state.selectedCard.cardId == card.cardId){
                selected=" selected ";
            }
            return(
                <div className={`play-card-client-option${selected}bg-${card.category}`} key={card.cardId} onClick={this.selectCard.bind(this,card)}>
                    {displayNumber}
                </div>
            );
        });
    }

    renderInstruction(){
        if(this.props.forSelf){
            return this.renderInstructionSelf();
        }else{
            return this.renderInstructionOther();
        }
    }

    renderInstructionSelf(){
        switch(this.props.selectedPlayCard.playCardType){
            case "praise":
            return(
                <div className="play-card-client-text">
                    <T>weq.chooseCard.InstructionSelfPraiseLine1</T> <b><T>weq.chooseCard.InstructionSelfPraiseLine1Bold</T></b> <T>weq.chooseCard.InstructionSelfPraiseLine1P2</T>
                    <br/><br/>
                    <T>weq.chooseCard.InstructionSelfPraiseLine2</T>
                </div>
            );
            case "criticism":
                return(
                    <div className="play-card-client-text">
                        <T>weq.chooseCard.InstructionSelfCriticismLine1</T> <b><T>weq.chooseCard.InstructionSelfCriticismLine1Bold</T></b> <T>weq.chooseCard.InstructionSelfCriticismLine1P2</T>
                        <br/><br/>
                        <T>weq.chooseCard.InstructionSelfCriticismLine2</T>
                    </div>
                );
        }
    }


    renderInstructionOther(){
        var firstName = this.props.selectedPlayCardOwner && this.props.selectedPlayCardOwner.profile.firstName;
        var lastName = this.props.selectedPlayCardOwner && this.props.selectedPlayCardOwner.profile.lastName;
        switch(this.props.selectedPlayCard.playCardType){
            case "praise":
                return(
                    <div className="play-card-client-text">
                        <T>weq.chooseCard.InstructionOtherPraiseLine1</T> <b>{firstName} {lastName}</b> <T>weq.chooseCard.InstructionOtherPraiseLine1P2</T>
                    </div>
                );
            case "criticism":
                return(
                    <div className="play-card-client-text">
                        <T>weq.chooseCard.InstructionOtherCriticismLine1</T> <b>{firstName} {lastName}</b> <T>weq.chooseCard.InstructionOtherCriticismLine1P2</T>
                    </div>
                );
        }
    }

    render() {
        var timeoutWarning=this.state.timeoutWarning ? "timeout-warning" : "";
        return (
            <section className={`ranker-container ${timeoutWarning} fontreleway`}>
                <div className="div-time-100">
                    <div className={`actual-time ${timeoutWarning}`} style={{width:(Math.round(this.state.elapsed/1000)/60)*100 +"%"}}></div>
                </div>

                {this.state.timeoutWarning &&
                    <div className="timeout-warning-text"><T>weq.chooseCard.TimeUp</T></div>
                }
                
                {this.renderInstruction()}

                <div className="rate-content div-block-center">
                    {this.renderCardToChoose(this.props.selectedPlayCard.cardsToChoose)}
                </div>

                {this.state.showGrading &&
                    <SweetAlert
                    type={"play-card-grade"}
                    cancelAction={this.cancelAction.bind(this)}
                    submitAction={this.submitAction.bind(this)}
                    />
                }
            </section>
        );
    }
}

ChooseCard.defaultProps = {
    timerDuration: 60000,
};