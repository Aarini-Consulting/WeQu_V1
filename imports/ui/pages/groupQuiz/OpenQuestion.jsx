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

class OpenQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        value:'',
        savingData:false,
        quizOver:false,
      };
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

  handleChange(event) {
    this.setState({value: event.target.value});
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
                <form onSubmit={this.stepFinished.bind(this)}>
                  <div className="rate-box-container">
                    <div className="font-rate font-name-header f-white">
                      {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
                    </div>
                    <input className="emailfield w-input" maxLength="256" placeholder="your answer" type="text" value={this.state.value} onChange={this.handleChange.bind(this)}
                    required/>
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
