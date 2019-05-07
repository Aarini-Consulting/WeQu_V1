import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import WelcomePage from './WelcomePage';

import {CardChosen} from '/collections/cardChosen';

class GameplayPage extends React.Component {
    constructor(props){
        super(props);
    }

    renderInstruction(groupType){
        if(groupType == "praise"){
            return (
            <div>
                <ul>
                    <li>turn over and read cards 3 and 4</li>
                    <li>this may be difficult, but you must choose the card that you think is more applicable to <b>you</b></li>
                </ul>
                <img src={'/img/playCard/instruction-praise.jpg'}/>
            </div>
            );
        }else if(groupType == "criticism"){
            return(
                <div>
                    <ul>
                        <li>turn over and read cards 5, 6, and 7</li>
                        <li>choose which of these cards is something you think <b>you could improve most</b></li>
                    </ul>
                    <img src={'/img/playCard/instruction-criticism.jpg'}/>
                </div>
            );
        }
    }

    render() {
        return(
            <React.Fragment>
                <WelcomePage groupType={this.props.groupType} inGameplay={true}/>
                <div className="play-card-counter-wrapper">
                    <div className="play-card-counter">{this.props.cardChosenBySelfDone.length}/{this.props.group.userIds.length}</div>
                </div>
            </React.Fragment>
        );
    }
}

export default withTracker((props) => {
    let dataReady;
    let cardChosenBySelfDone=[];

    let handleCardChosen = Meteor.subscribe('cardChosen',
        {
            "groupId":props.group._id,
            "cardChosenType":props.group.playCardTypeActive
        },{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    if(handleCardChosen.ready()){
        let cardChosenBySelf = CardChosen.find(
            { 
                "groupId":props.group._id,
                "cardChosenType":props.group.playCardTypeActive
            }).fetch();

        cardChosenBySelfDone = cardChosenBySelf.filter((card)=>{
            return ((card.from == card.to) && card.cardChosen);
        });

        dataReady = true;
    }

    return {
        cardChosenBySelfDone:cardChosenBySelfDone,
        dataReady:dataReady
    };
  })(GameplayPage);
