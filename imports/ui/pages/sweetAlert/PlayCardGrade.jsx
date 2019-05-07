import React from 'react';
import { Meteor } from 'meteor/meteor';


export default class PlayCardGrade extends React.Component {
    constructor(props) {
        super(props);
        this.defaultSmile = [false,false,false];
        this.state={
            smile: this.defaultSmile.slice(),
            selectedIndex:-1,
            triggerSubmit:false,
            error:false
        }
    }

    reset(){
        this.setState({
            smile: this.defaultSmile.slice(),
            triggerSubmit:false,
            error:false
        });
    }

    smileClick(index){
        var tempSmile = this.state.smile.slice();
        var newValue = !tempSmile[index];
        if(newValue === true && !this.state.triggerSubmit){
            tempSmile = this.defaultSmile.slice();
            tempSmile[index] = newValue;

            this.setState({
                smile:tempSmile,
                selectedIndex:index
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.selectedIndex === -1 && this.state.selectedIndex > -1 && !prevState.triggerSubmit){
            alert("triggerSubmit");
            this.setState({
                triggerSubmit:true
            });
        }
    }

    renderSmile(){
      return this.state.smile.map((val,index)=>{
          let clickEvent = this.smileClick.bind(this,index);
          if(val){
            return(
                <div className="play-card-smile" key={`smile-${index}`} onClick={clickEvent}>
                <img src={`/img/playCard/smile-${index+1}.png`}/>
                </div>
            );
          }else{
            return(
                <div className="play-card-smile" key={`smile-${index}`} onClick={clickEvent}>
                <img src={`/img/playCard/smile-${index+1}-grey.png`}/>
                </div>
            );
          }
      })
  }

  render() {
        return (
            <div>
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block', marginTop: -16.5+ "em"}}>
                <div className="msg-wrapper">
                    <div className="fontreleway f-popup-title f-popup-msg">
                    How strongly do you feel about that?
                    </div>
                </div>

                <div className="play-card-smile-wrapper w-clearfix">
                    <div className="play-card-smile-line"></div>
                    {this.renderSmile()}
                </div>
            </div>
            </div> 
        );
  }
}