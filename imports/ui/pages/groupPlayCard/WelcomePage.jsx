import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class WelcomePage extends React.Component {
    constructor(props){
        super(props);
    }

    renderInstruction(groupType){
        if(groupType == "praise"){
            return (
            <div>
                <ul className="play-card-page-list">
                    <li><span>turn over and read cards 3 and 4.</span></li>
                    <li><span>this may be difficult, but you must choose the card that you think is more applicable to <b>you</b>.</span></li>
                </ul>
                <div className="div-block-center">
                    <img src={'/img/playCard/instruction-praise.jpg'}/>
                </div>
            </div>
            );
        }else if(groupType == "criticism"){
            return(
                <div>
                    <ul className="play-card-page-list">
                        <li><span>turn over and read cards 5, 6, and 7.</span></li>
                        <li><span>choose which of these cards is something you think <b>you could improve most</b>.</span></li>
                    </ul>
                    <div className="div-block-center">
                        <img src={'/img/playCard/instruction-criticism.jpg'}/>
                    </div>
                </div>
            );
        }
    }

    render() {
        var groupType = this.props.groupType;
        return(
            <React.Fragment>
                <div className="play-card-page-title">{groupType}</div>
                {this.renderInstruction(groupType)}
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
