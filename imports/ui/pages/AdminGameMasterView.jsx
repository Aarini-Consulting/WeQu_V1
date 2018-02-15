import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


import Loading from '/imports/ui/pages/loading/Loading';

class AdminGameMasterView extends React.Component {
    handleCheckGameMaster(user, event) {
        // const target = event.target;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // const name = target.name;
        // console.log(event);
        console.log(user);

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

    renderGroupListUsers(){
        return this.props.listUsers.map((user) => {
            var groups = this.props.groups.filter((group)=>{return group.creatorId == user._id});
            var users = [];
            groups.forEach((group) => {
                users = users.concat(group.emails);
            });
            //remove duplicate
            users = [...new Set(users)];

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
                    {groups.length}									
                    </td>
                    <td id="user">
                    {users.length}
                    </td>
                </tr>
            );
          });
    }
    render() {
        if(this.props.dataReady){
            if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].address == "admin@wequ.co"){
                return (
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
                                            <th style={{width:"10%"}}>Name / Email</th>
                                            <th style={{width:"10%"}}>Game Master</th>
                                            <th style={{width:"40%"}}> No of Groups</th>
                                            <th style={{width:"40%"}}>No of Users</th>
                                        </tr>
                                    </thead>
                                    <tbody className="no-border-x">					
                                        {this.renderGroupListUsers()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            }
            else{
                return(
                    <AdminLogin/>
                )
                
            }
        }
        else{
            return(
                <Loading/>
              );
        }
    }
  }

export default withTracker((props) => {
    var dataReady;
    var listUsers;
    var groups;
    let handleGroup;
    var handleUsers = Meteor.subscribe('users', {roles:{$elemMatch:{$eq:"GameMaster"}}}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});
    if(handleUsers.ready()){
        listUsers = Meteor.users.find({roles:{$elemMatch:{$eq:"GameMaster"}}}).fetch();
        if(listUsers){
            handleGroup = Meteor.subscribe('group',
            {creatorId:{ $in: listUsers.map((user)=>{return user._id}) }},
            {}, 
            {
                onError: function (error) {
                        console.log(error);
                    }
                });

            if(handleGroup.ready()){
                groups = Group.find({creatorId:{ $in: listUsers.map((user)=>{return user._id}) }}).fetch();
                dataReady = true;
            }
        }else{
            dataReady = true;
        }
    }
    
    return {
        currentUser: Meteor.user(),
        listUsers: listUsers,
        groups: groups,
        dataReady:dataReady
    };
})(AdminGameMasterView);