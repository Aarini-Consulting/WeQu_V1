import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/ui/complexLinkTranslate';
import GroupQuizClientImage from '../groupQuizClient/GroupQuizClientImage';

class OpenQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        value:undefined,
        savingData:false,
        quizOver:false,
      };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.answerCount){
      if(!this.state.value || this.state.value && this.state.value.length != nextProps.answerCount){
        this.setDefaultValue(nextProps.answerCount);
      }
    }
  }

  setDefaultValue(answerCount){
    var value=[];

    for(i=0;i<answerCount;i++){
      value.push("");
    }

    this.setState({
      value: value,
    });
  }

  stepFinished(event){
    event.preventDefault();

    if(this.state.value != ''){
        this.setState({
            savingData:true
        },()=>{
            this.quizFinished();
            this.props.submitAction({answer:this.state.value});
        });
    }
  }

  quizFinished(){
      this.setState({
          quizOver: true,
      });
  }

  handleChange(index,event) {
    var tempValueArray = this.state.value.slice();
    tempValueArray[index] = event.target.value;

    this.setState({value: tempValueArray});
  }

  renderInputFields(){
    var fields=[];
    for(index=0;index<this.props.answerCount;index++){
      var required = false;
      if(index == 0){
        required = true;
      }

      fields.push(
        <input className="group-quiz-open-question-field w-input" maxLength="256" placeholder="your answer" type="text"
        key={`Open-Question-Answer-${this.props.groupId}-${index}`}
        value={this.state.value[index]} onChange={this.handleChange.bind(this,index)} required={required} />
      )
    }

    return fields;
  }

  render() {
    if(!this.state.savingData && this.props.dataReady){
      return (
        <section className="ranker-container fontreleway purple-bg">
            <div className="section-name font-rate font-name-header">
                {this.props.group && this.props.group.groupName &&
                    this.props.group.groupName
                }
            </div>
            
            <div className="rate-content group-quiz-question-client">
              <GroupQuizClientImage backgroundUrl={this.props.backgroundUrl}/>
              <div className="font-rate font-name-header f-white group-quiz-question-client">
                {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
              </div>
              <form onSubmit={this.stepFinished.bind(this)}>
                <div className="rate-box-container">
                  {this.state.value &&
                    this.renderInputFields()
                  }
                </div>
                <div className="w-block cursor-pointer">
                    <input className="font-rate f-bttn w-inline-block noselect" type="submit" defaultValue={i18n.getTranslation(`weq.rankSelf.ButtonDone`)}/>
                </div>
              </form>
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

OpenQuestion.defaultProps = {
  answerCount: 1,
};

export default withTracker((props) => {
  var dataReady;
  var group;
  var handleGroup = Meteor.subscribe('group',{_id : props.groupId},{}, {
      onError: function (error) {
              console.log(error);
          }
  });

  if(handleGroup.ready()){
      group = Group.findOne({_id : props.groupId});
      dataReady = true;
      
  }
  return {
      group:group,
      dataReady:dataReady
  };
})(OpenQuestion);
