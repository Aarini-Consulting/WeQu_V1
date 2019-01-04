import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


import Loading from '/imports/ui/pages/loading/Loading';
import AdminLogin from '/imports/ui/pages/AdminLogin';
import AdminGameMasterView from '/imports/ui/pages/AdminGameMasterView';

class AdminUserView extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            currentPageIndex:0,
            resultPerPage:10
        };
    }

    formatDate(date){
      return date.toLocaleDateString('nl-NL');
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
        var userList = this.props.listUsers;
        var userNumber = 0;
        if(this.state.currentPageIndex <= 0){
            userList = userList.slice(0,this.state.resultPerPage);
        }else{
            userNumber = this.state.currentPageIndex*this.state.resultPerPage;
            userList = userList.slice((this.state.currentPageIndex*this.state.resultPerPage),((this.state.currentPageIndex*this.state.resultPerPage)+this.state.resultPerPage));
        }
        return userList.map((user, index) => {
            return (
                <tr key={user._id}>
                    {/* <td>{user && user.status && user.status.online 
                        ?
                        <span className="badge badge-success">&nbsp;</span>
                        :
                        <span className="badge badge-warning">&nbsp;</span>
                        }
                    </td> */}
    
                    {/* <td className="user-avatar">
                        <div><span className="status"></span>
                        {user.profile && user.profile.pictureUrl
                            ? <img className="img-circle" width="75" height="75" src={user.profile.pictureUrl}/>
                            : <img className="img-circle" width="75" height="75" src="/img/profile/profile4.png"/>
                        }
                        </div>
                    </td> */}
    
                    <td>
                        {userNumber+index+1}
                    </td>
                    <td>
                        {user.profile 
                        ?
                        <p>
                            {user.profile.firstName}
                            {user.profile.lastName}
                        </p>
                        :
                        <span className="badge badge-info">
                        admin user
                        </span>
                        }
                    </td>
                    <td>
                        {user.profile && user.profile.publicProfileUrl &&
                            <span className="badge">
                            <a className="colorRed" href={user.profile.publicProfileUrl} target="_blank">{user.profile.publicProfileUrl}</a>
                            </span>
                        }
                        {user.emails &&
                        user.emails.map((email) =>
                        <p key={email.address}>
                            {email.address}
                        </p>
                        )
                        }
                    </td>
                    {/* <td id="user">
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
    
                    </td> */}
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
                    <td>
                    <label className="switch">
                        <input type="checkbox" checked={user.roles && user.roles.indexOf("GameMaster") > -1}
                         onChange={this.handleCheckGameMaster.bind(this,user)}/>
                        <div className="slider round"></div>
                    </label>	
                    </td>
                </tr>
            );
          });
    }

    setCurrentPageIndex(index){
        var max = Math.ceil(this.props.listUsers.length/this.state.resultPerPage)-1;
        if(index < 0){
            index = 0;
        }
        if(index > max){
            index = max;
        }
        this.setState({ currentPageIndex: index });
    }

    renderPagination(){
        var rows = [];
        var pageCount = Math.ceil(this.props.listUsers.length/this.state.resultPerPage);
        var initialStart = 0;
        var initialSize = 10;
        var initialThreshold = Math.round(initialSize*0.5+1);

        var size;
        var start;
        if(this.state.currentPageIndex + 1 > initialThreshold){
          size = this.state.currentPageIndex + 1 + (initialSize - initialThreshold);
          start = size - initialSize;
        }else{
          size = initialSize;
          start = initialStart;
        }

        if(size > pageCount){
          size = pageCount;
        }

        if(start < 0){
          start = 0;
        }

        rows.push(
            <a key={"pagination-nav-prev"} onClick={this.setCurrentPageIndex.bind(this,(this.state.currentPageIndex-1))}> 
                <div className="user-pagination-nr font-t font-pag  font-pag-active"> &#10096; </div> 
            </a>
        );

        for (i = start; i < size; i++) {
            if(i==this.state.currentPageIndex){
                rows.push(
                    <a key={"pagination-"+i}> 
                    <div className="user-pagination-nr font-t font-pag  font-pag-active"> {i+1} </div> 
                    </a>
                );
            }
            else{
                rows.push(
                <a key={"pagination-"+i} onClick={this.setCurrentPageIndex.bind(this,i)}>
                    <div className="user-pagination-nr font-t font-pag" >  {i+1} </div>
                </a>
                );
            }
        }

        rows.push(
            <a key={"pagination-nav-next"} onClick={this.setCurrentPageIndex.bind(this,(this.state.currentPageIndex+1))}> 
                <div className="user-pagination-nr font-t font-pag  font-pag-active"> &#10097; </div> 
            </a>
        );

        return (
            <div className="w-inline-block">
                {rows}
            </div>
        )
    }
    render() {
        if(this.props.dataReady){
            return (
                <div className="w-block">
                    <div className="tabs w-tabs noSwipe">
                        <table className="table table-fw-widget table-hover">
                            <thead>
                                <tr>
                                    <th style={{textAlign:"center"}}>#</th>
                                    <th style={{textAlign:"center"}}>Name</th>
                                    <th style={{textAlign:"center"}}>Email</th>
                                    <th style={{textAlign:"center"}}> Email Confirmed</th>
                                    <th style={{textAlign:"center"}}>Created</th>
                                    <th style={{textAlign:"center"}}> Last Login</th>
                                    <th style={{textAlign:"center"}}>Game Master</th>
                                </tr>
                            </thead>
                            <tbody className="no-border-x overflow">
                                {this.renderUserList()}
                            </tbody>
                        </table>
                    </div>
                    <div className="div-block-center">
                        {this.renderPagination()}
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
    var query = {};
    if(props.searchQuery){
        query = {$or : [ 
            {"profile.firstName": {$regex:`.*${props.searchQuery}`}},
            {"profile.lastName": {$regex:`.*${props.searchQuery}`}},
            {"emails.address": {$regex:`.*${props.searchQuery}`}}
        ]};
    }

    if(handle.ready()){
        listUsers = Meteor.users.find(query).fetch();
        dataReady = true;
    }
    return {
        currentUser: Meteor.user(),
        listUsers: listUsers,
        dataReady:dataReady
    };
})(AdminUserView);
  
  
  