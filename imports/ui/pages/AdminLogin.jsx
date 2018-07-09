import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class AdminLogin extends React.Component {
    handleSubmit(event){
        event.preventDefault();
        var loginEmail = ReactDOM.findDOMNode(this.refs.loginEmail).value.trim();
        var loginPassword = ReactDOM.findDOMNode(this.refs.loginPassword).value.trim();
        if(loginEmail == "admin@wequ.co"){
            Meteor.loginWithPassword(loginEmail, loginPassword, (err) => {
                if (err){
                  console.log(err);
                  $('#error').text(err.message);
                }
              });
        }else{
            $('#error').text("not an admin email");
        }
        
      }

    render() {
      return (
        <div className="fillHeight">
            <div className="menuBar margin-top">
                <a href="/"> Home 
                <img className="lg-icon" src="/img/login_button.png" />
                </a>
            </div>

            <center> Welcome to the admin login page </center>
            <div className="row" id="form"> 
                <div className="col-xs-12 col-md-12 col-sm-12">
                    <section className="signIn">
                        <div className="panel panel-default">
                            <form id="signIn" onSubmit={this.handleSubmit.bind(this)}>
                                <div className="row">
                                    <div className="col-md-1 col-sm-1 col-xs-1"> </div>
                                    <div className="col-md-10 col-sm-10 col-xs-10" >
                                        <div className="form-group">
                                            <input type="email" name="loginEmail"  ref="loginEmail" className="form-control input-lg light-grey-color" placeholder="admin email" required/>
                                            <input type="password" name="loginPassword" ref="loginPassword"className="form-control input-lg light-grey-color" placeholder="admin password" required/>
                                        </div>
                                        <input type="submit" id="grey-color" defaultValue="Log In" />
                                        <div id="error" className="black-text"></div>
                                    </div>
                                    <div className="col-md-1 col-sm-1 col-xs-1"> </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
      );
    }
  }
  