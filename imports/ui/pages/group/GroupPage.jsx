import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';

import UserTile from './UserTile';

import '/imports/startup/client/group-members-profile-view.webflow';

class GroupPage extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
      }
  }

  renderUserTiles(){
    return this.props.group.emails.map((email) => {
        return (
          <UserTile key={email} email={email}/>
        );
      });
  }

  render() {
    if(this.props.dataReady){
      return(
        <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <section className="groupbg whiteText alignCenter feed">
                <div className="contentwrapper">
                    <div className="text-left">
                        <a onClick={()=>{
                            this.props.history.goBack();
                        }}>
                        <img src="/img/arrow_white.png"/>
                        </a>
                        &nbsp;
                        {this.props.group.groupName}
                    </div>
                    <br/>
                </div>
                <br/>
                <div className="tile-section">
                    <div className="title-table w-row">
                        {this.renderUserTiles()}
                        <div className="column-4 w-col w-col-4 w-col-stack"></div>
                        <div className="column-5 w-col w-col-4 w-col-stack"></div>
                    </div>
                </div>
            </section>
        </div>
      )
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
  var group;
  var handle = Meteor.subscribe('group', {
    onError: function (error) {
          console.log(error);
      }
  });
  if(Meteor.user() && handle.ready()){
    if(props.match.params.id){
        group = Group.findOne({_id : props.match.params.id});
      }
    dataReady = true;
  }
  return {
      group:group,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(GroupPage);
