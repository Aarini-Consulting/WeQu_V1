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
            matrixName1:"Psychological Safety",
            matrixName2:"Constructive Feedback",
            matrixName3:"Cognitive Bias",
            matrixName4:"Social Norms",
            matrixScore1:0,
            matrixScore2:0,
            matrixScore3:0,
            matrixScore4:0,
            matrixScoreMax:0,
        }
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
                matrixScoreMax:((matrix1 && matrix1.score) ? matrix1.total : 7)
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
            matrixName1:"Psychological Safety",
            matrixName2:"Constructive Feedback",
            matrixName3:"Cognitive Bias",
            matrixName4:"Social Norms",
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