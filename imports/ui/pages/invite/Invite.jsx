import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

class Invite extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
        inviteSuccess:false,
        inviteLastSuccess:undefined,
        inviteLastEmail:undefined,
        inviteLastUsername:undefined
      }
  }

  handleSubmit (event) {
    event.preventDefault();
    
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    var name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    var gender;

    if(ReactDOM.findDOMNode(this.refs.male).checked){
      gender = ReactDOM.findDOMNode(this.refs.male).value
    }else{
      gender = ReactDOM.findDOMNode(this.refs.female).value; 
    }

    this.setState({
      inviteStatus: 'sending',
      inviteLastEmail: email,
      inviteLastUsername:name
    });

    Meteor.call('invite', name, email, gender, (err, userId) => {
      if(err){
          console.log("error", err);
          this.setState({
            inviteStatus: 'error',
          });
      }else{
        this.setState({
          inviteStatus: 'sent',
          inviteSuccess:true,
          inviteLastSuccess: userId
        });
      }
    });
}

handleBackArrowClick(){
  if(this.props.count && this.props.count > 0){
    this.props.showInvite(false);
  }
}

  render() {
    if(this.props.dataReady){
      if(this.state.inviteSuccess){
        return (
          <div className="fillHeight flex-start">
            <div className="invitation-after"><img src="/img/avatar.png" className="invitation-face"/>
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
            </div>
          </div>
        )
      }
      else{
        return (
            <section className="fontreleway">
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  {this.props.count != undefined && this.props.count > 0 &&
                    <a className="w-clearfix w-inline-block" onClick={this.handleBackArrowClick.bind(this)}>
                    <img className="image-7" src="/img/arrow.svg"/>
                    </a>
                  }
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                  Invite teammate
                </div>
              </div>
              <div className="contentwrapper invite">
                <div className="inviteform w-form">
                <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-field-wrapper">
                    <label className="fontreleway f-c-invite">Name</label>
                    <input type="text" className="form-invite w-input" maxLength="256" name="name" data-name="Name" placeholder="Name" id="name" ref="name" required/>
                  </div>

                  <div className="form-field-wrapper">
                    <label className="fontreleway f-c-invite">Email</label>
                    <input type="email" className="form-invite w-input" maxLength="256" name="email" data-name="Email" placeholder="Email address" id="email" ref="email" required style={{textTransform:"lowercase"}}/>
                  </div>

                  <div className="form-field-wrapper">
                    <label className="fontreleway f-c-invite">Gender</label>
                    <div className="form-radio-group">
                      <div className="form-radio w-radio">
                        <input type="radio" name="gender" id="m" ref="male" value="Male" className="w-radio-input" required/>
                        <label className="field-label w-form-label">Male</label>
                      </div>
                      <div className="form-radio w-radio">
                        <input type="radio" name="gender" id="f" ref="female" value="Female" className="w-radio-input" required/>
                        <label className="field-label w-form-label">Female</label>
                      </div>
                    </div>
                  </div>
                  <button className="bttn bttn-invite w-button" id="sendInvite" data-wait="Please wait..." type="submit"> send invitation</button>
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
                {this.state.inviteStatus == 'alreadyInvited' &&
                  <span className="sendingStatus"><img src="/img/status_error.png"/>Already Invited</span>
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
  var handleConnections = Meteor.subscribe('connections',
    { $or : [
      {inviteId:Meteor.userId()}, 
      {userId:Meteor.userId()}
      ]
    },
    {},
    {
    onError: function (error) {
          console.log(error);
      }
  });
  if(handleConnections.ready()){
    count = Connections.find( { $or : [
      {inviteId:Meteor.userId()}, 
      {userId:Meteor.userId()}
      ] }                                                       
    ).count();
    dataReady = true;
  }
  return {
      count:count,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(Invite);
