import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import InviteGroup from '/imports/ui/pages/invite/InviteGroup';

import UserTile from './UserTile';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

class GroupPage extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
        showInviteGroup:false,
        showConfirm:false,
        sending:false,
        selectedCycle:[]
      }
  }

  closeCycleConfirm(){
    this.setState({
      showConfirm: true,
    });
  }

  closeCycle(){
    this.setState({
      sending: true,
    });

    Meteor.call( 'closeCycle', this.props.group._id, ( error, response ) => {
      this.setState({
        sending: false,
      });
      if ( error ) {
        console.log(error);
      }
    });
  }

  showInviteGroup(bool){
    this.setState({
      showInviteGroup: bool,
    });
  }

  toggleCycle(id, index){
    var copyStateData = this.state.selectedCycle.slice();
    if(index > -1){
      copyStateData.splice(index,1);
    }else{
      copyStateData.push(id);
    }

    this.setState({
      selectedCycle: copyStateData,
    });
  }

  renderUserTiles(){
    return this.props.group.emails.map((email) => {
        return (
          <UserTile key={email} email={email}/>
        );
      });
  }

  renderFeedbackCycles(){
    return this.props.feedbackCycle.map((data, index) => {
      var index = this.state.selectedCycle.indexOf(data._id);
      return(
        <div className={"invitebttn bttnmembr gender w-button " + (index > -1 ? "selected" : "")} 
        key={data._id} onClick={this.toggleCycle.bind(this, data._id, index)}>
          {data.createdAt.getDay()}/{data.createdAt.getDate()}/{data.createdAt.getFullYear()}
        </div>
      );
    });
  }

  

  render() {
    if(this.props.dataReady){
      if(this.state.showInviteGroup){
        return (
          <div className="fillHeight">
            <Menu location={this.props.location} history={this.props.history}/>
            <InviteGroup closeInviteGroup={this.showInviteGroup.bind(this, false)} isEdit={true} group={this.props.group} />
          </div>
        );
      }else{
        return(
          <div className="fillHeight">
              <Menu location={this.props.location} history={this.props.history}/>
              <section className="section summary fontreleway groupbg">
                <div className="screentitlewrapper w-clearfix">
                  <div className="screentitlebttn back">
                    <a className="w-clearfix w-inline-block cursor-pointer" onClick={()=>{
                      this.props.history.goBack();
                    }}>
                    <img className="image-7" src="/img/arrow.svg"/>
                    </a>
                  </div>
                  <div className="fontreleway font-invite-title w-clearfix">
                  {this.props.group.groupName}
                  </div>
                  <div className="close-group-cycle w-clearfix cursor-pointer">
                    <div className="fontreleway font-invite-title close-cycle w-clearfix" onClick={this.closeCycleConfirm.bind(this)}>
                    <u>Close Cycle</u>
                    </div>
                  </div>
                </div>

                {this.props.feedbackCycle &&
                  <div className="screentitlewrapper w-clearfix">
                    {this.renderFeedbackCycles()}
                  </div>
                }
                
                
                <div className="tile-section">
                    <div className="title-table w-row">
                        {this.renderUserTiles()}
                        <div className="column-4 w-col w-col-4 w-col-stack"></div>
                        <div className="column-5 w-col w-col-4 w-col-stack"></div>
                    </div>
                </div>

                <div className="footersummary w-clearfix">
                  <div className="bttn-area-summary contact" >
                    <a className="button fontreleway bttncontact w-button" onClick={this.showInviteGroup.bind(this, true)}>
                    Edit group
                    </a>
                  </div>
                </div>
                {this.state.showConfirm &&
                  <SweetAlert
                  type={"confirm-close-cycle"}
                  onCancel={() => {
                      this.setState({ showConfirm: false });
                  }}
                  onConfirm={() => {
                    this.setState({ showConfirm: false });
                    this.closeCycle();
                  }}/>
                }
              </section>
          </div>
        )
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
  var group;
  var feedbackCycle;
  var handleGroup;
    if(props.match.params.id){
        handleGroup = Meteor.subscribe('group',{_id : props.match.params.id},{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        handleFeedbackCycle = Meteor.subscribe('feedback_cycle',{
          groupId : props.match.params.id,
          creatorId : Meteor.userId()
        },{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        if(handleGroup.ready() && handleFeedbackCycle.ready()){
          group = Group.findOne({_id : props.match.params.id});

          feedbackCycle = FeedbackCycle.find({
            groupId : props.match.params.id,
            creatorId : Meteor.userId()
          }).fetch();

          console.log(feedbackCycle);
          dataReady = true;
        }
    }
  return {
      group:group,
      feedbackCycle:feedbackCycle,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(GroupPage);
