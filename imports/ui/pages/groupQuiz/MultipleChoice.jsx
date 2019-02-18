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
      var icon =  <i className="far fa-square"></i>;

      if(index == this.state.selectedIndex){
        className = className + " mc selected";
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
          <div className="rate-hamburger">
            {icon}
          </div>
          <div className={"font-rate-quality noselect"}>{value.toString()}</div>
        </div>
      );
    });
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
                <div className="rate-content">
                  <div className="font-rate font-name-header f-white">
                    {this.props.question}
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
})(MultipleChoice);