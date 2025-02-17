import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';

import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';

class AdminGameMasterView extends React.Component {
    constructor(props){
        super(props);
        this.state={
            selectedUser:undefined,
            selectedUserGroupList:[],
            selectedGroup:undefined,
            matrixName1:"",
            matrixName2:"",
            matrixName3:"",
            matrixName4:"",
            matrixScore1:0,
            matrixScore2:0,
            matrixScore3:0,
            matrixScore4:0,
            matrixScoreMax:0,
            currentPageIndex:0,
            resultPerPage:10,
            loading:false
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.state.selectedUser){
            var groups = nextProps.groups.filter((group)=>{return group.creatorId == this.state.selectedUser._id});
            this.setState({selectedUserGroupList:groups});
        }
    }

    formatDate(date){
        return date.toLocaleDateString('nl-NL');
    }

    deleteGroup(group, event){
        event.preventDefault();
        this.setState({
            loading:true
        },()=>{
            Meteor.call( 'delete.group', group._id, ( error, response ) => {
                if ( error ) {
                  console.log(error);
                }
                this.setState({
                    loading:false
                });
            });
        });
    }

    setEditTypeform(group, event){
        event.preventDefault();
        if(group && group.typeformGraph){
            var matrix1 = group.typeformGraph[0];
            var matrix2 = group.typeformGraph[1];
            var matrix3 = group.typeformGraph[2];
            var matrix4 = group.typeformGraph[3];
            this.setState({
                matrixScore1:((matrix1 && matrix1.score) ? matrix1.score : 0),
                matrixScore2:((matrix2 && matrix2.score) ? matrix2.score : 0),
                matrixScore3:((matrix3 && matrix3.score) ? matrix3.score : 0),
                matrixScore4:((matrix4 && matrix4.score) ? matrix4.score : 0),
                matrixScoreMax:((matrix1 && matrix1.score) ? matrix1.total : 7),
                matrixName1:((matrix1 && matrix1.name) ? matrix1.name : "??"),
                matrixName2:((matrix1 && matrix2.name) ? matrix2.name : "??"),
                matrixName3:((matrix1 && matrix3.name) ? matrix3.name : "??"),
                matrixName4:((matrix1 && matrix4.name) ? matrix4.name : "??"),
            });
        }else{
            this.setState({
                matrixName1:"Psychological Safety",
                matrixName2:"Constructive Feedback",
                matrixName3:"Control over Cognitive Bias",
                matrixName4:"Social Norms",
            });
        }

        this.setState({
            selectedGroup:group,
        });
    }

    setShowGrouplist(user,groups,event){
        event.preventDefault();
        this.setState({
            selectedUser:user,
            selectedUserGroupList:groups,
            selectedGroup:undefined,
            matrixName1:"",
            matrixName2:"",
            matrixName3:"",
            matrixName4:"",
            matrixScore1:0,
            matrixScore2:0,
            matrixScore3:0,
            matrixScore4:0,
            matrixScoreMax:7,
        });
    }

    handleTypeformNameChange(stateName, event){
        this.setState({
            [stateName]:event.target.value
        });
    }

    handleTypeformScoreChange(stateName, event){
        var value = (event.target.value);
        if(value < 0){
            value = 0;
        }
        if(stateName != "matrixScoreMax"){
            if(value > this.state.matrixScoreMax){
                value = this.state.matrixScoreMax;
            }
        }
        this.setState({
            [stateName]:(value)
        });
    }

    validateScore(stateName){
        var valid = !isNaN(Number(this.state[stateName]));
        if(valid){
            return true;
        }else{
            this.setState({
                [stateName]:0
            });
            return false;
        }
    }

