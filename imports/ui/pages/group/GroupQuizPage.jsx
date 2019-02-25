import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {quizComponent} from '/imports/startup/client/quizComponent';
import GroupQuizCmcLanding from '/imports/ui/pages/groupQuiz/GroupQuizCmcLanding';
import Loading from '/imports/ui/pages/loading/Loading';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import GroupQuizResult from '../groupQuiz/GroupQuizResult';

// var defaultQuizList=[
//   {component:"MultipleChoice", question:"How often do you get compliment?", answerOptions:["one","two","three","four"] },
//   {component:"Ranker", question:"rank this stuff", rankItems:["one","two","three"] },
//   {component:"Ranker", question:"rank this stuff as well", rankItems:["I","II","III","IV"] }
// ]

class GroupQuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showConfirmStart:false,
      selectedQuizOnConfirm:undefined,
      selectedQuiz:undefined,
      selectedQuizResult:undefined,
      getQuizResult:false,
      loading:false
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataReady){
      this.setDefaultSelected(nextProps);
    }
  }

  setDefaultSelected(props){
    var currentGroupQuizId = props.group.currentGroupQuizId;
    if(currentGroupQuizId){
      if((this.state.selectedQuiz && this.state.selectedQuiz._id != currentGroupQuizId) || !this.state.selectedQuiz){

        var newSelectedQuiz = props.groupQuizList.find((gq)=>{
          return gq._id == currentGroupQuizId;
        })

        if(newSelectedQuiz){
          newSelectedQuiz.groupId=props.group._id;
          this.setState({
            selectedQuiz:newSelectedQuiz
          });
        }
      }
    }else{
      this.setState({
        selectedQuiz:undefined
      });
    }
  }

  getQuizResult(){
    this.setState({
      getQuizResult:true
    });
  }

  quizSelectCheck(quiz){
    if(!this.state.loading){
      if(!this.props.group.currentGroupQuizId){
        this.setState({
          showConfirmStart:true,
          selectedQuizOnConfirm:quiz
        });
      }else{
        this.quizSelect(quiz);
      }
    }
  }
  

  quizSelect(quiz){
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
          loading:false,
          selectedQuizOnConfirm:undefined
        });
      });
    }else{
      //no quiz selected so just go ahead and add one
      this.setState({
        selectedQuiz:quiz,
        getQuizResult:false,
        selectedQuizOnConfirm:undefined
      });
    }

    Meteor.call('set.group.quiz', this.props.group._id , quiz._id,
      (err, result) => {
        if(err){
          console.log(err);
        }
    });
  }

  renderQuestionList(){
    return this.props.groupQuizList.map((quiz, index) => {
      var className = "group-quiz-list-item cursor-pointer";

      if(this.state.selectedQuiz && this.state.selectedQuiz._id == quiz._id){
        className = "group-quiz-list-item selected noselect"
      }
      return(
        <div className={className} 
        key={`groupQuiz-list-${index}`} onClick={this.quizSelectCheck.bind(this,quiz)}>
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

    var SelectedComponent;
    if(this.state.selectedQuiz && this.state.selectedQuiz.component){
      SelectedComponent = quizComponent(this.state.selectedQuiz.component);
    }

    var groupQuizContent;
    
    if(this.state.loading || !this.props.dataReady){
      return(
        <Loading/>
      )
    }else if(readySurvey){
      if(this.props.groupQuizList && this.props.groupQuizList.length > 0){
        if(SelectedComponent){
          if(this.state.getQuizResult){
            groupQuizContent = 
            <div className="group-quiz-content white-bg-color">
              <GroupQuizResult
              selectedQuiz={this.state.selectedQuiz}
              selectedQuizResult={this.props.selectedGroupQuizDataList}
              audienceResponseCount={this.props.selectedGroupQuizDataList.length}
              totalParticipant={this.props.group.userIds.length}/>
            </div>
          }else{
            groupQuizContent = 
            <div className="group-quiz-content white-bg-color">
              <GroupQuizCmcLanding
              question={this.state.selectedQuiz.question} 
              backgroundUrl={this.state.selectedQuiz.backgroundUrl} 
              getQuizResult={this.getQuizResult.bind(this)}
              audienceResponseCount={this.props.selectedGroupQuizDataList.length}
              totalParticipant={this.props.group.userIds.length}
              />
            </div> 
          }
        }else{
          groupQuizContent = 
          <div className="group-quiz-content white-bg-color">
          {this.state.selectedQuiz
            ?
            "component not found"
            :
              <div>
                <div className="ring"></div>
                <h1>Select quiz number above</h1>
              </div>
          }

          {this.state.showConfirmStart &&
            <SweetAlert
            type={"confirm"}
            message={"Are the participants all present and ready?"}
            confirmText={"Let's go!"}
            cancelText={"Cancel"}
            onCancel={() => {
                this.setState({ showConfirmStart: false });
            }}
            onConfirm={() => {
              this.setState({ showConfirmStart: false });
              this.quizSelect(this.state.selectedQuizOnConfirm);
            }}/>
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
              <div className="group-quiz-list">
                {this.renderQuestionListPlaceholder()}
              </div>
              <div className="group-quiz-content white-bg-color">
                <div>
                  <div className="ring"></div>
                  <h1>no group quiz found, please contact WeQ support</h1>
                </div>
              </div>
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
            <div className="group-quiz-content white-bg-color">
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
  var selectedGroupQuizDataList=[]

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

      var handleGroupQuizData = Meteor.subscribe('groupQuizData',
      {
        "groupId": group._id,
      },{}, {
        onError: function (error) {
              console.log(error);
          }
      });

      if(handleGroupQuizData.ready()){
        if(group.currentGroupQuizId){
          selectedGroupQuizDataList=GroupQuizData.find({
            "groupId": group._id,
            "groupQuizId": group.currentGroupQuizId
          }).fetch();  
        }
        
        dataReady = true;
      }
    }
  }else{
    dataReady = true;
  }
  return {
      groupQuizList:groupQuizList,
      selectedGroupQuizDataList:selectedGroupQuizDataList,
      dataReady:dataReady
  };
})(GroupQuizPage);