import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Confirm extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div>
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block', marginTop: -16.5+ "em"}}>
                <div className="msg-wrapper">
                    <div className="fontreleway f-popup-title f-popup-msg">
                    {this.props.message}
                    </div>
                </div>
                <div className="w-block align-center">
                    <div className="w-inline-block">
                        <div className="bttn-wrapper w-clearfix">
                            <div className="popup-bttn left" onClick={this.props.onCancel}>
                            <div className="fontreleway f-bttn">{this.props.cancelText}</div>
                            </div>
                            <div className="popup-bttn right" onClick={this.props.onConfirm}>
                            <div className="fontreleway f-bttn">{this.props.confirmText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}

Confirm.defaultProps = {
    confirmText: "Proceed",
    cancelText:"cancel"
};