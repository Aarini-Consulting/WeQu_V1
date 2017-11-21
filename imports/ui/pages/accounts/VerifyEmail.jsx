import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Accounts } from 'meteor/accounts-base'

import EmailVerified from './EmailVerified'; 

class EmailVerify extends React.Component {
  constructor(props){
    super(props);

    this.state={
  		errorMessage:'',
      verifying:false,
      verified:false
  	}
  }

  componentWillMount() {
    this.verifyEmail(this.props.token)
  }

  componentWillReceiveProps(nextProps){
    this.verifyEmail(nextProps.token)
  }

  verifyEmail(token){
    var verified = this.props.currentUser && this.props.currentUser.emails[0].verified;
    if(!this.state.verifying && !verified){
      this.setState({
          verifying: true,
        });

      Accounts.verifyEmail( token, ( error ) =>{
        if ( error ) {
          this.setState({
            errorMessage: error.reason
          });
        } 
        else{
          this.setState({
            verified: true
          });
        }
        this.setState({
            verifying: false
          });
      });

    }
  }

  render() {
    if(!Meteor.userId() && !this.props.token){
      return (
        <Redirect to={"/login"}/>
      )
    }

    if(this.state.verifying){
      return (
          <section className="gradient1 whiteText alignCenter feed">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <p className="alert alert-warning">Verifying email....
              </p>
            </div>
            </div>
          </section>
      )
    }

    if(this.state.errorMessage != ''){
      console.log(this.state.errorMessage);
      if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].verified){
        return (
          <Redirect to={"/"}/>
        )
      }
      return (
          <section className="gradient1 whiteText alignCenter feed">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <p className="alert alert-warning">There is a problem confirming your email: {this.state.errorMessage}
                <br/>
                <a className="resend-verification-link" href="/sign-up" >Try again</a>
                <br/>
              </p>
            </div>
            </div>
          </section>
        )
    }

    if(this.state.verified){
      return (
          <section className="gradient1 whiteText alignCenter feed">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <p className="alert alert-warning">Your email has confirmed successfully.
                <br/>
                <a className="resend-verification-link" href="/" >Next</a>
                <br/>
              </p>
            </div>
            </div>
          </section>
      )
    }
    // return (<EmailVerified/>);
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user(),
    token: props.match.params.token,
  };
})(EmailVerify);