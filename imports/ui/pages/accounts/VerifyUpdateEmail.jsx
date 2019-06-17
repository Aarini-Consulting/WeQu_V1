import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import EmailVerified from './EmailVerified';

class EmailUpdateVerify extends React.Component {
  constructor(props){
    super(props);

    this.state={
        errorMessage:'',
        verifying:false,
        verified:false
  	}
  }

  componentDidMount() {
    this.verifyEmailChange(this.props.token)
  }

  componentWillReceiveProps(nextProps){
    this.verifyEmailChange(nextProps.token)
  }

  verifyEmailChange(token){
    var verified = this.props.currentUser && this.props.currentUser.emails[0].verified;
    if(!this.state.verifying && verified){
      this.setState({
          verifying: true,
        },()=>{
          Meteor.call('change.email.verify', token, ( error ) =>{
            if ( error ) {
              console.log(error);
              this.setState({
                errorMessage: error.message
              });
            } 
            else{
              this.setState({
                verified: true
              });
            }
        });
        
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
          <section className="fillHeight weq-bg">
          <br/> <br/>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="alert alert-warning">
              Verifying email....
              </div>
            </div>
            <div id="error"></div>
            <div id="info"></div>
          </div>
        </section>
      )
    }

    if(this.state.errorMessage != ''){
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
                <a className="resend-verification-link" onClick={()=>{
                    window.location.reload();
                }}>Try again</a>
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
              <p className="alert alert-warning">Your email has been successfully updated.
                <br/>
                <a className="resend-verification-link" href="/settings" >Next</a>
                <br/>
              </p>
            </div>
            </div>
          </section>
      )
    }
    return false;
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user(),
    token: props.match.params.token,
  };
})(EmailUpdateVerify);