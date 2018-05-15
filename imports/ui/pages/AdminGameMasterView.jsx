import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


import Loading from '/imports/ui/pages/loading/Loading';

class AdminGameMasterView extends React.Component {
    constructor(props){
        super(props);
        this.state={
            selectedUser:undefined,
            selectedUserGroupList:[],
            selectedGroup:undefined,
        }
    }

    setEditTypeform(group, event){
        event.preventDefault();
        this.setState({
            selectedGroup:group
        });
    }

    setShowGrouplist(user,groups,event){
        event.preventDefault();
        this.setState({
            selectedUser:user,
            selectedUserGroupList:groups,
            selectedGroup:undefined
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

    renderGroupListUser(){
        return this.state.selectedUserGroupList.map((group) => {
            return(
                <tr key={group._id}>
                    <td>
                    {group.groupName}									
                    </td>
                    <td>
                    <button className="tablinks" id="view1" onClick={this.setEditTypeform.bind(this, group)}>
                        Edit Typeform Score
                    </button>
                    </td>
                </tr>
            )
          });
    }

    renderGamemasterListUsers(){
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
                    {groups.length}									
                    </td>
                    <td id="user">
                    {users.length}
                    </td>
                    <td id="user">
                        <button className="tablinks" id="view1" onClick={this.setShowGrouplist.bind(this, user, groups)}>
                            Edit Typeform Score
                        </button>
                    </td>
                </tr>
            );
          });
    }

    render() {
        if(this.props.dataReady){
            if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].address == "admin@wequ.co"){
                if(this.state.selectedGroup){
                    return(
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-fullwidth widget-small">
                                <div className="widget-head">
                                    <div className="title"><strong>{this.state.selectedUserGroupList.length}</strong> Groups </div>
                                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={this.setEditTypeform.bind(this, undefined)}>
                                    <img className="image-7" src="/img/arrow.svg"/>
                                    </a>
                                </div>
                                <div className="table-responsive noSwipe">
                                    <form>
                                    <input className="w-input"  ref="matrix1" type="number" required/>
                                    <input className="w-input"  ref="matrix2" type="number" required/>
                                    <input className="w-input"  ref="matrix3" type="number" required/>
                                    <input className="w-input"  ref="matrix4" type="number" required/>
                                    <input className="w-input"  ref="matrix5" type="number" required/>
                                    <input className="submit-button w-button" type="submit" value="Set Typeform Score"/>
                                    </form>
                                </div>
                            </div>
                        </div>
                    );
                }
                else if(this.state.selectedUser){
                    return(
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-fullwidth widget-small">
                                <div className="widget-head">
                                    <div className="title"><strong>{this.state.selectedUserGroupList.length}</strong> Groups </div>
                                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={this.setShowGrouplist.bind(this, undefined, [])}>
                                    <img className="image-7" src="/img/arrow.svg"/>
                                    </a>
                                </div>
                                <div className="table-responsive noSwipe">
                                    <table className="table table-fw-widget table-hover">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th style={{width:"50%"}}>Group Name</th>
                                                <th style={{width:"50%"}}></th>
                                            </tr>
                                        </thead>
                                        <tbody className="no-border-x">					
                                            {this.renderGroupListUser()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                }
                else{
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
                                                <th style={{width:"20%"}}> No of Groups</th>
                                                <th style={{width:"20%"}}>No of Users</th>
                                                <th style={{width:"20%"}}></th>
                                            </tr>
                                        </thead>
                                        <tbody className="no-border-x">					
                                            {this.renderGamemasterListUsers()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                }
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