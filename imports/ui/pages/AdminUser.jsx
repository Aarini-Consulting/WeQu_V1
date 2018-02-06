import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


import Loading from '/imports/ui/pages/loading/Loading';
import AdminLogin from '/imports/ui/pages/AdminLogin';
import AdminGameMasterView from '/imports/ui/pages/AdminGameMasterView';

class AdminUser extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showGameMaster:false,
        }
    }

    setShowGameMaster(bool, event){
        this.setState({
            showGameMaster: bool,
        });
    }

    handleCheckGameMaster(user, event) {
        // const target = event.target;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // const name = target.name;
        // console.log(event);

        Meteor.call('addRoleGameMaster', user._id , function (err, result) {
            if(err){
                console.log(err)
            }
        });
      }

    renderEmailsVerified(user){
        if(user.emails && user.emails[0].verified){
            return(
                <span className="badge badge-success">YES</span>
            )
        }
        else if(user.emails){
            return(
                <span className="badge badge-warning">NO</span>
            );
        }else{
            return (
                <span className="badge badge-default">NA</span>
            )
        }
    }

    
    renderUserList(){
        return this.props.listUsers.map((user) => {
            return (
                <tr key={user._id}>
                    <td>{user.status.online 
                        ?
                        <span className="badge badge-success">&nbsp;</span>
                        :
                        <span className="badge badge-warning">&nbsp;</span>
                        }
                    </td>
    
                    <td className="user-avatar">
                        <div><span className="status"></span>
                            {user.profile && user.profile.pictureUrl
                            ? <img className="img-circle" src={user.profile.pictureUrl}/>
                            : <img className="img-circle" width="75" height="75" src="/img/profile/profile4.png"/>
                            }
                        </div>
                    </td>
    
    
                    <td id="user">
                        {user.profile 
                        ?
                        <b className="text-capitalize">
                            {user.profile.firstName}
                            {user.profile.lastName}
                        </b>
                        :
                        <b className="text-capitalize">
                        admin user
                        </b>
                        }
                        <br/>
                        {user.profile && user.profile.publicProfileUrl &&
                            <span className="badge">
                            <a className="colorRed" href={profile.publicProfileUrl} target="_blank">{profile.publicProfileUrl}</a>
                            </span>
                        }
                        <br/>
                        {user.emails &&
                        user.emails.map((email) =>
                        <span className="badge badge-info" key={email.address}>
                            <h5 className="pull-left"> {email.address}</h5>
                        </span>
                        )
                        }
                    </td>
                    <td>
                    <label className="switch">
                        <input type="checkbox" checked={user.roles && user.roles.indexOf("GameMaster") > -1}
                         onChange={this.handleCheckGameMaster.bind(this,user)}/>
                        <div className="slider round"></div>
                    </label>	
                    </td>
                    <td id="user">
                        <span className="badge badge-info">
                        {user.services.linkedin
                        ? "LinkedIn"
                        : "Wequ"
                        }
                        </span>
    
                        {user.roles &&
                        user.roles.map((role) =>
                        <span className="badge badge-info" key={role}>
                            {role}
                        </span>
                        )
                        }
    
                        {user.services.invitationId &&
                        <span className="badge badge-info">
                            Invited
                        </span>
                        }
    
                    </td>
                    <td id="user">
                        {this.renderEmailsVerified(user)}
                    </td>
                    <td id="user">{formatDate(user.createdAt)}</td>
                    <td id="user">
                    {user.status.lastLogin && user.status.lastLogin.date  
                    ? formatDate(user.status.lastLogin.date)
                    : "N/A"
                    }
                    </td>
                </tr>
            );
          });
        
    }
    render() {
        if(this.props.dataReady){
            if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].address == "admin@wequ.co"){
                return (
                    <div className="fillHeight">
                      <div className="menuBar">
                          <a href="#" id="logout"> 
                          <img className="lg-icon" src="/img/login_button_deactive.png" />
                          </a>
                      </div>
          
                      <div className="row overflow"> 
                          <div className="col-md-12 col-sm-12 col-xs-12">
                              <center> Welcome to the admin Dashboard </center>
                              <div className="tab row">
                                  <div className="col-md-4 col-sm-4 col-xs-4">
                                  <button className={"tablinks " + (this.state.showGameMaster && "active2")} id="view1" onClick={this.setShowGameMaster.bind(this,false)}>
                                  All Users
                                  </button>
                                  </div>
                                  <div className="col-md-4 col-sm-4 col-xs-4">
                                  <button className={"tablinks " + (!this.state.showGameMaster && "active2")} id="view2" onClick={this.setShowGameMaster.bind(this,true)}>
                                  GameMaster
                                  </button>
                                  </div>
                                  <div className="col-md-4 col-sm-4 col-xs-4"> </div>
                              </div>
                              {this.state.showGameMaster 
                              ?
                              <AdminGameMasterView/>
                              :
                              <div className="col-md-12 col-sm-12 col-xs-12">
                                  <div className="widget widget-fullwidth widget-small">
                                      <div className="widget-head">
                                          <div className="title"><strong>{this.props.listUsers.length}</strong> Users </div>
                                      </div>
                                      <div className="table-responsive noSwipe">
                                          <table className="table table-fw-widget table-hover">
                                              <thead>
                                                  <tr>
                                                      <th></th>
                                                      <th></th>
                                                      <th style={{width:10 +"%"}}>Name / Email</th>
                                                      <th style={{width:10 +"%"}}>Game Master</th>
                                                      <th style={{width:10 +"%"}}>Type</th>
                                                      <th style={{width:5 +"%"}}> Email Confirmed</th>
                                                      <th style={{width:20 +"%"}}>Created</th>
                                                      <th> Last Login</th>
                                                  </tr>
                                              </thead>
                                              <tbody className="no-border-x">
                                                  {this.renderUserList()}
                                              </tbody>
                                          </table>
                                      </div>
                                  </div>
                              </div>
                              }  
                          </div>
                      </div>
                      {/* <center>
                      <button><a href="/adminAccountCreation"> Create test account  </a> </button>
                      </center> */}
                  </div>
                );
            }else{
                return(
                    <AdminLogin/>
                )
                
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
    var listUsers;
    let handle = Meteor.subscribe("users");

    if(handle.ready()){
        listUsers = Meteor.users.find().fetch();
        dataReady = true;
    }
    return {
        currentUser: Meteor.user(),
        listUsers: listUsers,
        dataReady:dataReady
    };
})(AdminUser);
  
  
  