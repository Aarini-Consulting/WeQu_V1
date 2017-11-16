import React from 'react';
import { Link } from 'react-router-dom';

export default class Loading extends React.Component {
  render() {
    return (
        <section className="gradient{{currentUser.profile.gradient}} whiteText alignCenter">
            <h2 style="width:65%">
            Well done!<br/>
            Check out your WeQu Scores
            </h2>
            <img src="/img/next.png" id="next" style="width:60px; margin-top:30%"/>
        </section>
    );
  }
}
