import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Creatable } from 'react-select';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

// import MultiSelect from './MultiSelect';
// import '/imports/startup/client/react-select.css';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

class InviteGroup extends React.Component {
  constructor(props){
      super(props);
      this.state={
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
      if(nextProps.group){
        var copyStateData = [];
        nextProps.groupUsers.forEach(function(groupUser) {
          copyStateData.push({email:groupUser.emails[0].address});
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

  updateGroup(){
    var groupName = this.state.groupName;
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

    if(groupName && inviteDatas && inviteDatas.length >= 2){
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
      
      Meteor.call('updateGroup', this.props.group, groupName, inviteDatas, emailsArray , (err, res) => {
          if(err)
          {
            console.log(err);
            this.setState({
              inviteStatus: 'error',
              info: 'something went wrong',
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
  
      Meteor.call('createGroup', groupName, this.state.inviteDatas, emailsArray , (err, res) => {
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
              info: err.message,
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
          inviteStatus: 'error',
          info: 'Please enter a group name',
        });
      }
      else if(this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) > 12){
        this.setState({
          inviteStatus: 'error',
          info: 'Maximum amount of members reached',
        });
      }
      else if(!(this.props.group && this.props.group.isActive) && this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) < 2){
        this.setState({
          inviteStatus: 'error',
          info: 'Each group in a WeQ session must have at least 2 players',
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
        Meteor.call('resend.group.invite', this.props.group._id, email , (err, res) => {
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
          inviteStatus: 'error',
          info: 'cannot invite yourself',
        });
      }else if(emailsArray.indexOf(email) > -1){
        this.setState({
          inviteStatus: 'error',
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
              <div className="invitebttn bttnmembr gender w-clearfix selected noselect disabled">
                survey completed
              </div>
              :this.props.group 
                &&
                <div className="invitebttn bttnmembr gender w-clearfix noselect disabled">
                  survey incomplete
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
                        <div className="groupformtext">Group name</div>
                        <input type="text" ref="groupName" value={this.state.groupName} onChange={this.handleChange.bind(this)} autoComplete={"false"}
                        maxLength="256" required="" 
                        placeholder="group name" className="formstyle group-name w-input" 
                        required/>
                      </div>
                      :
                      <div>
                      <div className="groupformtext">What is the name of this group?</div>
                      <input type="text" ref="groupName" maxLength="256" required="" placeholder="group name" className="formstyle group-name w-input" autoComplete={"false"} 
                      value={this.state.groupName} 
                      onChange={this.handleChange.bind(this)} required/>
                      </div>
                    }
                  
                  <div className="groupformtext">Who should belong to this group?</div>

                  
                  {this.state.inviteDatas && this.state.inviteDatas.length > 0 && this.renderFieldTable()}
                  
                  {!(this.props.group && (this.props.group.isActive || this.props.group.isFinished)) &&
                  this.state.inviteDatas && (this.state.inviteDatas.length - this.state.inviteDeleted.length) < 12 
                  ?
                  <ol className="w-list-unstyled">
                    <li className="invite-group-line-wrapper w-clearfix">
                      <div className="font f_12">></div>
                      <input type="email" className="formstyle formuser formemail email w-input" maxLength="256" ref="email" placeholder="Email address" required={true} autoComplete={"false"}/>
                      {/* <div className={"invitebttn bttnmembr gender w-clearfix "+(this.state.gender == "Male" ? "selected" : "")} onClick ={this.setGender.bind(this,"Male")}>
                        Male
                      </div>
                      <div className={"invitebttn bttnmembr gender w-clearfix " + (this.state.gender == "Female" ? "selected" : "")}  onClick ={this.setGender.bind(this,"Female")}>
                        Female
                      </div> */}
                         <input type="submit" id="submitAdd" defaultValue="+ Add this person" className="invitebttn bttnmembr action w-button"/>
                    </li>
                  </ol>
                  :!(this.props.group && (this.props.group.isActive || this.props.group.isFinished)) &&
                  <ol className="w-list-unstyled">
                    <li className="invite-group-line-wrapper w-clearfix">
                      <div className="font f_12 center">Maximum amount of group member reached</div>
                    </li>
                  </ol>
                  }

                {this.state.inviteStatus == 'sending' && 
                <span className="sendingStatus">
                <img src="/img/status_sending.png"/>sending...
                <br/><br/>
                </span>
                }
                {this.state.inviteStatus == 'sent' && 
                    <span className="sendingStatus">
                    <img src="/img/status_sent.png"/>sent!
                    <br/><br/>
                    </span>
                }
                {this.state.inviteStatus == 'error' && 
                    this.state.info &&
                      <span className="sendingStatus">
                      <img src="/img/status_error.png"/>{this.state.info}
                      <br/><br/>
                      </span>
                      // :
                      // <span className="sendingStatus"><img src="/img/status_error.png"/>error</span>
                }
                {(!this.props.isEdit || this.state.modifiedByUser) && this.state.inviteStatus == 'error' 
                  ?
                    <a id="submitSend" className="invitebttn formbttn w-button" onClick ={this.handleBackArrowClick.bind(this)}>Back to group list</a>
                  :(!this.props.isEdit || this.state.modifiedByUser) && this.state.inviteStatus != 'sending' &&
                    <a id="submitSend" className="invitebttn formbttn w-button" onClick ={this.handleSubmitButton.bind(this)}>save</a>
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
    }
    

    dataReady = true;
  }
  return {
      count:count,
      groupUsers: groupUsers,
      groupUserEmails: groupUsers.map( (user) => user.emails[0].address),
      groupUserEmailsSurveyed: groupUsersSurveyed.map( (user) => user.emails[0].address),
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(InviteGroup);
