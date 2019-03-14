import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class GroupQuizClientImage extends React.Component {
  render() {
    var backgroundUrl = this.props.backgroundUrl;
    var style={};

    if(backgroundUrl){
      style = {
        width:100+"%",
        flexBasis:25+'vh',
        height:25+"vh",
        backgroundImage: `url('${backgroundUrl}'),url('/img/assets/Logo-Main_ring_animation.gif')`,
        backgroundSize:"cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }
    }else{
      style = {
        display:"none"
      }
    }

    return (
      <div className="group-quiz-client-image" style={style}></div>
    );
  }
}