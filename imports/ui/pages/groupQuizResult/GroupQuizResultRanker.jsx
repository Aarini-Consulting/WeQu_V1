import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class GroupQuizResultRanker extends React.Component {
  render() {
    return (
      <div className="fillHeight weq-bg">
        <div className="w-block noselect">
            <div className="ring animated"></div>
            <div className="font-rate loading-font loading-text-top padding-wrapper">
                {this.props.placeCard 
                ?i18n.getTranslation("weq.loadingAnimated.PleaseWaitGenerating")
                :i18n.getTranslation("weq.loadingAnimated.PleaseWait")
                }
            </div>
            
        </div>
      </div>
    );
  }
}
