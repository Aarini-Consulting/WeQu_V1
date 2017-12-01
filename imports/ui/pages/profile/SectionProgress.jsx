import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class SectionProgress extends React.Component {
  render() {
      if(this.props.dataReady){
        if(this.props.quizPerson == Meteor.userId()){
            return (
                <div className="sectionprogress" id="sectionprogress">
                    <div className="row w-row webflow-row">
                        <div className="columprogress w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6"><span className="fontmyself fontreleway progressnumber">{this.props.myAnsweredQuestionSet}</span>
                        <div className="fontprogress fontreleway fontwidthmobile small">Answers by myself</div>
                        </div>
                        <div className="w-col w-col-6 w-col-medium-6 w-col-small-6 w-col-tiny-6"><span className="font2 fontothers fontreleway progressnumber">{this.props.inviteesMyAnsweredQuestionSet}</span>
                        <div className="fontprogress fontreleway small">Answers by others</div>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
            <div className="sectionprogress" id="sectionprogress">
                <div className="row w-row webflow-row">
                <div className="columprogress w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4"><span className="fontmyself fontreleway progressnumber">{this.props.quizPersonAnsweredQuestionSet}</span>
                    <div className="fontprogress fontreleway fontwidthmobile small">Answers by {}</div>
                </div>
                <div className="columprogress w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4"><span className="fontothers fontreleway progressnumber">{this.props.myQuizPersonAnsweredQuestionSet}</span>
                    <div className="fontprogress fontreleway small">Answers by myself</div>
                </div>
                <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4"><span className="font2 fontothers fontreleway progressnumber">{this.props.inviteesQuizPersonAnsweredQuestionSet}</span>
                    <div className="fontprogress fontreleway small">Answers by others</div>
                </div>
                </div>
            </div>
            );
        }
      }else{
        return(
            <Loading2/>
          );
      }
  }
}

export default withTracker((props) => {
    var dataReady;
    var userId;

    var quizUser;

    var handle = Meteor.subscribe('feedback', {
        onError: function (error) {
                console.log(error);
            }
        });

    if(Meteor.user() && handle.ready()){
        quizUser = Meteor.users.findOne({_id : props.quizPerson});
        userId = quizUser._id;
        dataReady = true;
    }
    return {
        myAnsweredQuestionSet:Feedback.find({from: Meteor.userId(), to: Meteor.userId(),done:true}).count(),
        inviteesMyAnsweredQuestionSet:Feedback.find({to: Meteor.userId(),done:true, from: {'$ne': Meteor.userId()}}).count(),
        quizPersonAnsweredQuestionSet:Feedback.find({from: userId, to: userId, done:true}).count(),
        myQuizPersonAnsweredQuestionSet:Feedback.find({from: Meteor.userId(), to: userId,done:true}).count(),
        inviteesQuizPersonAnsweredQuestionSet:Feedback.find({to: userId,done:true, from: {$nin:[userId,Meteor.userId()]}}).count(),
        currentUser: Meteor.user(),
        quizUser: quizUser,
        dataReady:dataReady
    };
})(SectionProgress);

