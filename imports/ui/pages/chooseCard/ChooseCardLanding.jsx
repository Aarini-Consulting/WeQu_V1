import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import Loading from '/imports/ui/pages/loading/Loading';

export default class ChooseCardLanding extends React.Component {
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
        if(this.state.selectedCard){
            this.setState({
                selectedCardConfirmed:true
            });
        }
    }

    submitAnswer(){
        if(this.state.selectedCard && this.state.selectedCardConfirmed){
            console.log("submit answer");
        }
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
        if(this.state.selectedCard && this.state.selectedCardConfirmed){
            return(
                <section className="ranker-container fontreleway purple-bg">
                    <div className="div-time-100">
                        <div className="actual-time" style={{width:(Math.round(3000/1000)/60)*100 +"%"}}></div>
                    </div>
                    <div className="rate-content">
                        <h1>how strong do you feel about it?</h1>
                        <h1>{this.state.selectedCard.subCategory}</h1>
                        <div className="slidecontainer">
                            <input type="range" min="1" max="100" className="slider"/>
                        </div>
                        <div className="slidecontainer descriptor">
                            <p>not strong</p>
                            <p>very strong</p>
                        </div>
                    </div>
                    <button onClick={this.submitAnswer.bind(this)}>Confirm</button>
                </section>
            );
        }else{
            return (
                <section className="ranker-container fontreleway purple-bg">
                    <div className="div-time-100">
                        <div className="actual-time" style={{width:(Math.round(3000/1000)/60)*100 +"%"}}></div>
                    </div>

                    <div className="rate-content div-block-center">
                        {this.renderCardToChoose(this.props.cardChosenBySelf.cardsToChoose)}
                    </div>

                    <button onClick={this.confirmCardSelected.bind(this)}>next</button>
                </section>
            );
        }
    }
}