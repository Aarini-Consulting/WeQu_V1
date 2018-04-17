import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Info extends React.Component {

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

                <div className="bttn-wrapper w-clearfix">
                    <div className="popup-bttn" onClick={this.props.onCancel}>
                        <div className="fontreleway f-bttn">Ok</div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}