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

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

class InviteGroup extends React.Component {
  constructor(props){
      super(props);
      this.state={
        // options:[],
        // lastValue:undefined,
        // value:undefined,
        submitInvite:false,
        inviteStatus:false,
        inviteSuccess:false,
        gender:"Male",
        inviteDatas:[],
        newInviteDatas:[],
        modifiedByUser:false,
        showConfirm:false,
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isEdit && nextProps.group){
      if(nextProps.users){
        var copyStateData = this.state.inviteDatas.slice();
        var emailsArray = this.state.inviteDatas.map( (fields) => fields.email);

        nextProps.users.forEach(function(user) {
          var email = (user.emails && user.emails[0].address) || user.profile.emailAddress;
          if(emailsArray.indexOf(email) < 0){
            copyStateData.push({firstName:user.profile.firstName, 
              lastName:user.profile.lastName, email:email, gender:user.profile.gender});
          }
        });
        this.setState({
          info:undefined,
          inviteDatas: copyStateData,
          modifiedByUser: false,
        });
      }
    }
  }

  updateGroup(){
    var groupName = ReactDOM.findDOMNode(this.refs.groupName).value;
    if(groupName && this.state.inviteDatas && this.state.inviteDatas.length >= 2){
      var emailsArray = this.state.inviteDatas.map( (fields) => fields.email);

      this.setState({
        inviteStatus: 'sending',
      });
      
      Meteor.call('updateGroup', this.props.group, groupName, this.state.inviteDatas, emailsArray , (err, res) => {
          if(err)
          {
            console.log(err);
            this.setState({
              inviteStatus: 'error',
              info: 'something went wrong',
            });
          }else{
            var msg;
            if(res > 0){
              msg = res;
            }else{
              msg = true;
            }
            
            this.setState({
                inviteStatus: 'sent',
                inviteSuccess:msg
              });
          }     
      }); 
    }

    this.setState({
      submitInvite:false,
      newInviteDatas:[]
    });
  }

