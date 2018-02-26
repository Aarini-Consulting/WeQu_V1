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
          <Link  key={group._id} to={`/group/${group._id}`}>
            <ul className="unordered-list listcontact w-clearfix w-list-unstyled">
            <li className="contactlist">
              <div className="contactc w-row cursor-pointer">
                <div className="column-4">
                  <div className="contactnamefield w-clearfix">
                    <img src="/img/avatar.png" className="contactface"/>
                  </div>
                  <div className="fontcontactname">{group.groupName}</div>
                </div>
              </div>
            </li>
          </ul>
          </Link>
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
                  <a className="invitebttn w-button step-invitebttn" onClick={this.showInviteGroup.bind(this,true)}>Create a group</a>
              </div>
            </section>
          </div>
        );
      }
      else if(this.state.showInviteGroup){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <InviteGroup closeInviteGroup={this.showInviteGroup.bind(this, false)}/>
          </div>
        );
      }else{
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className="section summary">
                <div className="contactlist-wrapper">
                  {this.renderGroupList()}
                </div>

                <div className="footersummary w-clearfix">
                  <div className="bttn-area-summary contact" >
                    <a className="button fontreleway bttncontact w-button" onClick={this.showInviteGroup.bind(this, true)}>
                    Add new group
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
    var groups;
    var handleGroup = Meteor.subscribe('group', {creatorId: Meteor.userId()}, {}, {
      onError: function (error) {
            console.log(error);
        }
    });
    if(handleGroup.ready()){
      groups = Group.find({creatorId: Meteor.userId()}).fetch();
      dataReady = true;
    }
    return {
        groups : groups,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InviteGroupPage);
  
