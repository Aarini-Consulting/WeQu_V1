import React from 'react';

export default class Quiz extends React.Component {
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
    }else if(this.props.feedback){
      this.getCurrentQuestion();
    }
  }

  componentWillReceiveProps(nextProps, nextState){
    if(nextProps.feedback){
      this.getCurrentQuestion();
    }
  }

  getCurrentQuestion(){
    //find question from qset that don't have answer yet
    this.props.feedback.qset.find((question, index, qset)=>{
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
  }
  
  skip(question,index,event){
    event.preventDefault();
    console.log(question);
    console.log(index);
  } 

  render() {
    console.log(this.props.feedback);
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
  }
}
