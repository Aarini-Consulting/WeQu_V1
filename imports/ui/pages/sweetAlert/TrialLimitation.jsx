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
                    You're currently a free-tier user. 
                    <br/>
                    Only trained &amp; certified WeQ coaches have access to advanced game modules.
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