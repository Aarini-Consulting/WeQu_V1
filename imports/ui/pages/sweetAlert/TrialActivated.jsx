import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class TrialActivated extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div className="popup-container">
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block'}}>
                <div className="msg-wrapper">
                    <div className="fontreleway f-popup-title f-popup-msg left-align">
                    Congratulation! 
                    <br/> 
                    Your account has been upgraded. 
                    <br/> 
                    You now have access to free tier features of running WeQ session as a coach. 
                    <br/> 
                    Check your email for further instruction.
                    </div>
                </div>

                <div className="w-block align-center">
                    <div className="w-inline-block">
                        <div className="bttn-wrapper w-clearfix">
                            <div className="popup-bttn" onClick={this.props.onCancel}>
                                <div className="fontreleway f-bttn">{
                                    this.props.btnText
                                    ?
                                    this.props.btnText
                                    :
                                    "OK"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}