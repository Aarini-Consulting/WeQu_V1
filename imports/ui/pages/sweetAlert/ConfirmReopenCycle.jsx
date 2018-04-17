import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class ConfirmReopenCycle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div>
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block', marginTop: -16.5+ "em"}}>
                <div className="fontreleway f-popup-title">
                Are you sure you want to cancel the report?
                </div>

                <div className="bttn-wrapper w-clearfix">
                    <div className="popup-bttn left" onClick={this.props.onCancel}>
                        <div className="fontreleway f-bttn">No</div>
                    </div>
                    <div className="popup-bttn right" onClick={this.props.onConfirm}>
                        <div className="fontreleway f-bttn">Yes, cancel report</div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}