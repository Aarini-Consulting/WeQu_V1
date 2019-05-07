import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import Loading from '/imports/ui/pages/loading/Loading';
import SessionWait from '/imports/ui/pages/quizClient/SessionWait';

import {PlayCard} from '/collections/playCard';

import ChooseCardSelf from './ChooseCardSelf';

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
            if(this.props.cardChosenBySelf && !this.props.cardChosenBySelf.cardChosen){
                return(
                    <ChooseCardSelf group={this.props.group} cardChosenBySelf={this.props.cardChosenBySelf}/>
                );
            }
            else if(this.props.cardChosenBySelf && this.props.cardChosenBySelf.cardChosen){
                return(
                    <ChooseCardWait group={this.props.group} cardChosenBySelf={this.props.cardChosenBySelf}/>
                );
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
    let cardChosenByOthers;
    let userId = Meteor.userId();

    let handlePlayCard = Meteor.subscribe('playCard',
        {
            "groupId":props.group._id,
            $or : [ {"from" : userId  }, 
                { "to" : userId}
            ]
        },{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    if(handlePlayCard.ready()){
        cardChosenBySelf = PlayCard.findOne(
            {
                "groupId":props.group._id,
                $and : [ 
                {"from" : userId  }, 
                { "to" : userId}
            ]});

        cardChosenByOthers = PlayCard.find({
            "groupId":props.group._id,
            $and : [ 
                {"from": { '$ne': userId } }, 
                { "to" : userId}
            ]
        }).fetch();
        
        dataReady = true;
    }

    return {
        cardChosenBySelf:cardChosenBySelf,
        cardChosenByOthers:cardChosenByOthers,
        dataReady:dataReady
    };
})(ChooseCardPage);
