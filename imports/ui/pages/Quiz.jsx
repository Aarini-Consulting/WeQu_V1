import React from 'react';

export default class Quiz extends React.Component {
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
        
        {this.props.feedback &&
        <section>
          {/* {{#if writtenFeedback}}
          <div className="question">
            Why do you think so?
          </div>
          <textarea rows="3" style="width:100%">Wrote your feedback here</textarea> */}

          {/* <div className="question">
            <h2>{{question.text}}</h2>
          </div>
          <ul className="answers">
            {{#each question.answers}}
            <li className="answer" id="{{_id}}" data-skill="{{skill}}" >{{text}}</li>
            {{/each}}
          </ul>
          <div className="statusBar">
            <div>Question {{questionNum}} of {{questionsTotal}}</div>
            {{#unless self}}
            <div><a href="" className="skip">Skip this question</a></div>
            {{/unless}}
          </div> */}
        </section>
        }

      </section>
    );
  }
}
