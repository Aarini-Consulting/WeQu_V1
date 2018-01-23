import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Creatable } from 'react-select';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

import MultiSelect from './MultiSelect';
import '/imports/startup/client/react-select.css';

class InviteGroup extends React.Component {
  constructor(props){
      super(props);
      this.state={
        options:[],
        lastValue:undefined,
        value:undefined,
        inviteStatus:false,
        inviteSuccess:false,
      }
  }

  createGroup(){
    var groupName = ReactDOM.findDOMNode(this.refs.groupName).value.trim();
    if(groupName && this.state.value){
      var emailsArray = this.state.value.split(",");

      this.setState({
        inviteStatus: 'sending',
      });
  
      Meteor.call('createGroup', groupName, emailsArray , (err, res) => {
        if(res){
          this.setState({
              inviteStatus: 'sent',
              inviteSuccess:emailsArray.length,
            });
          }
          if(err)
          {
            this.setState({
              inviteStatus: 'error',
            });
          }     
      }); 
    }
  }

  addMember(){
      var emailsArray = this.state.value.split(",");
      this.setState({
        inviteStatus: 'sending',
      });
    }

    handleSubmit (event) {
      event.preventDefault();
      if(this.props.addNewMemberOnly){

      }else{
        this.createGroup();
      } 
  }

  toOptionsObject(email){
    return {className: "Select-create-option-placeholder", label:email, value:email};
  }

  // componentDidMount(){
  //   if(this.props.addNewMemberOnly && this.props.group){
  //     var options = [];
  //     this.props.group.emails.forEach((email) => {
  //       options.push(this.toOptionsObject(email));
  //     });
  //     this.setState({
  //       value: this.props.group.emails.join(),
  //       lastValue: this.props.group.emails[this.props.group.emails.length-1],
  //       options: options
  //     });
  //   }
  // }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.addNewMemberOnly && nextProps.Group){
  //     console.log("receiveprops");
  //     console.log(nextProps.group);
  //   }
  // }


  isOptionUnique(prop) {
    const { option, options, valueKey, labelKey } = prop;
    return !options.find(opt => option[valueKey].toString().toLowerCase() === opt[valueKey].toString().toLowerCase())
  }

  handleSelectChange (value) {
      console.log('You\'ve selected:', value);
      if(value && value.length > 0){
          var valueArray = value.split(",");
          var lastValue  = valueArray [valueArray.length-1];

          this.setState({
              lastValue: lastValue,
              value: value,
          });
      }else{
          this.setState({
              lastValue: undefined,
              value: undefined,
              options: []
          });
      }
  }

    handleBackArrowClick(){
    if(this.props.addNewMemberOnly || (this.props.count && this.props.count > 0)){
            this.props.closeInviteGroup();
        }
    }

    render() {
    if(this.props.dataReady){
      if(this.state.inviteSuccess &&  this.state.inviteSuccess > 0){
        return (
          <div className="fillHeight flex-start">
          <section className="groupbg whiteText alignCenter feed">
            <div className="emptymessage"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext">Awesome!
                <br/>Your invitation is sent to {this.state.inviteSuccess} people
                <br/>When they sign up, you can view their profiles
                </div>
                <a className="invitebttn w-button" id="ok" onClick={this.handleBackArrowClick.bind(this)}>OK!</a>
            </div>
            </section>
          </div>
        )
      }
      else{
        return (
            <section className={"gradient"+this.props.currentUser.profile.gradient+" whiteText feed"}>
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  {(this.props.addNewMemberOnly || (this.props.count != undefined && this.props.count > 0)) &&
                    <a className="w-clearfix w-inline-block" onClick={this.handleBackArrowClick.bind(this)}>
                    <img className="image-7" src="/img/arrow_white.png"/>
                    </a>
                  }
                </div>
                <div className="screentitle w-clearfix">
                  {this.props.addNewMemberOnly 
                  ?
                    <div className="titleGr">Invite more people</div>
                  :
                    <div className="titleGr">Create a new group</div>
                  }
                </div>
              </div>
              <div className="contentwrapper invite">

                
                <div className="inviteform w-form">
                    <form onSubmit={this.handleSubmit.bind(this)} className="groupform inviteformstyle" data-name="Email Form" id="send" name="email-form">
                        {!this.props.addNewMemberOnly && 
                          <input className="formstyle w-input" data-name="Name" id="groupName" ref="groupName" maxLength="256" name="name" placeholder="group name" type="text" required/>
                        }
                        <Creatable
                            closeOnSelect={true}
                            disabled={false}
                            multi={true}
                            onChange={this.handleSelectChange.bind(this)}
                            options={this.state.options}
                            placeholder="Email addresses"
                            removeSelected={false}
                            rtl={false}
                            simpleValue
                            value={this.state.value}
                            required={true}
                            isOptionUnique={this.isOptionUnique}
                        />
                        <div className="groupformtext">
                        Press Enter to add email address(es) <br/>
                        {this.state.lastValue &&
                         "Press backspace to remove " +  this.state.lastValue
                        }
                        </div>
                        <button className="formbttn invitebttn w-button" id="submitSend" data-wait="Please wait..." type="submit">send invitation</button>
                    </form>
                    
                    {this.state.inviteStatus == 'sending' && 
                    <span className="sendingStatus"><img src="/img/status_sending.png"/>sending...</span>
                    }
                    {this.state.inviteStatus == 'sent' && 
                        <span className="sendingStatus"><img src="/img/status_sent.png"/>sent!</span>
                    }
                    {this.state.inviteStatus == 'error' &&
                        <span className="sendingStatus"><img src="/img/status_error.png"/>error sending email</span>
                    }
                </div>
              </div>
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
  var count;
  var handleGroup = Meteor.subscribe('group',{creatorId: Meteor.userId()},{}, {
    onError: function (error) {
          console.log(error);
      }
  });
  if(handleGroup.ready()){
    count =  Group.find({creatorId: Meteor.userId()}).count();
    dataReady = true;
  }
  return {
      count:count,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(InviteGroup);
