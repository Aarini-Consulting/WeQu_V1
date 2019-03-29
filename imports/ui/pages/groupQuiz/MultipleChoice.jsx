import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/helper/complexLinkTranslate';
import GroupQuizClientImage from '../groupQuizClient/GroupQuizClientImage';

import {Group} from '/collections/group';

class MultipleChoice extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savingData:false,
      quizOver:false,
      selectedIndex:-1
    };
  }

  stepFinished(){
    if(this.state.selectedIndex >= 0){
      this.setState({
        savingData:true
      },()=>{
          this.quizFinished();
          this.props.submitAction({selectedIndex:this.state.selectedIndex});
      });
    }
  }

  quizFinished(){
      this.setState({
          quizOver: true,
      });
  }

  answerSelected(index){
    this.setState({
      selectedIndex: index,
    });
  }

  renderAnswerOptions(){
    return this.props.answerOptions.map((value, index) => {
      var className = "rate-box w-clearfix";
      var classNameHamburger = "rate-hamburger";
      var icon =  <i className="far fa-square"></i>;

      if(index == this.state.selectedIndex){
        className = className + " mc selected";
        classNameHamburger = classNameHamburger + " mc selected";
        icon = <i className="fas fa-check-square"></i>
      }

      if(this.state.quizOver){
        className = className + " noselect";
      }else{
        className = className + " cursor-pointer";
      }

      return(
        <div className={className} key={`mc-answer-${index}-${value}`}
        onClick={this.answerSelected.bind(this, index)}>
          <div className={classNameHamburger}>
            {icon}
          </div>
          <div className={"font-rate-quality noselect"}>
            {this.props.answerOptionsLoadExternalField 
            ?
              value.toString()
            :
              i18n.getTranslation(`weq.groupQuizAnswer.${value.toString()}`)
            }
            
          </div>
        </div>
      );
    });
  }
  
  render() {
      if(!this.state.savingData && this.props.dataReady){
          return (
            <section className="ranker-container fontreleway purple-bg">
                <div className="rate-content group-quiz-question-client">
                  <div className="font-rate font-name-header f-white group-quiz-question-client">
                    {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
                  </div>
                  <div className="rate-box-container">
                    {this.renderAnswerOptions()}
                  </div>
                  <div className="w-block cursor-pointer">
                      <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                          {i18n.getTranslation(`weq.rankSelf.ButtonDone`)}
                      </div>
                  </div>
                </div>
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
  var group;
  var answerOptions=props.answerOptions;
  var handleGroup = Meteor.subscribe('group',{_id : props.groupId},{}, {
      onError: function (error) {
              console.log(error);
          }
  });

  if(handleGroup.ready()){
      group = Group.findOne({_id : props.groupId});

      if(props.answerOptionsLoadExternalField && props.answerOptionsLoadExternalField == "userFullName"){
          if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
              var handleUsers = Meteor.subscribe('users',
                  {_id:
                  {$in:group.userIds}
                  }, 
                  {}, {
                  onError: function (error) {
                          console.log(error);
                      }
              });
              if(handleUsers.ready()){
                  var users = Meteor.users.find(
                      {
                          "_id" : {$in:group.userIds}
                      }
                      ).fetch();
                  
                  if(users && users.length > 0){
                      answerOptions = users.map((user)=>{
                          var firstName = user && user.profile && user.profile.firstName;
                          if(!firstName){
                              firstName = "";
                          }
                          var lastName = user && user.profile && user.profile.lastName;

                          if(!lastName){
                              lastName = "";
                          }
                          return (firstName + " " + lastName);
                      });
                  }
                  else{
                      answerOptions = [];
                  }
                  dataReady = true;
              }
          }else{
              dataReady = true;
          }
      }else{
          dataReady = true;
      }
  }
  return {
      group:group,
      answerOptions:answerOptions,
      dataReady:dataReady
  };
})(MultipleChoice);
