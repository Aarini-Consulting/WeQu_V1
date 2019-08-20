import React from 'react';
import i18n from 'meteor/universe:i18n';
import {quizResultComponent} from '/imports/helper/quizResultComponent';

export default class GroupQuizResult extends React.Component {
  render() {
    var backgroundUrl = this.props.selectedQuiz.backgroundUrl;
    var style={};

    if(backgroundUrl){
      style = {
        width:100+"%",
        height:60+"vh",
        background: `url('${backgroundUrl}'),url('/img/assets/Logo-Main_ring_animation.gif')`,
        filter:"opacity(20%)",
        backgroundSize:"contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }
    }

    var GraphComponent = quizResultComponent(this.props.selectedQuiz.component);
    
    return (
        <div className="group-quiz-cmc-screen">
            <div className="font-rate font-name-header group-quiz-cmc-screen-question">
              {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.selectedQuiz.question}`)}
            </div>
            <div className="group-quiz-cmc-screen-content">
              <div style={style}></div>
              <div className="group-quiz-cmc-screen-content-item">
                <GraphComponent selectedQuiz={this.props.selectedQuiz} selectedQuizResult={this.props.selectedQuizResult}/>
              </div>
            </div>
        </div>
    );
  }
}
