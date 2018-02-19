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

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.dataReady){
      return true;
    }else{
      return false;
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

  renderGroupList(){
    return this.props.groups.map((group, index)=>{
      return (
        <li key={group._id} className="contactlist" >
            <div>{group.groupName}</div>                
            {this.renderGroupFriendList(group._id)}
        </li>
      )
    })
  }

  renderGroupFriendList(groupId){
    return this.props.usersGroup.map((user, index) => {
        return (
          <div key={groupId +" "+ user._id} className="contactc w-row">
            <div className="column-4 w-col w-col-5 w-col-small-5 w-col-tiny-5">
              <div className="contactnamefield w-clearfix cursor-pointer" 
              onClick={()=>{
                this.props.history.push(`/profile/${user._id}`);
              }}>
                <img src="/img/avatar.png" className="contactface"/>
                <div className="fontcontactname">{getUserName(user.profile)}</div>
              </div>
            </div>
            <div className="column-5 w-clearfix w-col w-col-7 w-col-small-7 w-col-tiny-7">
              <div className="c-data">
                <div className="coontactcount2 w-clearfix">
                  <div className="contactq-div contactqmobile w-clearfix">
                    <div className="fontreleway fontcontactq _1">
                      {
                        Feedback.find({
                          from:Meteor.userId(),
                          to:user._id,
                          done:true,
                          groupId:{$exists: true}
                          }).count() * 12
                      }
                      </div>
                    <div className="fontreleway fontcontactq _1-top">Answers I&#x27;ve given</div>
                  </div>
                  <div className="contactq-div w-clearfix">
                    <div className="fontreleway fontcontactq _2">
                    {
                      Feedback.find({
                        from:user._id,
                        to:Meteor.userId(),
                        done:true,
                        groupId:{$exists: true}
                        }).count() * 12
                    }
                    </div>
                    <div className="fontreleway fontcontactq _1-top">Answers I&#x27;ve received</div>
                  </div>
                  <Link to={`/quiz/${user._id}/${groupId}`}className="contactq-div w-clearfix cursor-pointer">
                    <div className="fontreleway fontcontactq _1-top">Go to</div>
                    <div className="fontreleway fontcontactq _3">QUIZ</div>
                  </Link>
                  <Link to={`/profile/${user._id}/${groupId}`} className="contactq-div w-clearfix cursor-pointer">
                    <div className="fontreleway fontcontactq _1-top">Go to</div>
                    <div className="fontreleway fontcontactq _3">PROFILE</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

            // <div key={groupId +" "+ user._id}>
            //   <div className="row">
            //     <div className="col-md-12 col-sm-12 col-xs-12">
            //     <Link className="avatawrapper padding10"  to={`/quiz/${user._id}`}>
            //         {user.services && user.services.linkedin && user.services.linkedin.pictureUrl
            //         ?
            //         <div>
            //         <img className="image-5 img-circle" src={user.services.linkedin.pictureUrl}/> 
            //         <span className="font-white contactName"> 
            //         {user.invitedPerson 
            //             ? getUserName(user.profile) + " " + "( Invited You )" 
            //             : getUserName(user.profile)
            //         }
            //         </span>
            //         </div>
            //         :    
            //         <div>
            //         <img className="image-5" src="/img/avatar.png"/> 
            //         <span className="font-white contactName"> 
            //         {user.invitedPerson 
            //             ? getUserName(user.profile) + " " + "( Invited You )" 
            //             : getUserName(user.profile)
            //         }
            //         </span>
            //         </div>
            //         } 
            //     </Link>
            //     </div>
            //   </div>
            // </div>
        );
      });
  }

  renderFriendList(){
    return this.props.users.map((user, index) => {
        return (
                <li className="contactlist"  key={user._id}>
                  <div className="contactc w-row">
                    <div className="column-4 w-col w-col-5 w-col-small-5 w-col-tiny-5">
                      <div className="contactnamefield w-clearfix cursor-pointer" 
                      onClick={()=>{
                        this.props.history.push(`/profile/${user._id}`);
                      }}>
                        <img src="/img/avatar.png" className="contactface"/>
                        <div className="fontcontactname">{getUserName(user.profile)}</div>
                      </div>
                    </div>
                    <div className="column-5 w-clearfix w-col w-col-7 w-col-small-7 w-col-tiny-7">
                      <div className="c-data">
                        <div className="coontactcount2 w-clearfix">
                          <div className="contactq-div contactqmobile w-clearfix">
                            <div className="fontreleway fontcontactq _1">
                              {
                                Feedback.find({
                                  from:Meteor.userId(),
                                  to:user._id,
                                  done:true,
                                  groupId:{$exists: false}
                                  }).count() * 12
                              }
                              </div>
                            <div className="fontreleway fontcontactq _1-top">Answers I&#x27;ve given</div>
                          </div>
                          <div className="contactq-div w-clearfix">
                            <div className="fontreleway fontcontactq _2">
                            {
                              Feedback.find({
                                from:user._id,
                                to:Meteor.userId(),
                                done:true,
                                groupId:{$exists: false}
                                }).count() * 12
                            }
                            </div>
                            <div className="fontreleway fontcontactq _1-top">Answers I&#x27;ve received</div>
                          </div>
                          <Link to={`/quiz/${user._id}`}className="contactq-div w-clearfix cursor-pointer">
                            <div className="fontreleway fontcontactq _1-top">Go to</div>
                            <div className="fontreleway fontcontactq _3">QUIZ</div>
                          </Link>
                          <Link to={`/profile/${user._id}`} className="contactq-div w-clearfix cursor-pointer">
                            <div className="fontreleway fontcontactq _1-top">Go to</div>
                            <div className="fontreleway fontcontactq _3">PROFILE</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
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
            <section>
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
            <section>
                {/* <div className="contentwrapper w-clearfix">
                <div className="screentitlewrapper w-clearfix">
                    <div className="screentitle">
                    <div className="title">Add Contact</div>
                    </div>
                    <div className="screentitlebttn">
                    <a className="w-inline-block marginTop5" onClick={this.showInvite.bind(this, true)}><img src="/img/Invite_Plus_white.png"/>
                    </a>
                    </div>
                </div> */}
                
                <ul className="unordered-list listcontact w-clearfix w-list-unstyled">

                    {this.renderFriendList()}

                    {this.renderGroupList()}
                </ul>

                <div className="footersummary w-clearfix">
                  <div className="bttn-area-summary contact" >
                    <a className="button fontreleway bttncontact w-button" onClick={this.showInvite.bind(this, true)}>
                    Add new contact
                    </a>
                  </div>
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
    var groups;
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

    var handleFeedback = Meteor.subscribe('feedback',{
      $or: [
        { from: Meteor.userId() },
        { to: Meteor.userId() }
      ],
    },
    {}, {
      onError: function (error) {
            console.log(error);
        }
    });
    
    if(Meteor.user() && handle.ready() && handleFeedback.ready()){
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
        
        if(count > 0){
          var contactIds = [];
          var connectionPersonalIds = [];
          var connectionGroupIds = [];
          var groupIds = [];

          connections.forEach((conn, index) => {
            var id;
            if(conn.userId == Meteor.userId()){
              id = conn.inviteId;
            }else{
              id = conn.userId;
            }
            contactIds.push(id);
            if(conn.groupId){
              groupIds.push(conn.groupId);
              connectionGroupIds.push(id);
            }else{
              connectionPersonalIds.push(id);
            }
          });

          var handleUsers = Meteor.subscribe('users',
            {_id:
              {$in:contactIds}
            }, 
            {}, {
            onError: function (error) {
                    console.log(error);
                }
          });
      
          var handleGroups = Meteor.subscribe('group',
          {_id:
            {$in:groupIds}
          } , 
          {}, {
            onError: function (error) {
                    console.log(error);
                }
          });

          if(handleUsers.ready() && handleGroups.ready()){
            usersGroup = Meteor.users.find(
              {_id:
                {$in:connectionGroupIds
                }
              }).fetch();
              
            users = Meteor.users.find(
              {_id:
                {$in:connectionPersonalIds
                }
              }).fetch();
            
            groups = Group.find({_id:
              {$in:groupIds}
            }).fetch();

            dataReady = true;
          }
        }else{
          dataReady = true;
        }  
    }
    return {
        count: count,
        users : users,
        groups : groups,
        usersGroup : usersGroup,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InvitePage);
  
