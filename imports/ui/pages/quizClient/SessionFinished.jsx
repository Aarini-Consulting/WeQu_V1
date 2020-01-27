import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class SessionFinished extends React.Component {
  render() {
    return (
        <div className="fillHeight">
            <section className="section summary fontreleway weq-bg">
            <T>weq.SessionFinished.ThisSessionEnded</T>
            <div className="w-block cursor-pointer">
                <Link to="/" className="font-rate f-bttn w-inline-block noselect">{i18n.getTranslation("weq.quizRankPlaceCard.ButtonDone")}</Link>
            </div>
            </section>
        </div>
    );
  }
}
