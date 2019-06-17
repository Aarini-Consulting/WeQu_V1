import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class GroupQuizCmcLanding extends React.Component {
  render() {
    var backgroundUrl = this.props.backgroundUrl;
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
    }else{
      style = {
        display:"none"
      }
    }

    return (
        <div className="group-quiz-cmc-screen">
            <div className="font-rate font-name-header group-quiz-cmc-screen-question">
              {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
            </div>
            <div className="group-quiz-cmc-screen-content" >
              <div style={style}></div>
              <div className="group-quiz-cmc-screen-content-item">
                <h1>{this.props.audienceResponseCount}/{this.props.totalParticipant}</h1>
              </div>
              
            </div>
            <div className="div-block-center cursor-pointer">
              <div className="w-inline-block">
                <div className="font-rate f-bttn group-quiz-cmc-screen-button w-inline-block noselect" onClick={this.props.getQuizResult}>
                  Get Result
                </div>
              </div>
            </div>
        </div>
    );
  }
}
