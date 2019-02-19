import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class GroupQuizResult extends React.Component {
  render() {
    var backgroundUrl = this.props.backgroundUrl;
    var style={};

    if(backgroundUrl){
      style = {
        backgroundImage: `url('${this.props.backgroundUrl}')`,
        filter:"opacity(20%)",
        backgroundSize:"contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }
    }
    
    return (
        <div className="group-quiz-cmc-screen">
            <div className="font-rate font-name-header group-quiz-cmc-screen-question">
              {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
            </div>
            <div className="group-quiz-cmc-screen-content" 
              style={style}>
              <div className="group-quiz-cmc-screen-content-text">
                <h1>{this.props.audienceResponseCount}/{this.props.totalParticipant}</h1>
              </div>
            </div>
            <div className="font-rate font-name-header">
              {this.props.audienceResponseCount}/{this.props.totalParticipant}
            </div>
        </div>
    );
  }
}
