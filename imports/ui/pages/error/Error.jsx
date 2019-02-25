import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class Error extends React.Component {
  render() {
    return (
      <div className="fillHeight weq-bg">
        <div className="w-block noselect">
            <div>Oopsie!</div>
            <img src="https://media.giphy.com/media/cciMZGp5rsn0Q/giphy.gif"/>
            <div className="font-rate loading-font loading-text-top padding-wrapper">
                looks like that's not working as expected
            </div>
            <div className="font-rate f-bttn w-inline-block noselect" onClick={()=>{
              window.location.reload();
            }}>
              Try again
            </div>
        </div>
      </div>
    );
  }
}