    handleTypeformSubmit(event){
        event.preventDefault();
        
        if(this.validateScore("matrixScore1") && this.validateScore("matrixScore2") && this.validateScore("matrixScore3") 
        && this.validateScore("matrixScore4") ){
            var typeformGraph = [
                {name:this.state.matrixName1,score:this.state.matrixScore1, total:this.state.matrixScoreMax},
                {name:this.state.matrixName2,score:this.state.matrixScore2, total:this.state.matrixScoreMax},
                {name:this.state.matrixName3,score:this.state.matrixScore3, total:this.state.matrixScoreMax},
                {name:this.state.matrixName4,score:this.state.matrixScore4, total:this.state.matrixScoreMax},
            ]
    
            this.setState({
                sending: true,
            });
    
            Meteor.call( 'set.typeform.graph', this.state.selectedGroup._id, typeformGraph, ( error, response ) => {
                this.setState({
                  sending: false,
                });
                if ( error ) {
                  console.log(error);
                }
            });
        }else{
            alert("invalid score");
        }
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

    renderGroupListName(groups){
        return groups.map((group) => {
            return(
                <div key={group._id + "_name"}>
                    {group.groupName}
                </div>
            )
          });
    }

    renderGroupListUserCount(groups){
        return groups.map((group) => {
            return(
                <div key={group._id + "_count"}>
                    {group && group.userIds && group.userIds.length}
                </div>
            )
          });
    }

    renderGroupListCreatedDate(groups){
        return groups.map((group) => {
            var createdAt = group.createdAt;

            if(createdAt){
                createdAt = this.formatDate(createdAt);
            }else{
                createdAt = "N/A"
            }
            return(
                <div key={group._id + "_created"}>
                    {createdAt}
                </div>
            )
          });
    }

    renderGroupListGameFinished(groups){
        return groups.map((group) => {
            return(
                <div key={group._id + "_isFinished"}>
                    {group.isFinished}
                </div>
            )
          });
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
                    <td>
                    <button className="tablinks" id="view1" onClick={this.deleteGroup.bind(this, group)}>
                    Delete Group
                    </button>
                    </td>
                </tr>
            )
          });
    }

    renderGamemasterListUsers(){
        var userList = this.props.listUsers;
        var userNumber = 0;
        if(this.state.currentPageIndex <= 0){
            userList = userList.slice(0,this.state.resultPerPage);
        }else{
            userNumber = this.state.currentPageIndex*this.state.resultPerPage;
            userList = userList.slice((this.state.currentPageIndex*this.state.resultPerPage),((this.state.currentPageIndex*this.state.resultPerPage)+this.state.resultPerPage));
        }

        return userList.map((user, index) => {
            var groups = this.props.groups.filter((group)=>{return group.creatorId == user._id});
            var users = [];
            groups.forEach((group) => {
                users = users.concat(group.userIds);
            });
            //remove duplicate
            users = [...new Set(users)];
            return (
                <tr key={user._id}>
                    {/* <td>{user.status.online 
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
                    <td>
                    {this.renderGroupListName(groups)}								
                    </td>
                    <td>
                    {this.renderGroupListUserCount(groups)}
                    {/* {users.length} */}
                    </td>
                    <td>
                    {this.renderGroupListCreatedDate(groups)}								
                    </td>
                    <td>
                    {this.renderGroupListGameFinished(groups)}								
                    </td>
                    <td>
                        <button className="tablinks" id="view1" onClick={this.setShowGrouplist.bind(this, user, groups)}>
                            Manage Groups
                        </button>
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
            if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].address == "admin@wequ.co"){
                if(this.state.selectedGroup){
                    return(
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="widget widget-fullwidth widget-small">
                                <div className="widget-head">
                                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={this.setEditTypeform.bind(this, undefined)}>
                                    <img className="image-7" src="/img/arrow.svg"/>
                                    </a>
                                </div>
                                <div className="table-responsive noSwipe">
                                    <table className="table table-fw-widget table-hover">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th style={{width:"50%"}}>{this.state.selectedGroup.groupName}</th>
                                                <th style={{width:"50%"}}></th>
                                            </tr>
                                        </thead>				
                                        
                                    </table>
                                    <form onSubmit={this.handleTypeformSubmit.bind(this)}>
                                    <label>all Matrix max value</label>
                                    <input className="w-input"  value={this.state.matrixScoreMax} type="number" required onChange={this.handleTypeformScoreChange.bind(this,"matrixScoreMax")}/>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Matrix 1 name</label>
                                            <input className="w-input"  value={this.state.matrixName1} type="text" required onChange={this.handleTypeformNameChange.bind(this,"matrixName1")}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Matrix 1 value</label>
                                            <input className="w-input"  value={this.state.matrixScore1} type="text" required onChange={this.handleTypeformScoreChange.bind(this,"matrixScore1")}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Matrix 2 name</label>
                                            <input className="w-input"  value={this.state.matrixName2} type="text" required onChange={this.handleTypeformNameChange.bind(this,"matrixName2")}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Matrix 2 value</label>
                                            <input className="w-input"  value={this.state.matrixScore2} type="text" required onChange={this.handleTypeformScoreChange.bind(this,"matrixScore2")}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>matrix 3 name</label>
                                            <input className="w-input"  value={this.state.matrixName3} type="text" required onChange={this.handleTypeformNameChange.bind(this,"matrixName3")}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Matrix 3 value</label>
                                            <input className="w-input"  value={this.state.matrixScore3} type="text" required onChange={this.handleTypeformScoreChange.bind(this,"matrixScore3")}/>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Matrix 4 name</label>
                                            <input className="w-input"  value={this.state.matrixName4} type="text" required onChange={this.handleTypeformNameChange.bind(this,"matrixName4")}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Matrix 4 value</label>
                                            <input className="w-input"  value={this.state.matrixScore4} type="text" required onChange={this.handleTypeformScoreChange.bind(this,"matrixScore4")}/>
                                        </div>
                                    </div>

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
                                        {!this.state.loading && 
                                            <tbody className="no-border-x">					
                                            {this.renderGroupListUser()}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                }
                else{
                    return (
                        <div className="w-block">
                            <div className="noSwipe">
                                <table className="table table-fw-widget table-hover no-overflow">
                                    <thead>
                                        <tr>
                                            <th style={{textAlign:"center"}}>#</th>
                                            <th style={{textAlign:"center"}}>Name </th>
                                            <th style={{textAlign:"center"}}>Email</th>
                                            <th style={{textAlign:"center"}}> Group Name</th>
                                            <th style={{textAlign:"center"}}>No of Users</th>
                                            <th style={{textAlign:"center"}}>Date Created</th>
                                            <th style={{textAlign:"center"}}>Game Finished</th>
                                            <th style={{textAlign:"center"}}></th>
                                            <th style={{textAlign:"center"}}>Game Master</th>
                                        </tr>
                                    </thead>
                                    <tbody className="no-border-x no-overflow">					
                                        {this.renderGamemasterListUsers()}
                                    </tbody>
                                </table>
                            </div>
                            <div className="div-block-center">
                                {this.renderPagination()}
                            </div>
                        </div>
                    );
                }
            }
            else{
                if(Meteor.userId() || this.props.currentUser){
                    Meteor.logout();
                }
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
        
    var query = {roles:{$elemMatch:{$eq:"GameMaster"}}};
    if(props.searchQuery){
        query["$or"] = [ 
            {"profile.firstName": {$regex:`.*${props.searchQuery}`}},
            {"profile.lastName": {$regex:`.*${props.searchQuery}`}},
            {"emails.address": {$regex:`.*${props.searchQuery}`}}
        ];
    }
    if(handleUsers.ready()){
        listUsers = Meteor.users.find(query).fetch();
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