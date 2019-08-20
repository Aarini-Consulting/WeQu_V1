import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

export default class AnswerSubmitted extends React.Component {
  render() {
    return (
        <div className="fillHeight">
            <div className="group-quiz-wrapper">
              <div className="group-quiz-content weq-bg">
                <div>
                    <div className="ring animated"></div>
                    <br/>
                    <div className="font-rate loading-font">{i18n.getTranslation("weq.groupQuizAnswerSubmitted.TextLine1")}</div>
                    <br/>
                    <div className="font-rate loading-font">{i18n.getTranslation("weq.groupQuizAnswerSubmitted.TextLine2")}</div>
                </div>
              </div>
            </div>
        </div>
    );
  }
}
