import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

export default class SessionFinished extends React.Component {
  render() {
    return (
        <div className="fillHeight">
            <section className="section summary fontreleway weq-bg">
            this session has ended. thanks for using weq
            <div className="w-block cursor-pointer">
                <Link to="/" className="font-rate f-bttn w-inline-block noselect">{i18n.getTranslation("weq.quizRankPlaceCard.ButtonDone")}</Link>
            </div>
            </section>
        </div>
    );
  }
}
