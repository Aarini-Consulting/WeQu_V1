import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from './loading/Loading';

class Quiz extends React.Component {
  constructor(props){
      super(props);
      this.state={
        currentQuestion:undefined,
        currentQuestionIndex:-1,
        questionTotal:0
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

  componentWillReceiveProps(nextProps, nextState){
    if(nextProps.feedback){
      this.getCurrentQuestion(nextProps);
    }
  }

  getCurrentQuestion(props){
    console.log(props.feedback);
    //find question from qset that don't have answer yet
    props.feedback.qset.find((question, index, qset)=>{
      if(!question.answer){
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

  renderAnswerList(answers) {
    return answers.map((answer) => {
      return (
        <li className="answer" key={answer._id} id={answer._id} data-skill={answer.skill} onClick={this.answerQuestion.bind(this, answer)}>{answer.text}</li>
      );
    });
  }

  answerQuestion(answer, event){
    event.preventDefault();
    console.log(answer);
    console.log(this.state.currentQuestion);
    var feedback = this.props.feedback;
    var question = this.state.currentQuestion;
    var index = this.state.currentQuestionIndex;

    question.answer = answer._id;
    feedback.qset[index] = question;

    var next = feedback.qset.find((question, index, qset)=>{
      return !question.answer;
    })

    console.log(next);

    if(!next && !feedback.done){
      feedback.done = true;
    }

    if(answer.skill == "genderId")
    {
      Meteor.users.update({_id: Meteor.userId()},
        {$set : { "profile.gender": event.target.getAttribute('id') }});
    }

    Meteor.call('feedback.answer.question.self', feedback , (err, result) => {
      if(err){
        console.log(err);
      }else if(feedback.done){
        setLoginScript('after-quiz');
      }
    });
  }
  
  skip(question,index,event){
    event.preventDefault();
    console.log(question);
    console.log(index);
  } 

  render() {
    if(this.props.dataReady){
      return (
        <section className={"vote gradient" + (this.props.currentUser.profile.gradient ? this.props.currentUser.profile.gradient : '')}>
          <section className="person">
            {/* <div>
              <a id="prevPerson" style="visibility:{{#if prevPerson}}visible{{else}}hidden{{/if}}">
              <img src="/img/left.png" className="nav"/>
              </a>
            </div> */}
            <div className="h4" id="specificUser" data-filter-id={this.props.currentUser._id}>
              <div>
                {this.props.feedback 
                ?
                  this.props.feedback.groupName
                :
                  ''
                }
              </div>
              {/* <img src="{{pictureUrl to}}" className="avatar" id="specificUser" data-filter-id="{{userId}}"> */}
              <img src="/img/avatar.png" className="avatar" id="specificUser" data-filter-id={this.props.currentUser._id}/>
    
              <br/>
              {this.props.currentUser.profile.firstName +' '+  this.props.currentUser.profile.lastName }
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
                !this.props.feedback.from == this.props.feedback.to &&
                <div><a className="skip" onClick={this.skip.bind(this, this.state.currentQuestion, this.state.currentQuestionIndex)}>Skip this question</a></div>
              }
            </div>
          </section>
          }
  
        </section>
      );
    }else{
      return(
        <Loading/>
      );
  }
    
  }
}

export default withTracker((props) => {
  var dataReady;
  var handle = Meteor.subscribe('feedback', props.secret, {
      onError: function (error) {
              console.log(error);
          }
      });
  dataReady = handle.ready();
   
  return {
      currentUser: Meteor.user(),
      feedbacks: Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId()}).fetch(),
      feedback: Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false }),
      dataReady:dataReady,
  };
})(Quiz);
