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
    }

    formatDate(date){
      return date.toString();
    }

    handleCheckGameMaster(user, event) {
        var callFunction = false;
        if(Roles.userIsInRole(user._id,'GameMaster')){
            if (confirm("Are you sure? Removing gamemaster status will permanently delete all group (and its associated data) created by "+user.profile.firstName+" "+user.profile.lastName)) {
                callFunction = true;
            } else {
                callFunction = false
            }
        }else{
            callFunction = true;
        }
        
        if(callFunction){
            Meteor.call('addRoleGameMaster', user._id , function (err, result) {
                if(err){
                    console.log(err)
                }
            });
        }
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
                    <td>{user && user.status && user.status.online 
                        ?
                        <span className="badge badge-success">&nbsp;</span>
                        :
                        <span className="badge badge-warning">&nbsp;</span>
                        }
                    </td>
    
                    <td className="user-avatar">
                        <div><span className="status"></span>
                        {user.profile && user.profile.pictureUrl
                            ? <img className="img-circle" width="75" height="75" src={user.profile.pictureUrl}/>
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
                            <a className="colorRed" href={user.profile.publicProfileUrl} target="_blank">{user.profile.publicProfileUrl}</a>
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
                    <td id="user">{this.formatDate(user.createdAt)}</td>
                    <td id="user">
                    {user && user.status && user.status.lastLogin && user.status.lastLogin.date  
                    ? this.formatDate(user.status.lastLogin.date)
                    : "N/A"
                    }
                    </td>
                </tr>
            );
          });
        
    }
    render() {
        if(this.props.dataReady){
            return (
                <div className="fillHeight">
                    <div className="widget-head">
                        <div className="title"><strong>{this.props.listUsers.length}</strong> Users </div>
                    </div>
                    <div className="tabs w-tabs noSwipe">
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
                            <tbody className="no-border-x overflow">
                                {this.renderUserList()}
                            </tbody>
                        </table>
                    </div>
                    <div className="div-block-center">
                        <h1>Im a footer</h1>
                    </div>
                </div>
            );
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
    var handle = Meteor.subscribe('users',{}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});


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
  
  
  