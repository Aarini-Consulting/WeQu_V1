import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class PlayCardPage extends React.Component {
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

    startGamePlayCards(){
        Meteor.call( 'start.game.play.cards', this.props.group._id, (error, result)=>{
          if(error){
            console.log(error)
          }
        });
      }

    render() {
        return (
            <div className="tap-content-wrapper">
                <h1>Pick which card applies more to you</h1>
                <div className="div-block-center">
                    <div className="w-inline-block">
                        <button onClick={this.confirmStartGame.bind(this)}>2 -cards mode</button>
                    </div>
                    <div className="w-inline-block">
                        <button onClick={this.confirmStartGame.bind(this)}>3 -cards mode</button>
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
                        this.setState({ showConfirmStart: false });
                    }}
                    onConfirm={() => {
                        this.setState({ showConfirmStart: false });
                        this.startGamePlayCards();
                    }}/>
                }
            </div>
        );
    }
}
