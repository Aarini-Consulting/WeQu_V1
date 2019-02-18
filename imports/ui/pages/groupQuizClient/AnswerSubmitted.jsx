import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

export default class AnswerSubmitted extends React.Component {
  render() {
    return (
        <div className="fillHeight">
            <div className="group-quiz-wrapper">
              <div className="group-quiz-content">
                <div>
                    <h3>Thank you</h3>
                    <br/>
                    <h3>Your answer is submitted</h3>
                    <br/>
                    <div className="ring animated"></div>
                </div>
              </div>
            </div>
        </div>
    );
  }
}
