import React from 'react';
import { Meteor } from 'meteor/meteor';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

export default class PlayCardGrade extends React.Component {
    constructor(props) {
        super(props);
        this.defaultSmile = [false,false,false];
        this.state={
            smile: this.defaultSmile.slice(),
            smileText: ["weq.sweetAlert.PlayCardGradeOption1","weq.sweetAlert.PlayCardGradeOption2","weq.sweetAlert.PlayCardGradeOption3"],
            selectedIndex:-1,
            error:false
        }
    }

    submitClick(){
        this.props.submitAction(((this.state.selectedIndex + 1)/this.state.smile.length));
    }

    smileClick(index){
        var tempSmile = this.state.smile.slice();
        var newValue = !tempSmile[index];
        if(newValue === true){
            tempSmile = this.defaultSmile.slice();
            tempSmile[index] = newValue;

            this.setState({
                smile:tempSmile,
                selectedIndex:index
            });
        }
    }

    renderSmile(){
      return this.state.smile.map((val,index)=>{
          let clickEvent = this.smileClick.bind(this,index);
          if(val){
            return(
                <div key={`smile-${index}`}>
                    <div className="play-card-smile" onClick={clickEvent}>
                    <img src={`/img/playCard/smile-${index+1}.png`}/>
                    </div>
                    <span className="play-card-smile-text">{i18n.getTranslation(this.state.smileText[index])}</span>
                </div>
                
            );
          }else{
            return(
                <div key={`smile-${index}`}>
                    <div className="play-card-smile"  onClick={clickEvent}>
                    <img src={`/img/playCard/smile-${index+1}-grey.png`}/>         
                    </div>
                    <span className="play-card-smile-text">{this.state.smileText[index]}</span>
                </div>
            );
          }
      })
  }

  render() {
        return (
            <div className="popup-container">
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block'}}>
                <span className="popup-close fontreleway f-popup-title f-popup-msg" onClick={this.props.cancelAction}>
                    <i className="fas fa-times"></i>
                </span>
                <div className="msg-wrapper">
                    <div className="fontreleway f-popup-title f-popup-msg">
                    <T>weq.sweetAlert.PlayCardGradeQuestion</T>
                    </div>
                </div>

                <div className="play-card-smile-wrapper w-clearfix">
                    <div className="play-card-smile-line"></div>
                    {this.renderSmile()}
                </div>
                
                {this.state.selectedIndex > -1 &&
                    <div className="w-block align-center">
                        <div className="w-inline-block">
                            <div className="bttn-wrapper w-clearfix">
                                <div className="popup-bttn" onClick={this.submitClick.bind(this)}>
                                    <div className="fontreleway f-bttn">
                                        <T>weq.sweetAlert.PlayCardGradeSubmit</T>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            </div> 
        );
  }
}