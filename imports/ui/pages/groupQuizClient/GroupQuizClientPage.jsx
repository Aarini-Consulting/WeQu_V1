import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Ranker from '/imports/ui/pages/groupQuiz/Ranker';
import MultipleChoice from '/imports/ui/pages/groupQuiz/MultipleChoice';
import OpenQuestion from '/imports/ui/pages/groupQuiz/OpenQuestion';
import StarRating from '/imports/ui/pages/groupQuiz/StarRating';
import StarRatingMultiple from '/imports/ui/pages/groupQuiz/StarRatingMultiple';
import GroupQuizCmcLanding from '/imports/ui/pages/groupQuiz/GroupQuizCmcLanding';
import Loading from '/imports/ui/pages/loading/Loading';


var components={"MultipleChoice":MultipleChoice,"Ranker":Ranker,"OpenQuestion":OpenQuestion,"StarRating":StarRating,"StarRatingMultiple":StarRatingMultiple};

class GroupQuizClientPage extends React.Component {
  render() {
    if(this.props.dataReady){
        if(this.props.groupQuiz){
            var quizData = trhis.props.groupQuiz;
            quizData.groupId=this.props.group._id;

            var SelectedComponent = components[quizData.component];

            return (
                <div className="fillHeight">
                    <section className="section summary fontreleway weq-bg">
                    <SelectedComponent {...quizData}/>
                    </section>
                </div>
            );
        }else{
            return (
                <div className="fillHeight">
                    <section className="section summary fontreleway weq-bg">
                    selected quiz not found
                    </section>
                </div>
            );
        }
        
    }else{
        <Loading/>
    }
    
  }
}

export default withTracker((props) => {
    var dataReady;
    var group = props.group;
    var groupQuiz;
    if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
        var handleGroupQuiz = Meteor.subscribe('groupQuiz',
        {
          "_id" : {$in:group.groupQuizIdList}
        },{}, {
          onError: function (error) {
                console.log(error);
            }
        });
  
        if(handleGroupQuiz.ready()){
          groupQuiz=GroupQuiz.findOne({_id : {$in:group.currentGroupQuizId}});
  
          dataReady = true;
        }
    }else{
        dataReady = true;
    }

    
  return {
      dataReady:dataReady,
      groupQuiz:groupQuiz
  };
})(GroupQuizClientPage);
