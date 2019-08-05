import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import {groupTypeIsShort,groupTypeShortList} from '/imports/helper/groupTypeShort.js';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

export default class WelcomePage extends React.Component {
    constructor(props){
        super(props);
    }

    renderInstruction(groupType, selectedCardType){
        let praiseInstruction = '/img/playCard/instruction-praise.jpg';
        let criticismInstruction = '/img/playCard/instruction-criticism.jpg';
        let criticismText = "turn over and read cards 5, 6, and 7.";

        if(groupType === groupTypeShortList[1]){
            praiseInstruction = '/img/playCard/P_Round1.jpg';
        }
        else if(groupType === groupTypeShortList[2]){
            criticismInstruction = '/img/playCard/C_Round1.jpg';
            criticismText = "turn over and read cards 3, 4, and 5.";
        }

        if(selectedCardType == "praise"){
            return (
            <div>
                <ul className="play-card-page-list">
                    <li><span><T>weq.welcomePage.InstructionPraiseLine1</T></span></li>
                    <li><span><T>weq.welcomePage.InstructionPraiseLine2</T> <b><T>weq.welcomePage.InstructionPraiseLine2Bold</T></b>.</span></li>
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
                        <li><span>{criticismText}</span></li>
                        <li><span><T>weq.welcomePage.InstructionCriticismLine1</T> <b><T>weq.welcomePage.InstructionCriticismLine1Bold</T></b>.</span></li>
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
                            <T>weq.welcomePage.InstructionGetStarted</T>
                        </div>
                    </div>
                }
                
            </React.Fragment>
        );
    }
}
