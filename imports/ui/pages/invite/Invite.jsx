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
        inviteLastSuccess:undefined
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
          <section className={"gradient"+this.props.currentUser.profile.gradient+" whiteText alignCenter"}>
              <h2 style={{width:65+'%'}}>
              Well done!<br/>
              <Link to={`/quiz/${this.state.inviteLastSuccess}`}>Now Answer more question about this person</Link>
              
              </h2>
              {/* <img src="/img/next.png" id="next" style={{width:60+'px', marginTop:30+'%'}}/> */}
  
              <h2 style={{width:65+'%'}}>
              <a onClick={this.handleBackArrowClick.bind(this)}>Maybe later...</a>
              </h2>
          </section>
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
                  <div className="titleGr">Invite teammate</div>
                </div>
              </div>
              <div className="contentwrapper invite">
                <div className="inviteform w-form">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input className="emailfield font-white w-input" data-name="Name" id="name" maxLength="256" name="name" ref="name" placeholder="name" type="text" required/>
                  <input className="emailfield font-white w-input" data-name="Email" id="email" maxLength="256" name="email" ref="email" placeholder="email address" required type="email" style={{textTransform:"lowercase"}}/>
                  <div className="w-radio">
                    <label className="w-form-label font-text-20"><input type="radio" name="gender" id="m" ref="male" value="Male" className="gender" required/>male</label>
                  </div>
                  <div className="w-radio">
                    <label className="w-form-label font-text-20"><input type="radio" name="gender" id="f" ref="female" value="Female" className="gender margin10" required/>female</label>
                  </div>
                    
                  <button className="formbttn invitebttn w-button" id="sendInvite" data-wait="Please wait..." type="submit"> send invitation</button>
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
})(Invite);
