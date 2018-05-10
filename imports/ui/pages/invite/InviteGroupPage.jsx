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
                  <div className="fontcontactname white">{group.groupName}</div>
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
            <section className="fontreleway groupbg">
              <div className="emptymessage"><img className="image-6" src="/img/avatar.png"/>
                <div className="emptytext group">Hey, there is nobody here
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
            <section className="section summary fontreleway groupbg">
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  {(this.props.groups && this.props.groups.length > 0) &&
                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={this.showInviteGroup.bind(this, false)}>
                    <img className="image-7" src="/img/arrow.svg"/>
                    </a>
                  }
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                  Create a new group
                </div>
              </div>
              <InviteGroup closeInviteGroup={this.showInviteGroup.bind(this, false)}/>
            </section>
          </div>
        );
      }else{
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className="section summary fontreleway groupbg">
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
      groups = Group.find({creatorId: Meteor.userId()},{ sort: { groupName: -1 }}).fetch();
      dataReady = true;
    }
    return {
        groups : groups,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InviteGroupPage);
  
