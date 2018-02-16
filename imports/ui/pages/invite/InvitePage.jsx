import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Invite from './Invite';

class InvitePage extends React.Component {
  constructor(props){
      super(props);
      this.state={
        deleting:false,
        showInvite:false,
      }
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.count && nextProps.count < 1)){
      this.setState({
        showInvite: true,
      });
    }
  }

  deletePersonalInvitation(user){
    if(this.state.deleting == false){
      this.setState({
        deleting: true,
      });
  
      Meteor.call('deletePersonalInvitation', user._id , (err, res) => {
          if(err)
          {
            console.log(err);
          }     
  
          this.setState({
            deleting: false,
          });
      }); 
    }
    
  }

  renderGroupFriendList(){
    return this.props.usersGroup.map((user, index) => {
        return (
            <div  key={user._id}>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                <Link className="avatawrapper padding10"  to={`/quiz/${user._id}`}>
                    {user.services && user.services.linkedin && user.services.linkedin.pictureUrl
                    ?
                    <div>
                    <img className="image-5 img-circle" src={user.services.linkedin.pictureUrl}/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? getUserName(user.profile) + " " + "( Invited You )" 
                        : getUserName(user.profile)
                    }
                    </span>
                    </div>
                    :    
                    <div>
                    <img className="image-5" src="/img/avatar.png"/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? getUserName(user.profile) + " " + "( Invited You )" 
                        : getUserName(user.profile)
                    }
                    </span>
                    </div>
                    } 
                </Link>
                </div>
              </div>
            </div>
        );
      });
  }

  renderFriendList(){
    return this.props.users.map((user, index) => {
        return (
            <div  key={user._id}>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                <Link className="avatawrapper padding10"  to={`/quiz/${user._id}`}>
                    {user.services && user.services.linkedin && user.services.linkedin.pictureUrl
                    ?
                    <div>
                    <img className="image-5 img-circle" src={user.services.linkedin.pictureUrl}/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? getUserName(user.profile) + " " + "( Invited You )" 
                        : getUserName(user.profile)
                    }
                    </span>
                    </div>
                    :    
                    <div>
                    <img className="image-5" src="/img/avatar.png"/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? getUserName(user.profile) + " " + "( Invited You )" 
                        : getUserName(user.profile)
                    }
                    </span>
                    </div>
                    } 
                </Link>
                <span>
                  <input type="button" defaultValue="Delete" className="delete bttnmembr bttnsaved w-button" onClick ={this.deletePersonalInvitation.bind(this,user)}/>
                </span>
                </div>
              </div>
            </div>
        );
      });
  }

  showInvite(bool){
    this.setState({
      showInvite: bool,
    });
  }

  render() {
    if(this.props.dataReady){
      if((this.props.count != undefined && this.props.count < 1) && !this.state.showInvite ){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className={"gradient"+this.props.currentUser.profile.gradient+" whiteText alignCenter feed"}>
              <div className="emptymessage"><img className="image-6" src="/img/avatar.png"/>
                <div className="emptytext">Hey, there is nobody here
                  <br/>Invite your teammates to learn how they see you</div>
                  <a className="invitebttn w-button step-invitebttn" onClick={this.showInvite.bind(this)}>invite</a>
              </div>
            </section>
          </div>
        );
      }
      else if(this.state.showInvite){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <Invite showInvite={this.showInvite.bind(this, false)}/>
          </div>
        );
      }else{
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className={"gradient"+this.props.currentUser.profile.gradient +" whiteText feed"}>
                <div className="contentwrapper w-clearfix">
                <div className="screentitlewrapper w-clearfix">
                    <div className="screentitle">
                    <div className="title">Add Contact</div>
                    </div>
                    <div className="screentitlebttn">
                    <a className="w-inline-block marginTop5" onClick={this.showInvite.bind(this, true)}><img src="/img/Invite_Plus_white.png"/>
                    </a>
                    </div>
                </div>
                
                <ul className="friendlist w-list-unstyled">

                    <li className="list-item w-clearfix">
                    
                    {this.renderFriendList()}
                    {this.renderGroupFriendList()}
                </li>
                <li></li>
                </ul>
            
                </div>  

            </section>
          </div>
        );
      }
    }else{
      return(
        <div className="fillHeight">
          <Menu location={this.props.location} history={this.props.history}/>
          <Loading/>
        </div>
      );
    }
    
  }
}

export default withTracker((props) => {
    var dataReady;
    var count;
    var users;
    var usersGroup;
    var connections;
    var handle = Meteor.subscribe('connections', 
    { $or : [ 
      {inviteId:Meteor.userId()}, 
      {userId:Meteor.userId()}
      ] 
    },
    {},
    {
      onError: function (error) {
            console.log(error);
        }
    });

    var handleUsers = Meteor.subscribe('users',{} , {}, {
      onError: function (error) {
              console.log(error);
          }
    });

    
    if(Meteor.user() && handle.ready() && handleUsers.ready()){
        // count = Connections.find( { $or : [ 
        //   {inviteId:Meteor.userId()} ,
        //   {userId:Meteor.userId()}  
        // ]}                                                       
        //   ).count();
        connections = Connections.find( 
              { $or : [ {inviteId:Meteor.userId()},
              {userId:Meteor.userId()}
            ]} ,
          ).fetch()

        count = (connections && connections.length) || 0;

        console.log(connections);
        
        var connectionPersonal = connections.filter((conn)=>{
          return !conn.groupId;
        }) 

        var connectionGroup = connections.filter((conn)=>{
          return conn.groupId;
        })

        usersGroup = Meteor.users.find(
          {_id:
            {$in:connectionGroup.map((conn)=>{
                if(conn.userId == Meteor.userId()){
                  return conn.inviteId
                }else{
                  return conn.userId
                }
                
              })
            }
          }).fetch();
          
        users = Meteor.users.find(
          {_id:
            {$in:connectionPersonal.map((conn)=>{
              if(conn.userId == Meteor.userId()){
                return conn.inviteId
              }else{
                return conn.userId
              }
              })
            }
          }).fetch();

      console.log(users);
      dataReady = true;
    }
    return {
        count: count,
        users : users,
        usersGroup : usersGroup,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InvitePage);
  
