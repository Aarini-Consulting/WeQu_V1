import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import {PlayCard} from '/collections/playCard';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import WelcomePage from '/imports/ui/pages/groupPlayCard/WelcomePage';
import GameplayPage from '/imports/ui/pages/groupPlayCard/GameplayPage';

import Loading from '/imports/ui/pages/loading/Loading';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class GroupPlayCardPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showConfirmStart:false,
        }
    }

    confirmStartGame(){
        this.setState({
            showConfirmStart: true,
        });
    }

    startGamePlayCards(cardPlayType){
        Meteor.call( 'start.game.play.cards', this.props.group._id, cardPlayType, (error, result)=>{
          if(error){
            console.log(error)
          }
        });
    }

    render() {
        var selectedCardType = this.props.selectedCardType;
        if(this.props.dataReady){
            if(this.props.group.isPlaceCardFinished){
                if(selectedCardType){
                    if(this.props.selectedCardTypeActive){
                        return (
                            <GameplayPage group={this.props.group} groupType={this.props.group.groupType} selectedCardType={selectedCardType}/>
                        );
                    }else{
                        return (
                            <div className="tap-content-wrapper play-card">
                                <WelcomePage groupType={this.props.group.groupType} selectedCardType={selectedCardType} confirmStartGame={this.confirmStartGame.bind(this,selectedCardType)}/>
                
                                {this.state.showConfirmStart &&
                                    <SweetAlert
                                    type={"confirm"}
                                    message={i18n.getTranslation("weq.GroupPlayCardPage.EveryoneReadyInteractivemode")}
                                    imageUrl={"/img/gameMaster/interactive.gif"}
                                    confirmText={i18n.getTranslation("weq.GroupPlayCardPage.LetGo")}
                                    cancelText={i18n.getTranslation("weq.GroupPlayCardPage.Cancel")}
                                    onCancel={() => {
                                        this.setState({ showConfirmStart: false });
                                    }}
                                    onConfirm={() => {
                                        this.startGamePlayCards(selectedCardType);
                                        this.setState({ showConfirmStart: false });
                                    }}/>
                                }
                            </div>
                        );
                    }
                }else{
                    return(
                        <div className="tap-content-wrapper play-card">
                            <div className="div-block-center">
                                <div className="ring"></div>
                                <h1><T>weq.GroupPlayCardPage.NoPplayCardModeAssigned</T></h1>
                            </div>
                        </div>
                    );
                }
            }else{
                return(
                    <div className="tap-content-wrapper play-card">
                        <div className="div-block-center">
                            <div className="ring"></div>
                            <h1><T>weq.GroupPlayCardPage.YouNeedFinishPrepareCardsFirst</T></h1>
                        </div>
                    </div>
                );
            }
        }else{
            return(
                <Loading/>
            );
        }
        
    }
}

export default withTracker((props) => {
    let selectedCardType;
    let playCardFinished=false;
    let selectedCardTypeActive=false;
    let dataReady = false;

    if(props.group.playCardTypeActive){
        selectedCardType = props.group.playCardTypeActive;
        selectedCardTypeActive = true;
        dataReady = true;
    }else{
        //currently no playcard mode is selected as active
        //check if this group has playcard modes assigned to it
        if(props.group.playCardTypeList && props.group.playCardTypeList.length > 0){
            //check if any mode is ever attempted
            let handlePlayCard = Meteor.subscribe('playCard',
                {
                    "groupId":props.group._id,
                    'cardChosen':{$exists: true}
                },{sort: { "createdAt": -1 }}, {
                onError: function (error) {
                    console.log(error);
                }
            });

            if(handlePlayCard.ready()){
                let playCardCheck = PlayCard.findOne({
                    "groupId":props.group._id,
                    'cardChosen':{$exists: true}
                },{sort: { "createdAt": -1 }});

                if(playCardCheck){
                    //call start function to resume game
                    Meteor.call( 'resume.game.play.cards', props.group._id, playCardCheck.playCardType, (error, result)=>{
                        if(error){
                            console.log(error)
                        }
                    });
                }else{
                    //no mode is completed, select the first one
                    selectedCardType = props.group.playCardTypeList[0];
                    dataReady = true;
                }
            }
            
        }
    }
    return {
        selectedCardType:selectedCardType,
        selectedCardTypeActive:selectedCardTypeActive,
        playCardFinished:playCardFinished,
        dataReady:dataReady
    };
  })(GroupPlayCardPage);
