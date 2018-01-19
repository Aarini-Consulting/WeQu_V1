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
        currentQuestion:undefined,
        currentQuestionIndex:-1,
        questionTotal:0,
        showSummary:false
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
      var current = this.getCurrentQuestion(nextProps)
      if(this.props.inviteLanding && !current){
        this.setState({
          showSummary: true,
        });
      }
    }
  }

  getCurrentQuestion(props){
    //find question from qset that don't have answer yet
    return props.feedback.qset.find((question, index, qset)=>{
      if(!question.answer && question.answer !== false){
        this.setState({
          currentQuestion: question,
          currentQuestionIndex:index,
          questionTotal:qset.length
        });
        return !question.answer;
      }else{
        this.setState({
          showSummary: false,
        });
        return false;
      }
      
    })
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
    var feedback = this.props.feedback;
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
      
      // console.log(feedback);
    }

    if(answer && answer.skill == "genderId")
    {
      Meteor.users.update({_id: Meteor.userId()},
        {$set : { "profile.gender": event.target.getAttribute('id') }});
    }

    Meteor.call('feedback.answer.question.self', feedback , (err, result) => {
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
              {/* <div>
                <a id="prevPerson" style="visibility:{{#if prevPerson}}visible{{else}}hidden{{/if}}">
                <img src="/img/left.png" className="nav"/>
                </a>
              </div> */}
              <div className="h4" id="specificUser">
                <div>
                  {this.props.feedback 
                  ?
                    this.props.feedback.groupName
                  :
                    ''
                  }
                </div>
                {/* <img src="{{pictureUrl to}}" className="avatar" id="specificUser" data-filter-id="{{userId}}"> */}
                <img src="/img/avatar.png" className="avatar" id="specificUser"/>
      
                <br/>
                {this.props.username }
              </div>
              {/* <div>
                <a id="nextPerson" style="visibility:{{#if nextPerson}}visible{{else}}hidden{{/if}}">
                <img src="/img/right.png" className="nav"/>
                </a>
              </div> */}
            </section>
            
            {this.props.feedback && this.state.currentQuestion &&
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
                  !(this.props.feedback.from == this.props.feedback.to) &&
                  <div><a className="skip" onClick={this.skip.bind(this, this.state.currentQuestion, this.state.currentQuestionIndex)}>Skip this question</a></div>
                }
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
  var username;
  var handle = Meteor.subscribe('feedback', {
      onError: function (error) {
              console.log(error);
          }
      });
  
  if(handle.ready()){
    
    if(props.inviteLanding && props.feedback){
      feedback = props.feedback;
      username = getUserName(props.quizUser.profile);
    }
    else if(props.quizUser){
      feedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : props.quizUser._id, done: false });
      username = getUserName(props.quizUser.profile);
      
    }else{
      feedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false });
      username =  getUserName(Meteor.user().profile);
    }
    
    dataReady = true;
  }
   
  return {
      currentUser: Meteor.user(),
      username: username,
      feedbacks: Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId()}).fetch(),
      feedback: feedback,
      dataReady:dataReady,
  };
})(Quiz);
