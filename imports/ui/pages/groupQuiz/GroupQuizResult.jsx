import React from 'react';

export default class GroupQuizResult extends React.Component {
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
              <h1>quiz chart here</h1>
            </div>
            <div className="font-rate font-name-header">
              7/7
            </div>
        </div>
    );
  }
}
