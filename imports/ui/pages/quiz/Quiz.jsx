import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import InviteLandingSuccess from '/imports/ui/pages/invitationLanding/InviteLandingSuccess';

class Quiz extends React.Component {
  constructor(props){
      super(props);
      this.state={
        currentFeedback:undefined,
        currentQuestion:undefined,
        currentQuestionIndex:-1,
        questionTotal:0,
        showSummary:false,
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
    if(this.props.currentUser && this.props.currentUser.profile.loginScript != 'init' && this.props.feedback){
      this.getCurrentQuestion(this.props);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.feedback){
      var current = this.getCurrentQuestion(nextProps);
      if(this.props.inviteLanding && !current){
        this.setState({
          showSummary: true,
        });
      }
    }
  }

  getCurrentQuestion(props){
    var currentFeedback;
    if(!this.state.currentFeedback || 
      (props.feedback.from === this.state.currentFeedback.from &&
        props.feedback.to === this.state.currentFeedback.to)){
      currentFeedback = props.feedback;

      this.setState({
        currentFeedback: currentFeedback,
        username: props.username
      });
    }else{
      currentFeedback = props.feedbacksArray.find(
        (fa)=>{
          return (
            fa.from === this.state.currentFeedback.from && fa.to === this.state.currentFeedback.to 
          )}
        );
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
          // this.setState({
          //   showSummary: false,
          // });
          return false;
        }
        
      })

    }

    
  }

  renderAnswerList(answers) {
    return answers.map((answer) => {
      return (
        <li className="answer" key={answer._id} id={answer._id} data-skill={answer.skill} onClick={this.answerQuestion.bind(this, answer)}>{answer.text}</li>
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
      return !question.answer;
    })

    if(!next && !feedback.done){
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
        {$set : { "profile.gender": event.target.getAttribute('id') }});
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

  cycleFeedbackForward(bool){
    if(this.state.currentFeedback && this.props.feedbacksArray && this.props.feedbacksArray.length > 0){
      var currentFeedback;
      var currentIndex = this.props.feedbacksArray.map((fa)=>{return fa._id}).indexOf(this.state.currentFeedback._id);
      if(bool) {
        if(this.state.currentFeedback._id === this.props.feedback._id){
          currentFeedback = this.props.feedbacksArray[0];
        }
        else if(currentIndex + 1 < this.props.feedbacksArray.length){
          currentFeedback = this.props.feedbacksArray[currentIndex + 1];
        }else{
          currentFeedback = this.props.feedback;
        }
      }else{
        if(this.state.currentFeedback._id === this.props.feedback._id){
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
      
      this.setState({ currentFeedback: currentFeedback, username:(user ? getUserName(user.profile) : undefined)}, () => {
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
            <section className={"gradient"+(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.gradient)+" whiteText alignCenter"}>
              <h2 style={{width:65+'%'}}>
              Well done!<br/>
              <a onClick={()=>{this.setState({showSummary: false});}}>Answer more question</a>
              </h2>
              {/* <img src="/img/next.png" id="next" style={{width:60+'px', marginTop:30+'%'}}/> */}
  
              <h2 style={{width:65+'%'}}>
              <Link to="/invite">Invite other people</Link>
              </h2>
              {/* <img src="/img/next.png" id="next" style={{width:60+'px', marginTop:30+'%'}}/> */}
          </section>
          );
        }
      }
      else{
        return (
          <section className={"vote gradient" + ( (!this.props.inviteLanding && this.props.currentUser.profile.gradient) ? this.props.currentUser.profile.gradient : '')}>
            <section className="person">
              {this.props.feedbacksArray && this.props.feedbacksArray.length > 0 &&
                <div>
                  <a id="prevPerson" style={{visibility:'visible'}} onClick={this.cycleFeedbackForward.bind(this, false)}>
                  <img src="/img/left.png" className="nav"/>
                  </a>
                </div>
              }
              <div className="h4" id="specificUser">
                <div>
                  {this.state.currentFeedback 
                  ?
                    this.state.currentFeedback.groupName
                  :
                    ''
                  }
                </div>
                {/* <img src="{{pictureUrl to}}" className="avatar" id="specificUser" data-filter-id="{{userId}}"> */}
                <img src="/img/avatar.png" className="avatar" id="specificUser"/>
      
                <br/>
                {this.state.username }
              </div>
              {this.props.feedbacksArray && this.props.feedbacksArray.length > 0 &&
              <div>
                <a id="nextPerson" style={{visibility:'visible'}} onClick={this.cycleFeedbackForward.bind(this, true)}>
                <img src="/img/right.png" className="nav"/>
                </a>
              </div>
              }
            </section>
            
            {this.state.currentFeedback && this.state.currentQuestion &&
            <section>
              <div className="question">
                <h2>{this.state.currentQuestion.text}</h2>
              </div>
              <ul className="answers">
                {this.renderAnswerList(this.state.currentQuestion.answers)}
              </ul>
              <div className="statusBar">
                <div>Question {this.state.currentQuestionIndex + 1} of {this.state.questionTotal}</div>
                {//if not question to self, allow to skip
                  !(this.state.currentFeedback && this.state.currentFeedback.from == this.state.currentFeedback.to) &&
                  <div><a className="skip" onClick={this.skip.bind(this, this.state.currentQuestion, this.state.currentQuestionIndex)}>Skip this question</a></div>
                }
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
    handleFeedback = Meteor.subscribe('feedback', { 'from': Meteor.userId(), 'to' : props.quizUser._id, done: false }, {}, {
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
      if(!props.quizUser){
        feedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false });
        feedbacksArray = Feedback.find({
          $and : [
            {to:{$ne:Meteor.userId()}} 
            ]
          }).fetch();

        usersArray = Meteor.users.find({
          _id:{$in:feedbacksArray.map((fa)=>{return fa.to;})}
        }).fetch();
      }else{
        feedback = Feedback.findOne();
      }
    }

    username = getUserName(user.profile);
    dataReady = true;
  }
   
  return {
      currentUser: Meteor.user(),
      username: username,
      usersArray:usersArray,
      connections:connections,
      feedback: feedback,
      feedbacksArray:feedbacksArray,
      dataReady:dataReady,
  };
})(Quiz);
