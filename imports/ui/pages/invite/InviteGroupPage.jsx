import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import InviteGroup from './InviteGroup';

class InviteGroupPage extends React.Component {
  constructor(props){
      super(props);
      this.state={
        showInviteGroup:false,
      }
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.count && nextProps.count < 1)){
      this.setState({
        showInviteGroup: true,
      });
    }
  }

  renderGroupList(){
    return this.props.groups.map((group) => {
        return (
          <ul key={group._id} className="friendlist w-list-unstyled">
            <li className="list-item w-clearfix">
            <div  className="avatawrapper">
              <a className="w-inline-block"><img className="image-5" src="/img/avatar_group_2.png"/>
              </a>
              <span id="viewGroup" className="contactName">{group.groupName}</span>
            </div>
            </li>
            <li></li>
          </ul>
            // <Link  key={group._id} to={`/quiz/${user.userId}`}>
            
            // </Link>
        );
      });
  }

  showInviteGroup(bool){
    this.setState({
      showInviteGroup: bool,
    });
  }

  render() {
    if(this.props.dataReady){
      if((this.props.groups && this.props.groups.length < 1) && !this.state.showInviteGroup ){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className={"gradient"+this.props.currentUser.profile.gradient+" whiteText alignCenter feed"}>
              <div className="emptymessage"><img className="image-6" src="/img/avatar.png"/>
                <div className="emptytext">Hey, there is nobody here
                </div>
                  <a className="invitebttn w-button step-invitebttn" onClick={this.showInviteGroup.bind(this)}>Create a group</a>
              </div>
            </section>
          </div>
        );
      }
      else if(this.state.showInviteGroup){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <InviteGroup showInviteGroup={this.showInviteGroup.bind(this, false)}/>
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
                    <div className="title">Add Group</div>
                    </div>
                    <div className="screentitlebttn">
                    <a className="w-inline-block marginTop5" onClick={this.showInviteGroup.bind(this, true)}><img src="/img/Invite_Plus_white.png"/>
                    </a>
                    </div>
                </div>

                {this.renderGroupList()}
            
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
    var groups;
    var handle = Meteor.subscribe('group', {
      onError: function (error) {
            console.log(error);
        }
    });
    if(Meteor.user() && handle.ready()){
      groups = Group.find({creatorId: Meteor.userId()});
      dataReady = true;
    }
    return {
        groups : groups,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InviteGroupPage);
  
