import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import WelcomePage from '/imports/ui/pages/groupPlayCard/WelcomePage';
import GameplayPage from '/imports/ui/pages/groupPlayCard/GameplayPage';

class GroupPlayCardPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showConfirmStart:false,
        }
    }

    confirmStartGame(cardChosenType){
        this.setState({
            showConfirmStart: true,
        });
    }

    startGamePlayCards(cardChosenType){
        Meteor.call( 'start.game.play.cards', this.props.group._id, cardChosenType, (error, result)=>{
          if(error){
            console.log(error)
          }
        });
    }

    render() {
        var selectedCardType = this.props.selectedCardType;

        if(this.props.group.isPlaceCardFinished){
            if(selectedCardType){
                if(this.props.selectedCardTypeActive){
                    return (
                        <div className="tap-content-wrapper play-card">
                            <GameplayPage group={this.props.group} groupType={selectedCardType}/>
                        </div>
                    );
                }else{
                    return (
                        <div className="tap-content-wrapper play-card">
                            <WelcomePage groupType={selectedCardType} confirmStartGame={this.confirmStartGame.bind(this,selectedCardType)}/>
            
                            {this.state.showConfirmStart &&
                                <SweetAlert
                                type={"confirm"}
                                message={"Everyone ready for interactive mode?"}
                                imageUrl={"/img/gameMaster/interactive.gif"}
                                confirmText={"Let's go!"}
                                cancelText={"Cancel"}
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
                            <h1>No "play card" mode is assigned to this group</h1>
                        </div>
                    </div>
                );
            }
        }else{
            return(
                <div className="tap-content-wrapper play-card">
                    <div className="div-block-center">
                        <div className="ring"></div>
                        <h1>You need to finish "Prepare Cards" first before using this features</h1>
                    </div>
                </div>
            );
        }
    }
}

export default withTracker((props) => {
    let selectedCardType;
    let playCardFinished=false;
    let selectedCardTypeActive=false;

    if(props.group.playCardTypeActive){
        selectedCardType = props.group.playCardTypeActive;
        selectedCardTypeActive = true;
    }else{
        //currently no playcard mode is selected as active
        //check if this group has playcard modes assigned to it
        if(props.group.playCardTypeList && props.group.playCardTypeList.length > 0){
            //check if any mode is ever completed
            if(props.group.playCardTypeCompleted && props.group.playCardTypeCompleted.length > 0){
                //choose the last one completed
                selectedCardType = props.group.playCardTypeCompleted[props.group.playCardTypeCompleted.length-1];
                //check if all play card mode is completed
                if(props.group.playCardTypeCompleted.length == props.group.playCardTypeList.length){
                    //set value to indicate all mode is completed
                    playCardFinished = true;
                }
            }else{
                //no mode is completed, select the first one
                selectedCardType = props.group.playCardTypeList[0];
            }
        }
    }
    return {
        selectedCardType:selectedCardType,
        selectedCardTypeActive:selectedCardTypeActive,
        playCardFinished:playCardFinished
    };
  })(GroupPlayCardPage);
