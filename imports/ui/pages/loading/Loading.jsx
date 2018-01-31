import React from 'react';

export default class Loading extends React.Component {
  render() {
    return (
        <section className="gradient whiteText alignCenter">
            loading...
            <div id="error"></div>
            <div id="info"></div>
        </section>
    );
  }
}
