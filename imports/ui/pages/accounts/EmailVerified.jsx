import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class EmailVerified extends React.Component {
  constructor(props){
    super(props);

    this.state={
  		sending:false,
  	}
  }

  logout(){
    if(Meteor.userId()){
      Meteor.logout((error)=>{
        if(error){
          console.log(error);
        }
      });
    }else{
      this.props.history.replace('/sign-up');
    }
  }

  sendVerificationLink(event){
    event.preventDefault();
    if(Meteor.userId() && !this.state.sending){
      $('#info').text(i18n.getTranslation("weq.EmailVerified.pleaseWait"));  
      this.setState({
        sending: true,
      });
      Meteor.call( 'sendVerificationLink', Meteor.userId(), ( error, response ) => {
        this.setState({
          sending: false,
        });
        if ( error ) {
          console.log(err);
          $('#error').text(err.message);
        }else{
          //$('#info').text(`Verification sent to ${ this.props.currentUser.emails[ 0 ].address }!`, 'success');
          $('#info').text(i18n.getTranslation("weq.EmailVerified.verificationSent",{emailAddress: this.props.currentUser.emails[ 0 ].address }));
        }
      });
    }
  }
  
  render() {
      return (
        <section className="fillHeight weq-bg">
          <br/> <br/>
          
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="alert alert-warning">{<T>weq.EmailVerified.verifyEmail</T>}
                <br/>
                <a className="resend-verification-link" onClick ={this.sendVerificationLink.bind(this)}>{<T>weq.EmailVerified.resendVerification</T>}</a>
                <br/>
                {Meteor.userId() &&
                <div>
                <br/>
                <p>{<T>weq.EmailVerified.wrongEmail</T>}</p>
                <a onClick ={this.logout.bind(this)}>{<T>weq.EmailVerified.clickHere</T>}</a>
                </div>
                }
                
              </div>
            </div>
  
            <div id="error"></div>
            <div id="info"></div>
          </div>
  
        </section>
      );
  }
}

export default withTracker((props) => {
    return {
        currentUser:Meteor.user(),
    };
  })(EmailVerified);
