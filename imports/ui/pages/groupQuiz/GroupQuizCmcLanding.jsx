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
                  backgroundImage: "url('https://image.shutterstock.com/image-photo/disloyal-man-walking-his-girlfriend-450w-297886754.jpg')",
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
