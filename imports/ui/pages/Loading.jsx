import React from 'react';
import { Link } from 'react-router';

export default class Loading extends React.Component {
  render() {
    return (
        <section className="gradient{{currentUser.profile.gradient}} whiteText alignCenter">
            loading...
            <div id="error"></div>
            <div id="info"></div>
        </section>
    );
  }
}
