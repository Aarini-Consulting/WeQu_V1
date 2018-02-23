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
      return (
        <section className={"gradient" + (this.props.currentUser && this.props.currentUser.profile.gradient ? '' : currentUser.profile.gradient) + "whiteText alignCenter feed"}>
          <br/> <br/>
          
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="alert alert-warning">You need to verify your email address before using WeQ.
                <br/>
                <a className="resend-verification-link" onClick ={this.sendVerificationLink.bind(this)}>Resend verification link</a>
                <br/>
                {Meteor.userId() &&
                <div>
                <br/>
                <p>Have you placed the wrong email address?</p>
                <a onClick ={this.logout.bind(this)}>Click Here to register again</a>
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
