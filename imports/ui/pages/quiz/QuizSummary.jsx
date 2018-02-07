import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';

class QuizSummary extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentFeedback: undefined,
      lastAnsweredCount: 0,
      answeredTotal: 0
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.feedbacks && nextProps.feedbacks.length > 0){
      console.log(nextProps.feedbacks[0]);
      this.setState({
        currentFeedback:nextProps.feedbacks[0],
        lastAnsweredCount: 12,
        answeredTotal:nextProps.feedbacks.length * 12
      });
    }
  }

  renderStatementList(){
    var qset = [];
    if(this.state.currentFeedback && this.state.currentFeedback.qset && Array.isArray(this.state.currentFeedback.qset)){
      qset = this.state.currentFeedback.qset;
    }
    return qset.map((question, index, qset) => {
      var statementSkillMore;
      var statementSkillLess;
      var statementText;
      var count = 0;
      if (question.answer && question.answers[0]._id == question.answer){
          statementSkillMore = question.answers[0].skill;
          statementSkillLess = question.answers[1].skill;
          statementText = question.answers[0].text;
          count += 1;
      }
      else if (question.answer && question.answers[1]._id == question.answer){
        statementSkillMore = question.answers[1].skill;
        statementSkillLess = question.answers[0].skill;
        statementText = question.answers[1].text;
        count += 1;
      }
      if(question.answer){
        return (
          <li key={question.answer} className="list-item">
            <div className="summarytext">
              <div className="fontreleway fontstatement">
                more <strong className="qualityname _4">{statementSkillMore}</strong> than <strong className="qualityname _2">{statementSkillLess}</strong>
              </div>
              <div className="fontreleway fontstatement fontexample">{statementText}</div>
            </div>
          </li>
        )
      }
    });
    
  }

  // countAnsweredQset(qset){
  //   var count = 0;
  //   qset.forEach((q) => {
  //     if(q.answer || q.answer === false){
  //       count+=1;
  //     }
  //   });
  //   return count;
  // }

  render() {
    if(this.props.dataReady){
      return (
        <section className="section summary">
            {/* <h2 style={{width:65+'%',marginLeft:"auto",marginRight:"auto"}}>
            Well done!<br/>
            <Link to="/quiz">Answer more question</Link>
            </h2>

            <h2 style={{width:65+'%',marginLeft:"auto",marginRight:"auto"}}>
            <Link to="/invite">Invite other people</Link>
            </h2> */}

            <div className="quizcount w-row">
              <div className="columprogress w-col w-col-6 w-col-small-6 w-col-tiny-6">
                <a className="fontreleway progressnumber fontmyself">{this.state.lastAnsweredCount}</a>
                <div className="fontreleway fontprogress fontwidthmobile">Answers answered just now</div>
              </div>
              <div className="columprogress w-col w-col-6 w-col-small-6 w-col-tiny-6">
                <a className="fontreleway progressnumber fontothers">{this.state.answeredTotal}</a>
                <div className="fontreleway fontprogress">Answered so far by you</div>
              </div>
            </div>
            <div className="summarysection w-clearfix">
              <div className="fontreleway fonttitle">You&#x27;ve reflected that you are...</div>
            </div>
            {this.state.currentFeedback && 
              <ul className="w-list-unstyled summary-list">
                {this.renderStatementList()}
              </ul>
            }
            <div className="footersummary w-clearfix">
              <div className="bttn-area-summary">
              {this.props.quizPerson._id == Meteor.userId()
              ?<a className="button fontreleway fontbttnsummary w-button" onClick={this.props.continue}>Load more questions about myself</a>
              :<a className="button fontreleway fontbttnsummary w-button" onClick={this.props.continue}>Load more questions about {getUserName(this.props.quizPerson.profile)}</a>
              }
                
              </div>
              <div className="bttn-area-summary _2">
                {this.props.next && this.props.nextPerson
                ?<a className="button fontreleway fontbttnsummary w-button" onClick={this.props.next}>Load questions about {getUserName(this.props.nextPerson.profile)}</a>
                :<Link to="/invite" className="button fontreleway fontbttnsummary w-button">Invite other people</Link>
                }
              </div>
              <div className="bttn-area-summary"></div>
            </div>
        </section>
      );
    }else{
      return(
        <Loading/>
      )
    }
  }
}

export default withTracker((props) => {
  var dataReady;
  var feedbacks = [];
  var user;
  var handleFeedback;
  var nextPerson;

  handleFeedback = Meteor.subscribe('feedback', 
    {
      $or : [ 
      {from:Meteor.userId()},
      {to:Meteor.userId()} 
      ]}, 
    
    {}, 
    {
      onError: function (error) {
              console.log(error);
          }
      });
  
  if(handleFeedback.ready()){
    if(props.quizUser){
      user = props.quizUser;
      feedbacks = Feedback.find({ 'from': Meteor.userId(), 'to' : props.quizUser._id, done:true}, 
      { sort: { lastUpdated: -1 } }).fetch();
    }else{
      user = Meteor.user();
      if(props.feedback){
        feedbacks = Feedback.find({'from': props.feedback.from, 'to' : props.feedback.to, done:true}, 
        { sort: { lastUpdated: -1 }}).fetch();
      }else{
        feedbacks = Feedback.find({'from': Meteor.userId(), 'to' : Meteor.userId(), done:true}, 
        { sort: { lastUpdated: -1 }}).fetch();
      }
    }

    var othersFeedbacks = Feedback.find({
      done:false,
      $and : [
        {to:{$ne:Meteor.userId()}} 
        ]
      },
      ).fetch();
    
    if(othersFeedbacks.length > 0){
      nextPerson = Meteor.users.findOne({_id:othersFeedbacks[0].to});
      console.log(nextPerson);
    }
    dataReady = true;
  }
  return {
    dataReady:dataReady,
    feedbacks:feedbacks,
    nextPerson:nextPerson,
    quizPerson:user
  };
})(QuizSummary);
