import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading2 from '/imports/ui/pages/loading/Loading2';
import Radar from './Radar';

class RadarComparison extends React.Component {
  render() {
    if(this.props.dataReady){
      return (
        <div>
        <section className="ptb_h1">
          <img src="/img/icon_overview.png" className="titleIcon"/>
          <h3>Comparisons</h3>
          <svg height="300" width="300" 
          style={{zminMinHeight:300+"px", backgroundImage:"url('/img/skills2.png')", backgroundSize: "cover"}}>
            <Radar points = {dataForRadar(this.props.myScore)} color="white" outline="#E96956"/>
            <Radar points = {dataForRadar(this.props.otherScore)} color="#E96956" outline="white"/>
          </svg>
        </section>
        {this.props.quizPerson == Meteor.userId()
        ?
          <section>
            <div className="radarAgenda">
                <div><img src="/img/myradar.png"/></div>
                <div><img src="/img/othersradar.png" className="t50"/></div>
            </div>
          </section>
        :
          <section>
            <div className="radarAgenda">
              <div><img src="/img/Diamond_Myself.png"/>
                <span className="marginleft10 font-small">  
                  How <span className="text-capitalize"> {getUserName(this.props.quizUser.profile)}</span> sees me  
                </span>
              </div>
              <div><img src="/img/Diamond_Others.png" className="t50"/>
                <span className="marginleft10 font-small">
                  How I see <span className="text-capitalize">{getUserName(this.props.quizUser.profile)}</span> 
                </span> 
              </div>
            </div>
          </section>
        }

        {this.props.quizPerson == Meteor.userId() &&
          <div className="divbttn" id="finish">
            <a className="fontbttn profilebttn w-button">
            invite my teammates to learn how they see me
            </a>
          </div>
        }

          
        </div>
      );
    }
    else{
        return(<Loading2/>);
    }
    
  }
}

export default withTracker((props) => {
    var dataReady;
    var myScore;
    var otherScore;

    var handleFeedback;

    let user = Meteor.users.findOne({_id : props.quizPerson});

    if(user){
      let userId = user._id;

      handleFeedback = Meteor.subscribe('feedback',{'from' : userId},{}, {
        onError: function (error) {
              console.log(error);
          }
      });

      if(handleFeedback.ready()){
        if(userId == Meteor.userId()){
          var myfeedback = Feedback.find({ 'from': userId , 'to' : userId }).fetch();
          myScore = calculateScore(joinFeedbacks(myfeedback));
        }else{
          var myfeedback = Feedback.find({ 'from': userId , 'to' : Meteor.userId() }).fetch();
          myScore = calculateScore(joinFeedbacks(myfeedback));
        }
        
        var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
        var qset = joinFeedbacks(otherFeedback);
    
        var validAnswers = _.filter(qset, function(question) { return question.answer });
        otherScore = calculateScore(qset);
        dataReady = true;
      }
    }
  return {
      quizUser:user,
      myScore:myScore,
      otherScore:otherScore,
      dataReady:dataReady
  };
})(RadarComparison);

