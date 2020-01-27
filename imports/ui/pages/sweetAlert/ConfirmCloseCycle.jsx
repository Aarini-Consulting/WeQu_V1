import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class ConfirmCloseCycle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div className="popup-container">
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block'}}>
                <div className="fontreleway f-popup-title">
                <T>weq.ConfirmCloseCycle.AreYouSure</T> 
                </div>
                <div className="msg-wrapper">
                    <div className="fontreleway f-popup-title f-popup-msg">
                    <T>weq.ConfirmCloseCycle.ReportWillGenerated</T>
                    <T>weq.ConfirmCloseCycle.YouCanRequestReportOnlyOneTimeCycle</T>
                    <T>weq.ConfirmCloseCycle.ItTakesHoursReturnReport</T>
                    <T>weq.ConfirmCloseCycle.OncereportRequestedCancelHours</T>
                    </div>
                </div>

                <div className="w-block align-center">
                    <div className="w-inline-block">
                        <div className="bttn-wrapper w-clearfix">
                            <div className="popup-bttn left" onClick={this.props.onCancel}>
                            <div className="fontreleway f-bttn">Cancel</div>
                            </div>
                            <div className="popup-bttn right" onClick={this.props.onConfirm}>
                            <div className="fontreleway f-bttn">Proceed</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            </div> 
        );
  }
}