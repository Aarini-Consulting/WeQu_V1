import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class Error extends React.Component {
  render() {
    return (
      <div className="fillHeight weq-bg">
        <div className="w-block noselect">
            <div>Oopsie!</div>
            <img src="https://media.giphy.com/media/cciMZGp5rsn0Q/giphy.gif"/>
            <div className="font-rate loading-font loading-text-top padding-wrapper">
              <T>weq.Error.looksLikeThatNotWorkingExpected</T>
            </div>
            <div className="font-rate f-bttn w-inline-block noselect" onClick={()=>{
              window.location.reload();
            }}>
              <T>weq.VerifyUpdateEmail.TryAgain</T>
            </div>
        </div>
      </div>
    );
  }
}
