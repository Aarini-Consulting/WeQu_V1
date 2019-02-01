import React from 'react';

export default class GroupQuizCmcLanding extends React.Component {
  render() {
    return (
        <section className="alignCenter">
            {this.props.question}
            <div className="w-block cursor-pointer">
                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.props.getQuizResult}>
                    {"Get Result"}
                </div>
            </div>
        </section>
    );
  }
}
