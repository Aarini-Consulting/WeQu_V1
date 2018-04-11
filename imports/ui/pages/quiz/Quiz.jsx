import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import InviteLandingSuccess from '/imports/ui/pages/invitationLanding/InviteLandingSuccess';
import QuizSummary from './QuizSummary';

import {color} from '/imports/startup/client/color';

class Quiz extends React.Component {
  constructor(props){
      super(props);
      this.state={
        currentFeedback:undefined,
        currentQuestion:undefined,
        currentQuestionIndex:-1,
        questionTotal:0,
        showSummary:false,
        user:undefined,
        username:undefined
      }
  }

  componentDidMount(){
    if( this.props.currentUser && this.props.currentUser.profile.loginScript == 'init'){
            if(this.props.currentUser && !this.props.feedback){
                Meteor.call('gen-question-set', Meteor.userId(), function (err, result) {
                  if(err){
                    console.log('gen-question-set', err, result);
                  }else{
                    setLoginScript('quiz');
                  }
              });        
            }
    }
    if(((this.props.currentUser && this.props.currentUser.profile.loginScript != 'init') || this.props.inviteLanding)  && this.props.feedback){
      var current = this.getCurrentQuestion(this.props);
      if(!current){
        this.setState({
          showSummary: true,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.feedback){
      var current = this.getCurrentQuestion(nextProps);
      if(!this.state.showSummary && this.props.inviteLanding && !current){
        this.setState({
          showSummary: true,
        });
      }
    }
  }

  resetCurrentQuiz(props){
    this.setState({
      showSummary: false,
      currentQuestion:undefined,
      currentQuestionIndex:-1,
      questionTotal:0,
    },()=>{
      var current = this.getCurrentQuestion(props);
    });
    
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.dataReady){
      return true;
    }else{
      return false;
    }
  }

  getCurrentQuestion(props){
    var currentFeedback;
    if(!this.state.currentFeedback || 
      (props.feedback.from === this.state.currentFeedback.from &&
        props.feedback.to === this.state.currentFeedback.to &&
        props.feedback.groupId === this.state.currentFeedback.groupId)){
      currentFeedback = props.feedback;

      this.setState({
        currentFeedback: currentFeedback,
        user:props.user,
        username: props.username
      });
    }else{
      currentFeedback = props.feedbacksArray.find(
        (fa)=>{
          return (
            fa.from === this.state.currentFeedback.from && fa.to === this.state.currentFeedback.to &&
            fa.groupId === this.state.currentFeedback.groupId
          )}
        );
      if(currentFeedback){
        this.setState({
          currentFeedback: currentFeedback
        });
      }
    }

    if(!currentFeedback){
      return false
    }else{
      //find question from qset that don't have answer yet
      return currentFeedback.qset.find((question, index, qset)=>{
        if(!question.answer && question.answer !== false){
          this.setState({
            currentQuestion: question,
            currentQuestionIndex:index,
            questionTotal:qset.length
          });
          return !question.answer;
        }else{
          return false;
        }
      })
    }
  }

  renderAnswerList(answers) {
    return answers.map((answer) => {
      var name="";
      for (var categoryName in framework) {
        if(framework[categoryName].indexOf(answer.skill) > -1){
          name = categoryName;
        }
      }

      return (
        <li className={"answer " + name.toString().toLowerCase() + " cursor-pointer"} key={answer._id} onClick={this.answerQuestion.bind(this, answer)}>
        {answer.text}
        </li>
      );
    });
  }

  answerQuestion(answer, event){
    event.preventDefault();
    var feedback = this.state.currentFeedback;
    var question = this.state.currentQuestion;
    var index = this.state.currentQuestionIndex;
   
    if(answer){
      question.answer = answer._id;
    }else{
      question.answer = false;
    }
    feedback.qset[index] = question;

    var next = feedback.qset.find((question, index, qset)=>{
      return !question.answer && question.answer !== false;
    })

    if(!next){
      feedback.done = true;
      if(this.props.inviteLanding || this.props.currentUser.profile.loginScript == 'finish'){
        this.setState({
          showSummary: true,
        });
      }
    }

    if(answer && answer.skill == "genderId")
    {
      Meteor.users.update({_id: Meteor.userId()},
        {$set : { "profile.gender": answer._id }});
    }

    Meteor.call('feedback.answer.question', feedback , (err, result) => {
      if(err){
        console.log(err);
        this.setState({
          showSummary: false,
        });
      }else if(this.props.currentUser && this.props.currentUser.profile.loginScript != 'finish' && feedback.done){
        setLoginScript('after-quiz');
      }
    });
  }
  
  skip(question,index,event){
    this.answerQuestion(null,event);
  }

  // getLinkedInInfo(){
  //   if(this.props.currentUser && this.props.currentUser._id == Meteor.userId()){
  //     var pathname = "linkedin-handler"
  //     this.props.history.push(`/linkedin-permission/${pathname}`);
  //   }
  // }

  cycleFeedbackForward(bool){
    if(this.state.currentFeedback && this.props.feedbacksArray && this.props.feedbacksArray.length > 0){
      var currentFeedback;
      var currentIndex = this.props.feedbacksArray.findIndex((fb)=>{
        return (fb.from === this.state.currentFeedback.from &&
                fb.to === this.state.currentFeedback.to &&
                fb.groupId === this.state.currentFeedback.groupId)
      })
      if(bool) {
        if(currentIndex < 0){
          currentFeedback = this.props.feedbacksArray[0];
        }
        else if(currentIndex + 1 < this.props.feedbacksArray.length){
          currentFeedback = this.props.feedbacksArray[currentIndex + 1];
        }else{
          currentFeedback = this.props.feedback;
        }
      }else{
        if(currentIndex < 0){
          currentFeedback = this.props.feedbacksArray[this.props.feedbacksArray.length - 1];
        }
        else if(currentIndex - 1 >= 0){
          currentFeedback = this.props.feedbacksArray[currentIndex - 1];
        }
        else{
          currentFeedback = this.props.feedback;
        }
      }

      var user = this.props.usersArray.find((user)=>{return user._id === currentFeedback.to});
      
      this.setState({ 
        showSummary:false,
        currentFeedback: currentFeedback, 
        user:user,
        username:(user ? getUserName(user.profile) : undefined)}, () => {
        this.getCurrentQuestion(this.props);
      });
    }
  }

  render() {
    if(this.props.dataReady){
      if(this.state.showSummary){
        if(this.props.inviteLanding){
          return (
            <InviteLandingSuccess feedback={this.props.feedback} quizUser={this.props.quizUser}/>
          );
        }else{
          return (
            <QuizSummary quizUser={this.props.quizUser} 
            quizPerson={this.state.user}
            feedback={this.state.currentFeedback}
            continue={()=>{this.resetCurrentQuiz(this.props);}}
            next={this.cycleFeedbackForward.bind(this, true)}/>
          );
        }
      }
      else{
        return (
          <section className="quiz-section">
            <div className="sectionname">
            <div className="profilename w-container">
              {!this.props.quizUser && this.props.feedbacksArray && this.props.feedbacksArray.length > 0 &&
                this.props.currentUser && this.props.currentUser.profile.loginScript == 'finish' &&
                <div className="left profileclick">
                  <a id="prevPerson" style={{visibility:'visible'}} onClick={this.cycleFeedbackForward.bind(this, false)}>
                  <img src="/img/left.png" className="profilearrow" height="80"/>
                  </a>
                </div>
              }
              <div className="profilefac">
                <div className="div-q-face">
                  {this.state.user && this.state.user.profile && this.state.user.profile.pictureUrl
                    ? <img src={this.state.user.profile.pictureUrl} className={"avatarprofile "+ this.state.user.profile.pictureShape}/>
                    : <img src="/img/avatar.png" className="avatarprofile"/>
                  }
                  {/* {this.state.user && this.props.currentUser._id == this.state.user._id && this.state.user.profile && !this.state.user.profile.linkedIn 
                  ? 
                  <div className="bttn-linkedin w-clearfix" onClick={this.getLinkedInInfo.bind(this)}>
                    <div className="icon-camera"></div>
                    <div className="text-block-3">from</div>
                    <div className="logo-linkedin"></div>
                  </div>
                  :
                  ""
                  } */}
                </div>
                <div className="fontreleway f-q-username">
                  {this.state.username }
                </div>

                <div className="fontreleway f-q-username f-q-groupname" 
                style={{visibility:(this.state.currentFeedback && this.state.currentFeedback.groupName) ? 'visible' :'hidden'}}>
                  {this.state.currentFeedback && this.state.currentFeedback.groupName}
                </div>
              </div>
              {!this.props.quizUser && this.props.feedbacksArray && this.props.feedbacksArray.length > 0 &&
                this.props.currentUser && this.props.currentUser.profile.loginScript == 'finish' &&
                <div className="profileclick right">
                <a id="nextPerson" style={{visibility:'visible'}} onClick={this.cycleFeedbackForward.bind(this, true)}>
                <img src="/img/right.png" className="profilearrow" height="80"/>
                </a>
              </div>
              }
              </div>
            </div>
            {this.state.currentFeedback && this.state.currentQuestion &&
            <div className="question noselect fontreleway">
              {this.state.currentQuestion.text}
            </div>
            }
            {this.state.currentFeedback && this.state.currentQuestion &&
            <section className="fontreleway question-answer">
              <div className="fontreleway question-answer-anchor">
              <ul className="answers noselect" onTouchStart={()=>{}}>
                {this.renderAnswerList(this.state.currentQuestion.answers)}
              </ul>
              <div className="statusBar noselect">
                <div>Question {this.state.currentQuestionIndex + 1} of {this.state.questionTotal}</div>
                {//if not question to self, allow to skip
                  !(this.state.currentFeedback && this.state.currentFeedback.from == this.state.currentFeedback.to) &&
                  <div><a className="skip cursor-pointer" onClick={this.skip.bind(this, this.state.currentQuestion, this.state.currentQuestionIndex)}>Skip this question</a></div>
                }
              </div>
              </div>
            </section>
            }

            {!this.state.currentFeedback &&
            <section>
              <div className="question">
                <h2>You have no quiz set for this user</h2>
              </div>
            </section>
            }
    
          </section>
        );
      }
    }else{
      return(
        <Loading/>
      );
  }
    
  }
}

export default withTracker((props) => {
  var dataReady;
  var feedback;
  var feedbacksArray;
  var connections;
  var username;
  var handleFeedback;
  var handleConnections
  var user;
  var usersArray;
    
  if(props.inviteLanding && props.feedback){
    feedback = props.feedback;
    user = props.quizUser;

  }
  else if(props.quizUser){
    handleFeedback = Meteor.subscribe('feedback', 
    {
      $or : [ 
      {from:Meteor.userId()},
      {to:Meteor.userId()} 
      ], 
      done: false }, 
    
    {}, 
    {
      onError: function (error) {
              console.log(error);
          }
      });
    user = props.quizUser;
    
  }else{
    handleFeedback = Meteor.subscribe('feedback', 
    {
      $or : [ 
      {from:Meteor.userId()},
      {to:Meteor.userId()} 
      ], 
      done: false }, 
    
    {}, 
    {
      onError: function (error) {
              console.log(error);
          }
      });
    user = Meteor.user();
  }

  

  if((props.feedback || (handleFeedback && handleFeedback.ready()))){
    if(!props.feedback){
      feedbacksArray = Feedback.find({
        done: false,
        $and : [
          {to:Meteor.userId()},
          {from:{$ne:Meteor.userId()}} 
          ],
        $and : [
          {from:Meteor.userId()},
          {to:{$ne:Meteor.userId()}} 
          ],
        },
      { sort: { _id: -1 }}).fetch()
      .filter((fb, index, fa)=>{
        return index == fa.findIndex((fb2)=>{
          return (fb2.to === fb.to && fb2.from === fb.from && fb2.groupId === fb.groupId);
        })
      });

      if(props.quizUser){
        feedback = feedbacksArray.find((fb, index, fa)=>{
          if(props.group){
            return (fb.from == Meteor.userId() && fb.to == props.quizUser._id 
            &&  fb.groupId == props.group._id && fb.done == false);
          }else{
            return (fb.from == Meteor.userId() && fb.to == props.quizUser._id 
            &&  !fb.groupId && fb.done == false);
          }
        })
      }else{
        feedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false });
      }
      
      var handleUsers = Meteor.subscribe('users',{
          _id:{$in:feedbacksArray.map((fa)=>{return fa.to;})}
        },{}, {
        onError: function (error) {
                console.log(error);
            }
      });
      if(handleUsers.ready()){
        usersArray = Meteor.users.find({
          _id:{$in:feedbacksArray.map((fa)=>{return fa.to;})}
        }).fetch();

        dataReady = true;
      }
    }else{
      dataReady = true;
    }
    username = getUserName(user.profile);
  }
   
  return {
      currentUser: Meteor.user(),
      user:user,
      username: username,
      usersArray:usersArray,
      connections:connections,
      feedback: feedback,
      feedbacksArray:feedbacksArray,
      dataReady:dataReady,
  };
})(Quiz);
