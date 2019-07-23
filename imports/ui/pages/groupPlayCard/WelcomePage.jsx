import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import {groupTypeIsShort,groupTypeShortList} from '/imports/helper/groupTypeShort.js';

export default class WelcomePage extends React.Component {
    constructor(props){
        super(props);
    }

    renderInstruction(groupType, selectedCardType){
        let praiseInstruction = '/img/playCard/instruction-praise.jpg';
        let criticismInstruction = '/img/playCard/instruction-criticism.jpg';

        if(groupType === groupTypeShortList[1]){
            praiseInstruction = '/img/playCard/P_Round1.jpg';
        }
        else if(groupType === groupTypeShortList[2]){
            criticismInstruction = '/img/playCard/C_Round1.jpg';
        }

        if(selectedCardType == "praise"){
            return (
            <div>
                <ul className="play-card-page-list">
                    <li><span>turn over and read cards 3 and 4.</span></li>
                    <li><span>this may be difficult, but you must choose the card that you think is more applicable to <b>you</b>.</span></li>
                </ul>
                <div className="div-block-center">
                    <img src={praiseInstruction}/>
                </div>
            </div>
            );
        }else if(selectedCardType == "criticism"){
            return(
                <div>
                    <ul className="play-card-page-list">
                        <li><span>turn over and read cards 5, 6, and 7.</span></li>
                        <li><span>choose which of these cards is something you think <b>you could improve most</b>.</span></li>
                    </ul>
                    <div className="div-block-center">
                        <img src={criticismInstruction}/>
                    </div>
                </div>
            );
        }
    }

    render() {
        var groupType = this.props.groupType;
        var selectedCardType = this.props.selectedCardType;
        return(
            <React.Fragment>
                <div className="play-card-page-title">{groupType}</div>
                {this.renderInstruction(groupType, selectedCardType)}
                {!this.props.inGameplay &&
                    <div className="button-action-person-turn">
                        <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.props.confirmStartGame}>
                            Get Started
                        </div>
                    </div>
                }
                
            </React.Fragment>
        );
    }
}
