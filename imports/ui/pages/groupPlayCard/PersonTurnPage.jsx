import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class PersonTurnPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showResult: false,
        }
    }

    // componentDidUpdate(prevProps) {

    // }

    showResult(){
        this.setState(
            {showResult:true}
        );
    }

    renderInstruction(groupType, personName){
        if(groupType == "praise"){
            return (
                <div>
                    <ul>
                        <li><b>{personName}</b>: read cards 3 and 4 out loud</li>
                        <li>everyone in group will choose which card is more applicable to {personName}</li>
                    </ul>
                    <img src={'/img/playCard/instruction-praise.jpg'}/>
                </div>
            );
        }else if(groupType == "criticism"){
            return(
                <div>
                    <ul>
                        <li><b>{personName}</b>: read cards 5, 6, and 7 out loud</li>
                        <li>everyone in group will choose which card is more applicable to <b>{personName}</b></li>
                    </ul>
                    <img src={'/img/playCard/instruction-criticism.jpg'}/>
                </div>
            );
        }
    }

    renderResult(groupType){
        if(groupType == "praise"){

        }
    }

    render() {
        let groupType = this.props.groupType;
        let personName = this.props.personName;
        console.log(this.props.result);
        if(this.state.showResult){
            return(
                <React.Fragment>
                    <h1>Result</h1>
                    <ul>
                        <li><b>{personName}</b>: Ask 2 people to explain their choice, and mostly listen to the feedback. <b>{personName}</b> may ask followup questions</li>
                    </ul>

                    <div className="div-block-center">
                        <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer">
                            Finish discussion
                        </div>
                    </div>
                </React.Fragment>
            );
        }else{
            return(
                <React.Fragment>
                    <h1>Now it's {personName}'s turn</h1>
                    {this.renderInstruction(groupType, personName)}

                    <div className="div-block-center">
                        {this.props.cardChosenByOtherDoneCount == this.props.totalUser-1 &&
                            <div className="font-rate f-bttn play-card w-inline-block noselect cursor-pointer" onClick={this.showResult.bind(this)}>
                                Reveal Result
                            </div>
                        }
                    </div>
                    <div className="play-card-counter-wrapper">
                        <div className="play-card-counter">{this.props.cardChosenByOtherDoneCount}/{this.props.totalUser-1}</div>
                    </div>
                </React.Fragment>
            );
        }
    }
}