  createGroup(){
    var groupName = ReactDOM.findDOMNode(this.refs.groupName).value.trim();
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
              info: 'error sending email',
            });
          }     
      }); 
    }

    this.setState({
      submitInvite:false,
    });
  }

  handleSubmit (event) {
      event.preventDefault();
      if(this.state.submitInvite){
        
        ReactDOM.findDOMNode(this.refs.firstName).value="";
        ReactDOM.findDOMNode(this.refs.lastName).value="";
        ReactDOM.findDOMNode(this.refs.email).value="";

        this.setState({
          showConfirm: true,
        });
        // if(this.props.isEdit){
        //   this.updateGroup();
        // }else{
        //   this.createGroup();
        // } 
      }else{
        this.addField();
      }
  }

    handleBackArrowClick(){
    if(this.props.isEdit || (this.props.count && this.props.count > 0)){
            this.props.closeInviteGroup();
        }
    }

    setGender(g){
      this.setState({
        gender: g,
      });
    }

    deleteField(index){
      var copyStateData = this.state.inviteDatas.slice();
      copyStateData.splice(index,1);
      this.setState({
        inviteDatas: copyStateData,
        modifiedByUser: true
      });
    }

    resendInvite(index){
      var copyStateData = this.state.inviteDatas.slice();
      console.log(this.props.group);
      console.log(copyStateData[index]);

      if(this.props.group){
        this.setState({
          inviteStatus: 'sending',
        });
    
        Meteor.call('resend.group.invite', this.props.group._id, copyStateData[index].email , (err, res) => {
          if(res){
            this.setState({
                inviteStatus: 'sent',
                inviteSuccess:1,
              });
            }
            if(err)
            {
              this.setState({
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

      var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
      var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();
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
        copyStateDataNew.push({firstName:firstName, lastName:lastName, email:email, gender:this.state.gender});
        copyStateData.push({firstName:firstName, lastName:lastName, email:email, gender:this.state.gender});
        this.setState({
          info:undefined,
          inviteDatas: copyStateData,
          newInviteDatas:copyStateDataNew,
          modifiedByUser: true
        });

        ReactDOM.findDOMNode(this.refs.firstName).value="";
        ReactDOM.findDOMNode(this.refs.lastName).value="";
        ReactDOM.findDOMNode(this.refs.email).value="";
      }
    }


    renderFields(){
      return this.state.inviteDatas.map((data, index) => {
          return (
            <li className="w-clearfix invite-field" key={data.email}>
              <div className="font f_12">{index+1}</div>
              <input type="text" className="formstyle formuser fistName" disabled={true} value={data.firstName}/>
              <input type="text" className="formstyle formuser lastName " disabled={true} value={data.lastName}/>
              <input type="email" className="formstyle formuser formemail email" disabled={true} value={data.email}/>
              <div className="bttngender w-clearfix disabled">
                <div className={"fontreleway fgenderbttn " + (data.gender == "Male" ? "selected" : "disabled") + " noselect"} id="m">Male</div>
              </div>
              <div className="bttngender w-clearfix disabled">
                <div className={"fontreleway fgenderbttn " + (data.gender == "Female" ? "selected" : "disabled") + " noselect"} id="f">Female</div>
              </div>
              <div className="addDelete invitebttn bttnmembr resend w-button" onClick ={this.resendInvite.bind(this,index)}>R</div>
              <div className="addDelete invitebttn bttnmembr w-button" onClick ={this.deleteField.bind(this,index)}>Delete</div>
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

    triggerSubmitInvite(){
        this.setState({
          submitInvite: true,
        },
        ()=>{
          //callback after setting submit invite as true
          if(this.refs.form && this.refs.form.checkValidity()){
            this.refs.form.dispatchEvent(new Event("submit",{ cancelable: true }));
          }else{
            if(!ReactDOM.findDOMNode(this.refs.groupName).value){
              this.setState({
                inviteStatus: 'error',
                info: 'Please enter a group name',
              });
            }
            else if(this.state.inviteDatas && this.state.inviteDatas.length < 2){
              this.setState({
                inviteStatus: 'error',
                info: 'Please enter atleast two group members',
              });
            }
          }
        });
    }
  

    render() {
    if(this.props.dataReady){
      if(this.state.inviteSuccess){
        return (
          <div className="fillHeight flex-start">
          <section className="fontreleway groupbg">
            {this.props.isEdit 
            ?
            <div className="emptymessage"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext group">Awesome!
                <br/>Your changes has been saved
                {this.state.inviteSuccess && typeof this.state.inviteSuccess != "boolean" && this.state.inviteSuccess > 0 &&
                <div><br/>An invitation was sent to {this.state.inviteSuccess} people</div>
                }
                </div>
                <a className="invitebttn w-button" id="ok" onClick={this.handleBackArrowClick.bind(this)}>OK!</a>
            </div>
            :
            <div className="emptymessage"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext group">Awesome!
                <br/>Your invitation is sent to {this.state.inviteSuccess} people
                <br/>When they sign up, you can view their profiles
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
            <section className="fontreleway groupbg">
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  {(this.props.isEdit || (this.props.count != undefined && this.props.count > 0)) &&
                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={this.handleBackArrowClick.bind(this)}>
                    <img className="image-7" src="/img/arrow.svg"/>
                    </a>
                  }
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                  {this.props.isEdit 
                  ?
                    "Edit"
                  :
                    "Create a new group"
                  }
                </div>
              </div>
              <div className="contentwrapper invite">   
                <div className="inviteform w-form">
                    <form ref="form" onSubmit={this.handleSubmit.bind(this)} name="email-form" data-name="Email Form" className="inviteformstyle groupform">
                        {this.props.isEdit 
                          ? 
                          <div>
                          <div className="groupformtext">Group name</div>
                          <input type="text" ref="groupName" defaultValue={this.props.group.groupName} 
                          name="name" data-name="Name" maxLength="256" required="" 
                          placeholder="group name" className="formstyle w-input" 
                          onBlur={()=>{
                            if(!ReactDOM.findDOMNode(this.refs.groupName).value){
                              ReactDOM.findDOMNode(this.refs.groupName).value = this.props.group.groupName;
                            }else if(ReactDOM.findDOMNode(this.refs.groupName).value != this.props.group.groupName && !this.state.modifiedByUser){
                              this.setState({
                                modifiedByUser: true
                              });
                            }
                          }}
                          required/>
                          </div>
                          :
                          <div>
                          <div className="groupformtext">What is the name of this group?</div>
                          <input type="text" ref="groupName" name="name" data-name="Name" maxLength="256" required="" placeholder="group name" className="formstyle w-input" required/>
                          </div>
                        }
                      
                      <div className="groupformtext">Who should belong to this group?</div>

                      
                      {this.state.inviteDatas && this.state.inviteDatas.length > 0 && this.renderFieldTable()}
                      

                      <ol className="w-list-unstyled">
                        <li className="w-clearfix">
                          <div className="font f_12"></div>
                          <input type="text" className="formstyle formuser fistName w-input" maxLength="256" ref="firstName" placeholder="First name"  required={!this.state.submitInvite}/>
                          <input type="text" className="formstyle formuser lastName w-input" maxLength="256" ref="lastName" placeholder="Last name" required={!this.state.submitInvite}/>
                          <input type="email" className="formstyle formuser formemail email w-input" maxLength="256" ref="email" name="Email-2" placeholder="Email address" required={!this.state.submitInvite}/>
                          <div className="bttngender w-clearfix">
                            <div className={"fontreleway fgenderbttn " + (this.state.gender == "Male" ? "selected" : "")} id="m"  onClick ={this.setGender.bind(this,"Male")}>Male</div>
                          </div>
                          <div className="bttngender w-clearfix">
                            <div className={"fontreleway fgenderbttn " + (this.state.gender == "Female" ? "selected" : "")} id="f" onClick ={this.setGender.bind(this,"Female")}>Female</div>
                          </div>
                          <input type="submit" id="submitAdd" defaultValue="add" className="addDelete invitebttn bttnmembr add w-button"/>
                        </li>
                      </ol>

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
                    {(!this.props.isEdit || this.state.modifiedByUser) &&
                      <a id="submitSend" className="invitebttn formbttn w-button" onClick ={this.triggerSubmitInvite.bind(this)}>submit</a>
                    }
                    </form>

                    {this.state.showConfirm && 
                      (this.props.isEdit 
                      ?
                        <SweetAlert
                        type={"error"}
                        onCancel={() => {
                            this.setState({ showConfirm: false });
                        }}
                        onConfirm={() => {
                          this.updateGroup();
                        }}/>
                      :
                        <SweetAlert
                        type={"error"}
                        onCancel={() => {
                            this.setState({ showConfirm: false });
                        }}
                        onConfirm={() => {
                          this.createGroup();
                        }}/>
                      )
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
  var users;
  var handleGroup = Meteor.subscribe('group',{creatorId: Meteor.userId()},{}, {
    onError: function (error) {
          console.log(error);
      }
  });


  if(handleGroup.ready()){
    count =  Group.find({creatorId: Meteor.userId()}).count();
    if(props.isEdit && props.group){
      var handleUsers = Meteor.subscribe('users',{$or : [ {"emails.address" : {$in:props.group.emails}  }, { "profile.emailAddress" : {$in:props.group.emails}}]}, {}, {
        onError: function (error) {
                console.log(error);
            }
      });

      if(handleUsers.ready()){
        users = Meteor.users.find({$or : [ {"emails.address" : {$in:props.group.emails}  }, { "profile.emailAddress" : {$in:props.group.emails}}]}).fetch();
        dataReady = true;
      }
    }else{
      dataReady = true;
    }
    
  }
  return {
      count:count,
      currentUser: Meteor.user(),
      users:users,
      dataReady:dataReady
  };
})(InviteGroup);
