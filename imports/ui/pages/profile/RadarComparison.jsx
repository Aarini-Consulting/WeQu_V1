import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading2 from '/imports/ui/pages/loading/Loading2';
import Radar from './Radar';
import RadarD3 from './RadarD3';

class RadarComparison extends React.Component {
  render() {
    if(this.props.dataReady){
      return (
        <div className="w-block cream">
        <section className="ptb_h1 fontreleway">
          <img src="/img/icon_overview.png" className="titleIcon"/>
          <h3 className="fontreleway">Comparisons</h3>
          <RadarD3 myPoints={this.props.myScore} otherPoints={this.props.otherScore}/>
        </section>
        {this.props.quizPerson == Meteor.userId()
        ?
          <section>
            <div className="radarAgenda">
              <div><img src="/img/Diamond_Myself.png"/>
                <span className="marginleft10 font-small my-color">  
                  How I see myself  
                </span>
              </div>
              <div><img src="/img/Diamond_Others.png" className="t50"/>
                <span className="marginleft10 font-small other-color">
                  How others see me
                </span> 
              </div>
            </div>
          </section>
        :
          <section>
            <div className="radarAgenda">
              <div><img src="/img/Diamond_Myself.png"/>
                <span className="marginleft10 font-small my-color">  
                  How <span className="text-capitalize"> {getUserName(this.props.quizUser.profile)}</span> sees me  
                </span>
              </div>
              <div><img src="/img/Diamond_Others.png" className="t50"/>
                <span className="marginleft10 font-small other-color">
                  How I see <span className="text-capitalize">{getUserName(this.props.quizUser.profile)}</span> 
                </span> 
              </div>
            </div>
          </section>
        }

        {this.props.quizPerson == Meteor.userId() &&
          <div className="divbttn" id="finish">
            <Link to="/invite" className="fontbttn profilebttn w-button">
            invite teammates to explore and compare your attributes
            </Link>
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
    var user;

    var handleFeedback;
    var handleUsers = Meteor.subscribe('users',{_id : props.quizPerson},{}, {
      onError: function (error) {
              console.log(error);
          }
    });

    if(handleUsers.ready()){
      user = Meteor.users.findOne({_id : props.quizPerson});

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
      }else{
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

