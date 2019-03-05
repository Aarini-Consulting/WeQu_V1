import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import MenuPresentation from '/imports/ui/pages/menu/MenuPresentation';
import InviteGroup from './InviteGroup';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

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
                    <img src="/img/Logo-Main_ring_animation.small.gif" className="contactface"/>
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
            <MenuPresentation location={this.props.location} history={this.props.history} groupName={"Groups"}/>
            <section className="fontreleway groupbg fillHeight">
              <div className="emptymessage fillHeight"><img className="image-6" src="/img/avatar.png"/>
                <div className="emptytext group">
                  <T>weq.inviteGroupPage.NoGroup</T>
                </div>
                <a className="invitebttn w-button step-invitebttn" onClick={this.showInviteGroup.bind(this,true)}><T>weq.inviteGroupPage.CreateNew</T></a>
              </div>
            </section>
          </div>
        );
      }
      else if(this.state.showInviteGroup){
        return (
          <div className="fillHeight">
            <MenuPresentation location={this.props.location} history={this.props.history} groupName={i18n.getTranslation("weq.inviteGroupPage.CreateNew")} backArrowClick={this.showInviteGroup.bind(this, false)}/>
            <section className="section summary fontreleway groupbg">
              <InviteGroup closeInviteGroup={this.showInviteGroup.bind(this, false)}/>
            </section>
          </div>
        );
      }else{
        return (
          <div className="fillHeight">
            <MenuPresentation location={this.props.location} history={this.props.history} groupName={"Groups"}/>
            <section className="section fontreleway groupbg">
                <div className="contactlist-wrapper group-list">
                  {this.renderGroupList()}
                </div>

                <div className="footersummary w-clearfix">
                  <div className="bttn-area-summary contact" >
                    <a className="button fontreleway bttncontact w-button" onClick={this.showInviteGroup.bind(this, true)}>
                      <T>weq.inviteGroupPage.CreateNew</T>
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
      groups = Group.find({creatorId: Meteor.userId()},{ sort: { createdAt: -1 }}).fetch();
      dataReady = true;
    }
    return {
        groups : groups,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(InviteGroupPage);
  
