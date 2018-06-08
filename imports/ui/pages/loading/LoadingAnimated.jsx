import React from 'react';

export default class LoadingAnimated extends React.Component {
  render() {
    return (
      <div className="fillHeight weq-bg">
        <div className="w-block noselect">
            <div className="ring animated"></div>
            <div className="font-rate loading-font loading-text-top">
                Please wait... WeQ is generating your card numbers
            </div>
        </div>
      </div>
    );
  }
}
