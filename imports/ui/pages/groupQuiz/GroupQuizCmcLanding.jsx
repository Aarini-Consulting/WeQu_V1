import React from 'react';

export default class GroupQuizCmcLanding extends React.Component {
  render() {
    return (
        <div className="group-quiz-cmc-screen">
            <div className="font-rate font-name-header group-quiz-cmc-screen-question">
              {this.props.question}
            </div>
            <div className="group-quiz-cmc-screen-content" 
              style={{
                  // backgroundImage: "url('/img/radar-bg.png')",
                  backgroundImage: "url('https://preview.redd.it/ie9xrkymglg21.png?width=960&crop=smart&auto=webp&s=fa0a08e3903c97ef87df8384b8984765c5292e97')",
                  backgroundSize:"contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                  }}>
              <h1>1/7</h1>
            </div>
            <div className="div-block-center cursor-pointer">
              <div className="w-inline-block">
                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.props.getQuizResult}>
                  Get Result
                </div>
              </div>
            </div>
        </div>
    );
  }
}
