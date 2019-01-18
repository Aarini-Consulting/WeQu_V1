import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Creatable } from 'react-select';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

import {formatErrMessage} from '/imports/startup/client/formatErrMessage.js';

// import MultiSelect from './MultiSelect';
// import '/imports/startup/client/react-select.css';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class InviteGroup extends React.Component {
  constructor(props){
      super(props);
      this.state={
        languages:[{name:"English",code:"en"},{name:"Nederlands",code:"nl"},{name:"Français",code:"fr"}],
        selectedEmailLanguage:i18n.getLocale().split("-")[0],
        info:undefined,
        inviteStatus:false,
        inviteSuccess:false,
        groupName:"",
        inviteDatas:[],
        newInviteDatas:[],
        inviteDeleted:[],
        inviteResend:[],
        resendFailed:0,
        modifiedByUser:false,
        showConfirm:false,
        unsaved:false
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isEdit && nextProps.group){
      if(nextProps.dataReady && nextProps.group){
        var copyStateData = [];
        nextProps.groupUsers.forEach(function(groupUser) {
          if(groupUser && groupUser.emails && groupUser.emails[0]){
            copyStateData.push({email:groupUser.emails[0].address});
          }
        });
        this.setState({
          info:undefined,
          groupName: nextProps.group.groupName,
          inviteDatas: copyStateData,
          newInviteDatas:[],
          inviteDeleted:[],
          modifiedByUser: false,
        });
      }
    }
  }

  handleChangeEmailLang(event) {
    this.setState(
        { 
            selectedEmailLanguage: event.target.value,
        }
    );
}

  updateGroup(){
    var inviteDatas = this.state.inviteDatas.filter((inviteData) => {
      var deleteIndex = this.state.inviteDeleted.findIndex((deleted)=>{
        return inviteData.email == deleted.email
      })

      if(deleteIndex < 0){
        return true;
      }else{
        return false;
      }
    });

    if(inviteDatas && inviteDatas.length >= 2){
      var emailsArray = inviteDatas.map( (fields) => fields.email);

      this.setState({
        inviteStatus: 'sending',
      });

      var resend = this.state.inviteResend.filter((resend) => {
        var newIndex = this.state.newInviteDatas.findIndex((newData)=>{
          return resend.email == newData.email
        })
        if(newIndex < 0){
            return true;
        }else{
            return false;
        }
      });

      resend.map( (resend) => this.resendInvite(resend.email));
      
      Meteor.call('updateGroup', this.props.group, this.state.selectedEmailLanguage, inviteDatas, emailsArray , (err, res) => {
          if(err)
          {
            console.log(err);
            this.setState({
              inviteStatus: 'error',
              info: i18n.getTranslation("weq.inviteGroup.ErrorUnknown"),
            });
          }else{
            var msg;
            var resend = this.state.inviteResend.filter((resend) => {
              var newIndex = this.state.newInviteDatas.findIndex((newData)=>{
                return resend.email == newData.email
              })
              if(newIndex < 0){
                  return true;
              }else{
                  return false;
              }
            });

            if(res > 0){
              msg = res;
            }
            else if(resend.length > 0){
              if(msg && Number.isInteger(msg)){
                msg += (resend.length - this.state.resendFailed)
              }else{
                msg = (resend.length - this.state.resendFailed)
              }
            }
            else{
              msg = true;
            }
            
            this.setState({
              inviteStatus: 'sent',
              inviteSuccess:msg,
              newInviteDatas:[],
              inviteDeleted:[],
              inviteResend:[],
              resendFailed:0,
              modifiedByUser:false,
              showConfirm:false,
              unsaved:false
            });
          }
      }); 
    }

    
  }

  createGroup(){
    var groupName = this.state.groupName;
    if(groupName && this.state.inviteDatas && this.state.inviteDatas.length >= 2){
      var emailsArray = this.state.inviteDatas.map( (fields) => fields.email);

      this.setState({
        inviteStatus: 'sending',
      });
  
      Meteor.call('createGroup', groupName, this.state.selectedEmailLanguage, this.state.inviteDatas, emailsArray , (err, res) => {
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
              info: formatErrMessage(err.error),
            });
          }     
      }); 
    }
  }

  checkUnsavedForm(){
    if((this.state.inviteDatas.length - this.state.inviteDeleted.length) < 12){
      var email = ReactDOM.findDOMNode(this.refs.email);
      if(email){
        this.setState({
          unsaved: email.value,
        });
      }
    }else{
      this.setState({
        unsaved: false
      });
    }
  }

  handleChange(event) {
    var newValue = event.target.value;
    this.setState({groupName: newValue});
    if(this.props.group && this.props.group.groupName != newValue){
      if(!this.state.modifiedByUser){
        this.setState({
          modifiedByUser: true
        });
      }
    }
  }

  handleSubmit (event) {
      event.preventDefault();
      this.addField();
  }

  handleSubmitButton(){
      if(!this.state.groupName){
        this.setState({
          inviteStatus: 'warning',
          info: i18n.getTranslation("weq.inviteGroup.ErrorNoGroupName"),
        });
      }
      else if(this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) > 12){
        this.setState({
          inviteStatus: 'warning',
          info: i18n.getTranslation("weq.inviteGroup.MaxNumberOfMember"),
        });
      }
      else if(!(this.props.group && this.props.group.isActive) && this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) < 2){
        this.setState({
          inviteStatus: 'warning',
          info: i18n.getTranslation("weq.inviteGroup.ErrorMinNumberMember"),
        });
      }
      else{
        this.checkUnsavedForm();
  
        this.setState({
          showConfirm: true,
          inviteStatus: false,
          info: undefined,
        });
      }
  }

    handleBackArrowClick(event){
      event.preventDefault();
    if(this.props.isEdit || (this.props.count && this.props.count > 0)){
        if(this.props.closeInviteGroup){
          this.props.closeInviteGroup();
        }else{
          this.setState({
            inviteSuccess: false,
            inviteStatus:false
          });
        }
            
      }
    }

    deleteAction(index, deleteIndex, resendIndex, newInviteIndex){
      if(newInviteIndex > -1 && deleteIndex < 0){
        var copyStateDataNew = this.state.newInviteDatas.slice();
        copyStateDataNew.splice(newInviteIndex,1);
        var copyStateData = this.state.inviteDatas.slice();
        copyStateData.splice(index,1);

        this.setState({
          inviteDatas: copyStateData,
          newInviteDatas: copyStateDataNew,
          modifiedByUser: true
        });
      }else{
        if(resendIndex > -1){
          var copyStateDataResend = this.state.inviteResend.slice();
          copyStateDataResend.splice(resendIndex,1);
          this.setState({
            inviteResend: copyStateDataResend,
            modifiedByUser: true
          });
        }
        this.markToggle(index, deleteIndex, "inviteDeleted");
      }
    }

    resendAction(index, deleteIndex, resendIndex){
      if(deleteIndex < 0){
        this.markToggle(index, resendIndex, "inviteResend");
      }
    }

    markToggle(index, markIndex, markStateName){
      var copyMarkStateData = this.state[markStateName].slice();
      if(markIndex < 0){
        copyMarkStateData.push(this.state.inviteDatas[index]);
      }else{
        copyMarkStateData.splice(markIndex,1);
      }
      this.setState({
        [markStateName]:copyMarkStateData
      });

      if(copyMarkStateData.length > 0){
        this.setState({
          modifiedByUser: true
        });
      }
    }

    resendInvite(email){
      if(this.props.group){
        Meteor.call('resend.group.invite', this.props.group._id, this.state.selectedEmailLanguage, email , (err, res) => {
          if(err){
            this.setState({
              resendFailed: this.state.resendFailed + 1,
              inviteStatus: 'error',
              info: 'error sending email',
            });
          }     
        }); 
      }
    }

    addField(){
      var copyStateData = this.state.inviteDatas.slice();
      var emailsArray = this.state.inviteDatas.map( (fields) => fields.email);
      var email = ReactDOM.findDOMNode(this.refs.email).value.trim().toString().toLowerCase();

      if(email == this.props.currentUser.emails[0].address.toString().toLowerCase()){
        this.setState({
          inviteStatus: 'warning',
          info: 'cannot invite yourself',
        });
      }else if(emailsArray.indexOf(email) > -1){
        this.setState({
          inviteStatus: 'warning',
          info: 'a user with the same email address is already a member of this group',
        });
      }else{
        var copyStateDataNew = this.state.newInviteDatas.slice();
        copyStateDataNew.push({email:email});
        copyStateData.push({email:email});
        this.setState({
          info:undefined,
          inviteDatas: copyStateData,
          newInviteDatas:copyStateDataNew,
          modifiedByUser: true
        });

        ReactDOM.findDOMNode(this.refs.email).value="";
      }
    }

    renderLanguageList(){
      return this.state.languages.map((val,index,array)=>{
          return(
              <option key={"select-lang"+index} value={val.code}>{val.name}</option>
          );
      })
    }

    renderFields(){
      return this.state.inviteDatas.map((data, index) => {
          var newInviteIndex = this.state.newInviteDatas.findIndex((newInvites)=>{
              return data.email == newInvites.email
          })

          var resendIndex = this.state.inviteResend.findIndex((resend)=>{
            return data.email == resend.email
          })

          var deleteIndex = this.state.inviteDeleted.findIndex((deleted)=>{
            return data.email == deleted.email
          })

          var readySurvey;
          if(this.props.group && this.props.group.userIdsSurveyed && this.props.groupUserEmailsSurveyed.indexOf(data.email) > -1){
            readySurvey = true;
          }
          
          return (
            <li className="invite-group-line-wrapper" key={data.email}>
              <div className="font f_12">{index+1}</div>
              <input type="email" className="formstyle formuser formemail email" disabled={true} value={data.email} autoComplete={"false"}/>
              {this.props.group && readySurvey 
              ?
              <div className="formstyle-header status">
              <div className="font f_12 survey-completed">completed</div>
              </div>
              :this.props.group 
                &&
                <div className="formstyle-header status">
                <div className="font f_12 survey-incomplete">incompleted</div>
                </div>
              }
              {this.props.isEdit && newInviteIndex < 0 && !(this.props.group && this.props.group.isFinished) &&
                <div className={"invitebttn bttnmembr action w-button "+ (resendIndex > -1 ? "active":"")} onClick ={this.resendAction.bind(this,index,deleteIndex,resendIndex)}>
                  {resendIndex > -1 
                    ?
                    <i className="fas fa-check fa-margin-right"></i>
                    :
                    <i className="far fa-envelope fa-margin-right"></i>
                  }
                  resend
                </div>
              }
              {!(this.props.group && this.props.group.isFinished) &&
              <div className="invitebttn bttnmembr action delete w-button"  onClick ={this.deleteAction.bind(this,index,deleteIndex,resendIndex,newInviteIndex)}>
                {deleteIndex > -1 
                    ?
                    <i className="fas fa-times fa-margin-right"></i>
                    :
                    <i className="fas fa-trash-alt fa-margin-right"></i>
                  }
              </div>
              }
            </li>
          );
        });
    }

    renderFieldTable(){
      return (
        <ol className="w-list-unstyled">
          {this.props.group && this.props.isEdit
          && 
          (
            this.props.group && (this.props.group.isActive || this.props.group.isFinished) 
            ?
            <li className="invite-group-line-wrapper">
              <div className="font f_12">#</div>
              <div className="formstyle-header formemail">
                <div className="font f_12">Email</div>
              </div>
              <div className="formstyle-header status">
                <div className="font f_12">Survey Status</div>
              </div>
            </li>
            :
            <li className="invite-group-line-wrapper">
              <div className="font f_12">#</div>
              <div className="formstyle-header formemail">
                <div className="font f_12">Email</div>
              </div>
              <div className="formstyle-header status">
                <div className="font f_12">Survey Status</div>
              </div>
              <div className="formstyle-header actions">
                <div className="font f_12">Actions</div>
              </div>
            </li>
          )
          }
          
          {this.renderFields()}
        </ol>
      )
    }

    render() {
    if(this.props.dataReady){
      if(this.state.inviteSuccess){
        return (
          <div className="fillHeight">
          <section className="fontreleway fillHeight">
            {this.props.isEdit 
            ?
            <div className="emptymessage fillHeight"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext group">Awesome!
                <br/>Your changes has been saved
                {this.state.inviteSuccess && typeof this.state.inviteSuccess != "boolean" && this.state.inviteSuccess > 0 &&
                <div><br/>An invitation was sent to {this.state.inviteSuccess} people</div>
                }
                </div>
                <a className="invitebttn w-button" id="ok" onClick={this.handleBackArrowClick.bind(this)}>OK!</a>
            </div>
            :
            <div className="emptymessage fillHeight"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext group">Awesome!
                <br/>Your invitation is sent to {this.state.inviteSuccess} people
                </div>
                <a className="invitebttn w-button" id="ok" onClick={this.handleBackArrowClick.bind(this)}>OK!</a>
            </div>
            }
            </section>
          </div>
        )
      }
      else{
        return (
          <div className="contentwrapper invite">   
            <div className="inviteform w-form">
                <form ref="form" onSubmit={this.handleSubmit.bind(this)} name="email-form" data-name="Email Form" className="inviteformstyle groupform">
                    {this.props.isEdit 
                      ? 
                      <div>
                        <div className="groupformtext">
                          <T>weq.inviteGroup.GroupName</T>
                          <div className="tooltip-tutorial">
                            <i className="fa fa-question-circle font-white cursor-pointer" aria-hidden="true"></i>
                            <span className="tooltiptext">Once created, the group name is not changeable. </span>
                          </div>
                        </div>
                        <p className="formstyle group-name noselect">{this.props.group.groupName}</p>
                      </div>
                      :
                      <div>
                      <div className="groupformtext">
                        <T>weq.inviteGroup.GroupNamePromptText</T>
                        <div className="tooltip-tutorial">
                          <i className="fa fa-question-circle font-white cursor-pointer" aria-hidden="true"></i>
                          <span className="tooltiptext">Choose a simple, yet unique group name.<br/>Once created, the group name is not changeable. </span>
                        </div>
                      </div>
                      <input type="text" ref="groupName" maxLength="256" required="" placeholder={i18n.getTranslation("weq.inviteGroup.PlaceholderGroupName")} className="formstyle group-name w-input" autoComplete={"false"} 
                      value={this.state.groupName} 
                      onChange={this.handleChange.bind(this)} required/>
                      </div>
                    }
                  
                  <br/>

                  {!(this.props.group && this.props.group.isFinished) &&
                    <div>
                      <div className="groupformtext">Invite email language:</div>
                      <select className="w-select w-inline-block pdf-download-lang-select" name="language"
                      value={this.state.selectedEmailLanguage} onChange={this.handleChangeEmailLang.bind(this)}>
                          {this.renderLanguageList()}
                      </select>
                      <br/>
                    </div>
                  }

                  <div className="groupformtext"><T>weq.inviteGroup.GroupMemberPromptText</T></div>
                  
                  {this.state.inviteDatas && this.state.inviteDatas.length > 0 && this.renderFieldTable()}
                  
                  {!(this.props.group && (this.props.group.isActive || this.props.group.isFinished)) &&
                  this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) < 12 
                  ?
                  <ol className="w-list-unstyled">
                    <li className="invite-group-line-wrapper w-clearfix">
                      <div className="font f_12">></div>
                      <input type="email" className="formstyle formuser formemail email w-input" maxLength="256" ref="email" placeholder={i18n.getTranslation("weq.inviteGroup.PlaceholderEmailAddress")} required={true} autoComplete={"false"}/>
                      {/* <div className={"invitebttn bttnmembr gender w-clearfix "+(this.state.gender == "Male" ? "selected" : "")} onClick ={this.setGender.bind(this,"Male")}>
                        Male
                      </div>
                      <div className={"invitebttn bttnmembr gender w-clearfix " + (this.state.gender == "Female" ? "selected" : "")}  onClick ={this.setGender.bind(this,"Female")}>
                        Female
                      </div> */}
                         <input type="submit" id="submitAdd" defaultValue={`+ ${i18n.getTranslation("weq.inviteGroup.ButtonAddGroupMember")}`} className="invitebttn bttnmembr action w-button"/>
                    </li>
                  </ol>
                  :!(this.props.group && (this.props.group.isActive || this.props.group.isFinished)) &&
                  <ol className="w-list-unstyled">
                    <li className="invite-group-line-wrapper w-clearfix">
                      <div className="font f_12 center"><T>weq.inviteGroup.MaxNumberOfMember</T></div>
                    </li>
                  </ol>
                  }

                {this.state.inviteStatus == 'sending' && 
                <span className="sendingStatus">
                <img src="/img/status_sending.png"/><T>weq.inviteGroup.SendingText</T>
                <br/><br/>
                </span>
                }
                {this.state.inviteStatus == 'sent' && 
                    <span className="sendingStatus">
                    <img src="/img/status_sent.png"/><T>weq.inviteGroup.SentText</T>
                    <br/><br/>
                    </span>
                }
                {(this.state.inviteStatus == 'error' || this.state.inviteStatus == 'warning') && 
                    this.state.info &&
                      <span className="sendingStatus">
                      <img src="/img/status_error.png"/>{this.state.info}
                      <br/><br/>
                      </span>
                      // :
                      // <span className="sendingStatus"><img src="/img/status_error.png"/>error</span>
                }
                {(!this.props.isEdit || this.state.modifiedByUser) && this.state.inviteStatus != 'sending' &&
                    <a id="submitSend" className="invitebttn formbttn w-button" onClick ={this.handleSubmitButton.bind(this)}>
                    <T>weq.inviteGroup.ButtonSave</T>
                    </a>
                }
                
                </form>

                {this.state.showConfirm && 
                  (this.props.isEdit 
                  ?
                    <SweetAlert
                    type={"confirm-edit"}
                    inviteDatas={this.state.inviteDatas}
                    inviteDeleted={this.state.inviteDeleted}
                    newInviteDatas={this.state.newInviteDatas}
                    inviteResend={this.state.inviteResend}
                    groupName={this.props.group.groupName}
                    newName={this.state.groupName}
                    unsaved={this.state.unsaved}
                    onCancel={() => {
                        this.setState({ showConfirm: false });
                    }}
                    onConfirm={() => {
                      this.setState({ showConfirm: false });
                      this.updateGroup();
                    }}/>
                  :
                    <SweetAlert
                    type={"confirm-add"}
                    inviteDatas={this.state.inviteDatas}
                    unsaved={this.state.unsaved}
                    onCancel={() => {
                        this.setState({ showConfirm: false });
                    }}
                    onConfirm={() => {
                      this.setState({ showConfirm: false });
                      this.createGroup();
                    }}/>
                  )
                }
            </div>
          </div>
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
  var groupUsers=[];
  var groupUsersSurveyed=[];
  var groupUserEmails=[];
  var groupUserEmailsSurveyed=[];
  var handleGroup = Meteor.subscribe('group',{creatorId: Meteor.userId()},{}, {
    onError: function (error) {
          console.log(error);
      }
  });

  if(handleGroup.ready()){
    count =  Group.find({creatorId: Meteor.userId()}).count();

    if(props.group){
      groupUsers = Meteor.users.find(
        {
          "_id" : {$in:props.group.userIds}
        }).fetch();
      
      if(props.group.userIdsSurveyed){
        groupUsersSurveyed = groupUsers.filter(user => props.group.userIdsSurveyed.indexOf(user._id) > -1);
      }

      groupUserEmails= groupUsers.map( (user) => user && user.emails && user.emails[0] && user.emails[0].address);
      groupUserEmailsSurveyed= groupUsersSurveyed.map( (user) => user && user.emails && user.emails[0] && user.emails[0].address);
    }
    

    dataReady = true;
  }
  return {
      count:count,
      groupUsers: groupUsers,
      groupUserEmails: groupUserEmails,
      groupUserEmailsSurveyed: groupUserEmailsSurveyed,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(InviteGroup);
