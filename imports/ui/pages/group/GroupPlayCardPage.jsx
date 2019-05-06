import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class PlayCardPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showConfirmStart:false,
          cardChosenType:undefined
        }
    }

    confirmStartGame(cardChosenType){
        this.setState({
            showConfirmStart: true,
            cardChosenType:cardChosenType
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
        if(this.props.group.isPlaceCardFinished){
            if(this.props.group.isPlayCardActive){
                return (
                    <div className="tap-content-wrapper">
                        <h1>check your phone and pick a card that suits you the most</h1>
                    </div>
                );
            }else{
                return (
                    <div className="tap-content-wrapper">
                        <h1>Pick which card applies more to you</h1>
                        <div className="div-block-center">
                            <div className="w-inline-block">
                                <button onClick={this.confirmStartGame.bind(this, "2")}>2 -cards mode</button>
                            </div>
                            <div className="w-inline-block">
                                <button onClick={this.confirmStartGame.bind(this, "3")}>3 -cards mode</button>
                            </div>
                        </div>
        
                        {this.state.showConfirmStart &&
                            <SweetAlert
                            type={"confirm"}
                            message={"Everyone ready for interactive mode?"}
                            imageUrl={"/img/gameMaster/interactive.gif"}
                            confirmText={"Let's go!"}
                            cancelText={"Cancel"}
                            onCancel={() => {
                                this.setState({ showConfirmStart: false, cardChosenType:undefined });
                            }}
                            onConfirm={() => {
                                this.startGamePlayCards(this.state.cardChosenType);
                                this.setState({ showConfirmStart: false, cardChosenType:undefined });
                            }}/>
                        }
                    </div>
                );
            }
        }else{
            <div className="tap-content-wrapper">
                <div className="div-block-center">
                    <div className="ring"></div>
                    <h1>You need to finished "Place Card" first before using this features</h1>
                </div>
            </div>
        }
    }
}
