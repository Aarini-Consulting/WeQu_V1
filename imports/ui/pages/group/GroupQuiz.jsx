import React from 'react';
import Ranker from '/imports/ui/pages/groupQuiz/Ranker';
import MultipleChoice from '/imports/ui/pages/groupQuiz/MultipleChoice';
import OpenQuestion from '/imports/ui/pages/groupQuiz/OpenQuestion';
import StarRating from '/imports/ui/pages/groupQuiz/StarRating';
import GroupQuizCmcLanding from '/imports/ui/pages/groupQuiz/GroupQuizCmcLanding';
import Loading from '/imports/ui/pages/loading/Loading';

var defaultQuizList=[
  {component:"MultipleChoice", question:"How often do you get compliment?", answerOptions:["one","two","three","four"] },
  {component:"Ranker", question:"rank this stuff", rankItems:["one","two","three"] },
  {component:"Ranker", question:"rank this stuff as well", rankItems:["I","II","III","IV"] }
]

var components={"MultipleChoice":MultipleChoice,"Ranker":Ranker,"OpenQuestion":OpenQuestion,"StarRating":StarRating};

export default class GroupQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedQuiz:undefined,
      launchSelectedQuiz:false,
      loading:false
    }
  }

  launchSelectedQuiz(){
    this.setState({
      launchSelectedQuiz:true
    });
  }

  quizSelect(quiz){
    if(!this.state.loading){
      if(this.state.selectedQuiz){
        //if quiz already selected, remove it first before selecting a new one via callback
        this.setState({
          loading:true,
          selectedQuiz:undefined,
          launchSelectedQuiz:false
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
          launchSelectedQuiz:false
        });
      }
    }
  }

  renderQuestionListSideBar(){
    return defaultQuizList.map((quiz, index) => {
      return(
        <div key={`groupQuiz-sidebar-${index}`} onClick={this.quizSelect.bind(this,quiz)}>
          {index}
        </div>
      );
    });
  }

  render() {
    var SelectedComponent;
    if(this.state.selectedQuiz && this.state.selectedQuiz.component){
      SelectedComponent = components[this.state.selectedQuiz.component];
    }

    var groupQuizContent;
    
    if(this.state.loading){
      return(
        <Loading/>
      )
    }else{
      if(SelectedComponent){
        if(this.state.launchSelectedQuiz){
          groupQuizContent = 
          <div className="group-quiz-content">
            <SelectedComponent {...this.state.selectedQuiz}/>
          </div>
        }else{
          groupQuizContent = 
          <div className="group-quiz-content">
            <GroupQuizCmcLanding question={this.state.selectedQuiz.question} launchQuiz={this.launchSelectedQuiz.bind(this)}/>
          </div> 
        }
      }else{
        groupQuizContent = 
        <div className="group-quiz-content">
        {this.state.selectedQuiz
          ?
          "component not found"
          :
          "group quiz welcome"
        }
        </div>
      }
      return (
        <div className="tap-content-wrapper">
            <div className="group-quiz-wrapper">
              <div className="group-quiz-sidebar">
                {this.renderQuestionListSideBar()}
              </div>
              {groupQuizContent}
            </div>
        </div>
    );
    }
    
  }
}
