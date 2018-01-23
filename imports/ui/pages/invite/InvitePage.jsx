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

  renderFriendList(){
    return this.props.users.map((user) => {
        return (
            <Link  key={user._id} to={`/quiz/${user.userId}`}>
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="avatawrapper padding10">
                    {user.services && user.services.linkedin && user.services.linkedin.pictureUrl
                    ?
                    <div>
                    <img className="image-5 img-circle" src={user.services.linkedin.pictureUrl}/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? user.username + " " + "( Invited You )" 
                        : user.username
                    }
                    </span>
                    </div>
                    :    
                    <div>
                    <img className="image-5" src="/img/avatar.png"/> 
                    <span className="font-white contactName"> 
                    {user.invitedPerson 
                        ? user.username + " " + "( Invited You )" 
                        : user.username
                    }
                    </span>
                    </div>
                    } 
                </div>
                </div>
                </div>
            </Link>
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
    var handle = Meteor.subscribe('connections', 
    { $or : [ {inviteId:Meteor.userId()} ,
      {email : Meteor.user().emails && Meteor.user().emails[0].address},
      {email : Meteor.user().profile && Meteor.user().profile.emailAddress}] 
    },
    {},
    {
      onError: function (error) {
            console.log(error);
        }
    });
    if(Meteor.user() && handle.ready()){
        count = Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
            {email : Meteor.user().emails && Meteor.user().emails[0].address},
            {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
          ).count();
        users = Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
            {email : Meteor.user().emails && Meteor.user().emails[0].address},
            {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] } ,
            {
                    transform: function (doc)
                    {
                        let invitedPerson = doc.email ==(Meteor.user().emails && Meteor.user().emails[0].address);
                        // Linked in login
                        let invitedPerson2 = doc.email == (Meteor.user().profile && Meteor.user().profile.emailAddress);
                        doc.invitedPerson = false;
                        doc.services = Meteor.users.findOne({_id: doc.userId }) && (Meteor.users.findOne({_id: doc.userId }).services);
                        if(invitedPerson || invitedPerson2){
                        doc.invitedPerson = true;
                        doc.profile = Meteor.users.findOne({_id: doc.inviteId }) && Meteor.users.findOne({_id: doc.inviteId }).profile;
                        doc.services = Meteor.users.findOne({_id: doc.inviteId }) && (Meteor.users.findOne({_id: doc.inviteId }).services);
                    }

                    
                        return doc;
                    }
            }).fetch();
      dataReady = true;
    }
    return {
        count: count,

        users : users,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InvitePage);
  
