import React from 'react';
import { Link } from 'react-router-dom';

export default class ScriptLoginFinish extends React.Component {
  render() {
    return (
        <section className="gradient{{currentUser.profile.gradient}} whiteText alignCenter">
            <h2>
            Well done!<br/>
            Now answer questions<br/>about this person
            </h2>
            <img src="/img/next.png" id="next" style="width:60px; margin-top:30%"/>
        </section>
    );
  }
}
