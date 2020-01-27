import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class EmailUpdateVerify extends React.Component {
  constructor(props){
    super(props);

    this.state={
        error:undefined,
        verifying:false,
        emailChanged:false
  	}
  }

  componentDidMount() {
    this.verifyEmailChange(this.props.token)
  }

  verifyEmailChange(token){
    this.setState({
        verifying: true,
      },()=>{
        Meteor.call('change.email.verify', token, ( error ) =>{
          if ( error ) {
            console.log(error);
            this.setState({
              error: error
            });
          } 
          else{
            this.setState({
              emailChanged: true,
              error:undefined
            });
          }
      });
      
      this.setState({
          verifying: false
        });
    });
  }

  render() {
    if(this.props.token){
      if(this.state.verifying){
        return (
            <section className="fillHeight weq-bg">
            <br/> <br/>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="alert alert-warning">
                <T>weq.VerifyUpdateEmail.VerifyingEmail</T>
                </div>
              </div>
              <div id="error"></div>
              <div id="info"></div>
            </div>
          </section>
        )
      }
      if(this.state.emailChanged){
        return (
            <section className="fillHeight weq-bg">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <p className="alert alert-warning"><T>weq.VerifyUpdateEmail.YourEmailsuccessfullyUpdated</T>
                  <br/>
                  <a className="resend-verification-link" href="/" ><T>weq.VerifyUpdateEmail.ok</T></a>
                  <br/>
                </p>
              </div>
              </div>
            </section>
        )
      }else{
        if(this.state.error){
          return (
              <section className="fillHeight weq-bg">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <p className="alert alert-warning"><T>weq.VerifyUpdateEmail.ThereIsProblemConfirmingYourEmail</T> {this.state.error && this.state.error.message}
                    <br/>
                    <a className="resend-verification-link" onClick={()=>{
                        window.location.reload();
                    }}><T>weq.VerifyUpdateEmail.TryAgain</T></a>
                    <br/>
                  </p>
                </div>
                </div>
              </section>
            )
        }else{
          return(
            <section className="fillHeight weq-bg">
              <Loading/>
            </section>
          )
        }
      }
    }else{
      return(
        <Redirect to={"/"}/>
      );
    }
  }
}

export default withTracker((props) => {
  return {
    currentUser: Meteor.user(),
    token: props.match.params.token,
  };
})(EmailUpdateVerify);