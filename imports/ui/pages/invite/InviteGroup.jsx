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
        inviteLastSuccess:undefined,
        inviteLastEmail:undefined,
        inviteLastUsername:undefined
      }
  }

  handleSubmit (event) {
    event.preventDefault();
    
    // var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    // var name = ReactDOM.findDOMNode(this.refs.name).value.trim();

    // this.setState({
    //   inviteStatus: 'sending',
    //   inviteLastEmail: email,
    //   inviteLastUsername:name
    // });

    // Meteor.call('invite', name, email, (err, userId) => {
    //   if(err){
    //       console.log("error", err);
    //       this.setState({
    //         inviteStatus: 'error',
    //       });
    //   }else{
    //     this.setState({
    //       inviteStatus: 'sent',
    //       inviteSuccess:true,
    //       inviteLastSuccess: userId
    //     });
    //   }
    // });
}

handleSelectChange (value) {
    console.log('You\'ve selected:', value);
    if(value && value.length > 0){
        var valueArray = value.split(",");
        var lastValue  = valueArray [valueArray.length-1];

        this.setState({
            lastValue: lastValue,
            value: value,
            options: this.state.options.concat([ { label: lastValue, value: lastValue }])
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
    if(this.props.count && this.props.count > 0){
            this.props.showInviteGroup(false);
        }
    }

    render() {
    if(this.props.dataReady){
      if(this.state.inviteSuccess){
        return (
          <div className="fillHeight flex-start">
            <div className="emptymessage"><img className="image-6" src="/img/avatar_group_2.png"/>
                <div className="emptytext">Awesome!
                <br/>Your invitation is sent to {666} people
                <br/>When they sign up, you can view their profiles
                </div>
                <a className="invitebttn w-button" id="ok" onClick={this.handleBackArrowClick.bind(this)}>OK!</a>
            </div>

            {/* <div className="invitation-after"><img src="/img/avatar.png" className="invitation-face"/>
                <div className="fontreleway fontinvit-option">
                Invitation to {this.state.inviteLastEmail} is sent! 
                <br/>
                Choose one of following two options
                </div>
            </div>
            <div className="footersummary w-clearfix">
                <div className="footer-flex-container">
                <div className="bttn-area-summary">
                <Link className="fontreleway fontbttnsummary" to={`/quiz/${this.state.inviteLastSuccess}`}>Load questions about {this.state.inviteLastUsername}</Link>
                </div>
                <div className="bttn-area-summary _2">
                <a className="fontreleway fontbttnsummary" onClick={this.handleBackArrowClick.bind(this)}>Go back to the list</a></div>
                </div>
            </div> */}
          </div>
        )
      }
      else{
        return (
            <section className={"gradient"+this.props.currentUser.profile.gradient+" whiteText feed"}>
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  {this.props.count != undefined && this.props.count > 0 &&
                    <a className="w-clearfix w-inline-block" onClick={this.handleBackArrowClick.bind(this)}>
                    <img className="image-7" src="/img/arrow_white.png"/>
                    </a>
                  }
                </div>
                <div className="screentitle w-clearfix">
                  <div className="titleGr">Create a new group</div>
                </div>
              </div>
              <div className="contentwrapper invite">

                
                <div className="inviteform w-form">
                    <form className="groupform inviteformstyle" data-name="Email Form" id="send" name="email-form">
                        <input className="formstyle w-input" data-name="Name" id="groupName" maxLength="256" name="name" placeholder="group name" type="text" required/>
                        {/* <select id="list_email" multiple="" className="tags formstyle w-input" parsley-trigger="change" required="" tabIndex="395">
                        </select> */}
                        <Creatable
                            closeOnSelect={true}
                            disabled={false}
                            multi
                            onChange={this.handleSelectChange.bind(this)}
                            options={this.state.options}
                            placeholder="Email addresses"
                            removeSelected={true}
                            rtl={false}
                            simpleValue
                            value={this.state.value}
                        />
                        <div className="groupformtext">
                        Press Enter to add email address(es) <br/>
                        {this.state.lastValue &&
                         "Press backspace to remove " +  this.state.lastValue
                        }
                        </div>
                        <button className="formbttn invitebttn w-button" id="submitSend" data-wait="Please wait..." type="submit">send invitation</button>
                    </form>
                    
                    {/* <MultiSelect/> */}
                    {this.state.inviteStatus == 'sending' && 
                    <span className="sendingStatus"><img src="/img/status_sending.png"/>sending...</span>
                    }
                    {this.state.inviteStatus == 'sent' && 
                        <span className="sendingStatus"><img src="/img/status_sent.png"/>sent!</span>
                    }
                    {this.state.inviteStatus == 'error' &&
                        <span className="sendingStatus"><img src="/img/status_error.png"/>error sending email</span>
                    }
                    {this.state.inviteStatus == 'alreadyInvited' &&
                        <span className="sendingStatus"><img src="/img/status_error.png"/>Already Invited</span>
                    }
                </div>


                {/* <div className="inviteform w-form">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input className="emailfield font-white w-input" data-name="Name" id="name" maxLength="256" name="name" ref="name" placeholder="name" type="text" required/>
                  <input className="emailfield font-white w-input" data-name="Email" id="email" maxLength="256" name="email" ref="email" placeholder="email address" required type="email" style={{textTransform:"lowercase"}}/>
                    
                  <button className="formbttn invitebttn w-button" id="sendInvite" data-wait="Please wait..." type="submit"> send invitation</button>
                </form>
              
                
                </div> */}
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
  var handle = Meteor.subscribe('connections', {
    onError: function (error) {
          console.log(error);
      }
  });
  if(Meteor.user() && handle.ready()){
    count = Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
      {email : Meteor.user().emails && Meteor.user().emails[0].address},
      {email : Meteor.user().profile && Meteor.user().profile.emailAddress} ] }                                                       
    ).count();
    dataReady = true;
  }
  return {
      count:count,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(InviteGroup);
