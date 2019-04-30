import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class ChooseCardPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          selectedCardId:undefined,
          selectedCardConfirmed:false,
        }
    }

    selectCard(cardNumber){
        this.setState({
            selectedCardId:cardNumber
        });
    }

    confirmCardSelected(){
        this.setState({
            selectedCardConfirmed:true
        });
    }

    renderCardToPick(){
        
    }

    render() {
        if(this.state.selectedCardId && this.state.selectedCardConfirmed){
            return(
                <section className="ranker-container fontreleway purple-bg">
                    <div className="div-time-100">
                        <div className="actual-time" style={{width:(Math.round(3000/1000)/60)*100 +"%"}}></div>
                    </div>
                    <div className="rate-content">
                        <h1>how strong do you feel about it?</h1>
                    </div>
                </section>
            );
        }else{
            return (
                <section className="ranker-container fontreleway purple-bg">
                    <div className="div-time-100">
                        <div className="actual-time" style={{width:(Math.round(3000/1000)/60)*100 +"%"}}></div>
                    </div>

                    <div className="rate-content div-block-center">
                        <div className="w-inline-block">
                            <button onClick={this.selectCard.bind(this,"69")}>69</button>
                        </div>
                        <div className="w-inline-block">
                            <button onClick={this.selectCard.bind(this,"96")}>96</button>
                        </div>
                    </div>

                    <button onClick={this.confirmCardSelected.bind(this)}>next</button>
                </section>
            );
        }
        
    }
}
