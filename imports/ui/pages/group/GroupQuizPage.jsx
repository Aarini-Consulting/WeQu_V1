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

// var defaultQuizList=[
//   {component:"MultipleChoice", question:"How often do you get compliment?", answerOptions:["one","two","three","four"] },
//   {component:"Ranker", question:"rank this stuff", rankItems:["one","two","three"] },
//   {component:"Ranker", question:"rank this stuff as well", rankItems:["I","II","III","IV"] }
// ]

var components={"MultipleChoice":MultipleChoice,"Ranker":Ranker,"OpenQuestion":OpenQuestion,"StarRating":StarRating,"StarRatingMultiple":StarRatingMultiple};

class GroupQuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedQuiz:undefined,
      getQuizResult:false,
      loading:false
    }
  }

  getQuizResult(){
    this.setState({
      getQuizResult:true
    });
  }

  quizSelect(quiz){
    if(!this.state.loading){
      //manually add group id here
      //group id is needed in one of the ranker that uses group member's name
      quiz.groupId=this.props.group._id;
      if(this.state.selectedQuiz){
        //if quiz already selected, remove it first before selecting a new one via callback
        this.setState({
          loading:true,
          selectedQuiz:undefined,
          getQuizResult:false
        },()=>{
          this.setState({
            selectedQuiz:quiz,
            loading:false
          });
        });
      }else{
        //no quiz selected so just go ahead and add one
        this.setState({
          selectedQuiz:quiz,
          getQuizResult:false
        });
      }

      Meteor.call('set.group.quiz', this.props.group._id , quiz._id,
        (err, result) => {
          if(err){
            console.log(err);
          }
      });
    }
  }

  renderQuestionList(){
    return this.props.groupQuizList.map((quiz, index) => {
      var className = "group-quiz-list-item cursor-pointer";

      if(this.state.selectedQuiz && this.state.selectedQuiz._id == quiz._id){
        className = "group-quiz-list-item selected noselect"
      }
      return(
        <div className={className} 
        key={`groupQuiz-list-${index}`} onClick={this.quizSelect.bind(this,quiz)}>
          {index+1}
        </div>
      );
    });
  }

  renderQuestionListPlaceholder(){
    var dummyQuizList=[1,2,3,4,5,6,7,8,9,10];
    return dummyQuizList.map((quiz, index) => {
      return(
        <div className={`group-quiz-list-item placeholder noselect`} key={`groupQuiz-list-${index}`}>
            #
        </div>
      );
    });
  }

  render() {
    var readySurvey;
    if(this.props.group.userIdsSurveyed && this.props.group.userIdsSurveyed.length == this.props.group.userIds.length){
      readySurvey = true;
    }
    var started = this.props.group.isActive;

    var cardPlacement = this.props.cardPlacements.length == this.props.group.userIds.length;

    var SelectedComponent;
    if(this.state.selectedQuiz && this.state.selectedQuiz.component){
      SelectedComponent = components[this.state.selectedQuiz.component];
    }

    var groupQuizContent;
    
    if(this.state.loading || !this.props.dataReady){
      return(
        <Loading/>
      )
    }else if(readySurvey && started && cardPlacement){
      if(this.props.groupQuizList && this.props.groupQuizList.length > 0){
        if(SelectedComponent){
          if(this.state.getQuizResult){
            groupQuizContent = 
            <div className="group-quiz-content">
              <h1>quiz result</h1>
            </div>
          }else{
            groupQuizContent = 
            <div className="group-quiz-content">
              <GroupQuizCmcLanding question={this.state.selectedQuiz.question} getQuizResult={this.getQuizResult.bind(this)}/>
            </div> 
          }
        }else{
          groupQuizContent = 
          <div className="group-quiz-content">
          {this.state.selectedQuiz
            ?
            "component not found"
            :
              <div>
                <div className="ring"></div>
                <h1>Select quiz number above</h1>
              </div>
          }
          </div>
        }
        return (
          <div className="tap-content-wrapper quiz">
              <div className="group-quiz-wrapper">
                <div className="group-quiz-list">
                  {this.renderQuestionList()}
                </div>
                {groupQuizContent}
              </div>
          </div>
        );
      }else{
        return (
          <div className="tap-content-wrapper quiz">
              <div className="group-quiz-wrapper">
                no group quiz found
              </div>
          </div>
        );
      }
    }
    else{
      return(
        <div className="tap-content-wrapper quiz">
          <div className="group-quiz-wrapper">
            <div className="group-quiz-list">
              {this.renderQuestionListPlaceholder()}
            </div>
            <div className="group-quiz-content">
              <div>
                <div className="ring"></div>
                <h1>You are not ready to start the quiz yet</h1>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
  }
}

export default withTracker((props) => {
  var dataReady;
  var groupQuizList=[];

  var group = props.group;
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
      groupQuizList=GroupQuiz.find({_id : {$in:group.groupQuizIdList}}).fetch();

      dataReady = true;
    }
  }else{
    dataReady = true;
  }
  return {
      groupQuizList:groupQuizList,
      dataReady:dataReady
  };
})(GroupQuizPage);

