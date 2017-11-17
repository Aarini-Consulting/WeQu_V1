import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

class EmailVerified extends React.Component {
  constructor(props){
    super(props);

    this.state={
  		sending:false,
  	}
  }

  sendVerificationLink(event){
    event.preventDefault();
    if(Meteor.userId() && !this.state.sending){
      $('#info').text('Please wait , processing ');  
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
          $('#info').text(`Verification sent to ${ this.props.currentUser.emails[ 0 ].address }!`, 'success');
        }
      });
    }
  }
  
  render() {
    if(Meteor.userId()){
      return (
        <section className={"gradient" + (this.props.currentUser.profile.gradient ? '' : currentUser.profile.gradient) + "whiteText alignCenter feed"}>
          <br/> <br/>
          
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <p className="alert alert-warning">You need to verify your email address before using wequ.
                <br/>
                <a className="resend-verification-link" onClick ={this.sendVerificationLink.bind(this)}>Resend verification link</a>
                <br/>
              </p>
            </div>
  
            <div id="error"></div>
            <div id="info"></div>
          </div>
  
        </section>
      );
    }else{
      return null;
    }
    
  }
}

export default withTracker((props) => {
    return {
        currentUser:Meteor.user(),
    };
  })(EmailVerified);
