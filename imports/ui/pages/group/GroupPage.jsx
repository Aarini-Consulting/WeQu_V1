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
        showReopenConfirm:false,
        showInfo:false,
        sending:false,
        selectedCycleIndex:-1,
        selectedCycle:undefined,
        currentTab:"edit"
      }
  }

  startCycleClick(){
    if(this.props.currentFeedbackCycle){
      this.startCycle();
    }
  }

  collectDataClick(){
    if(this.props.currentFeedbackCycle){
      this.setState({
        showInfo: true,
        showInfoMessage:"Currently feedback date is being collected. Each user should give at least 12 answers for oneself and for each others"
      });
    }
  }

  closeCycleConfirm(){
    if(this.props.currentFeedbackCycle){
      this.setState({
        showConfirm: true,
      });
    }else if(this.props.feedbackCycle,length > 0){
      var date = this.props.feedbackCycle[0].to;
      var dateText = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      
      this.setState({
        showInfo: true,
        showInfoMessage:`You've requested a report already on ${dateText}. If you haven't received your report contact master.coach@weq.io`
      });
    }
  }

  reopenCycleConfirm(){
    if(!this.props.currentFeedbackCycle && this.props.feedbackCycle.length > 0 ){
      if((new Date().getTime() - this.props.feedbackCycle[0].createdAt.getTime()) < (1 * 24 * 60 * 60 * 1000)){
        this.setState({
          showReopenConfirm: true,
        });
      }else{
        this.setState({
          showInfo: true,
          showInfoMessage:"You are not allowed to cancel the report generation after 24 hours have passed. You will receive your report within 24 hours. Thank you"
        });
      }
    }
  }

  startCycle(){
    this.setState({
      sending: true,
    });

    Meteor.call( 'start.new.cycle', this.props.group._id, ( error, response ) => {
      this.setState({
        sending: false,
      });
      if ( error ) {
        console.log(error);
        this.setState({
          showInfo: true,
          showInfoMessage:error.error
        });
      }
    });
  }

  closeCycle(){
    this.setState({
      sending: true,
    });

    Meteor.call( 'close.cycle', this.props.group._id, ( error, response ) => {
      this.setState({
        sending: false,
      });
      if ( error ) {
        console.log(error);
        this.setState({
          showInfo: true,
          showInfoMessage:error.error
        });
      }
    });
  }

  reopenCycle(){
    this.setState({
      sending: true,
    });

    Meteor.call( 'reopen.cycle', this.props.group._id, ( error, response ) => {
      this.setState({
        sending: false,
      });
      if ( error ) {
        console.log(error);
        this.setState({
          showInfo: true,
          showInfoMessage:error.error
        });
      }
    });
  }

  showInviteGroup(bool){
    this.setState({
      showInviteGroup: bool,
    });
  }

  toggleCycle(event){
    var index = event.target.value;
    if(index < 0){
      this.setState({
        selectedCycleIndex:-1,
        selectedCycle: undefined,
      });
    }else{
      this.setState({
        selectedCycleIndex:index,
        selectedCycle: this.props.feedbackCycle[index],
      });
    }
  }

  toggleTabs(tabName){
    if(this.state.currentTab != tabName){
      this.setState({
        currentTab:tabName,
      });
    }
  }

  renderUserTiles(){
    return this.props.group.emails.map((email) => {
        return (
          <UserTile key={email} email={email} feedbackCycle={this.state.selectedCycle} group={this.props.group}/>
        );
      });
  }

  renderFeedbackCycles(){
    return this.props.feedbackCycle.map((data, index) => {
      return(
        <option value={index} key={data._id}>
          {data.to.getDate()}/{data.to.getMonth()+1}/{data.to.getFullYear()}
        </option>
      );
    });
  }

  renderSurveyGraph(skills){
    return skills.map((skill, index) => {
        return (
            <div className="skillElement" key={skill.name}>
              <div className="title">{skill.name}</div>

              <div className="underBar" style={{width:60+"%"}}>
                  <div className="bar bg VIRTUE" style={{width:skill.value + "%"}}></div>
              </div>

              <div className="score w-inline-block" style={{width:6+"em"}}>
                  {skill.total <= 0 
                  ?"0/0"
                  :skill.scored +"/"+ skill.total
                  }
              </div>
            </div>
        );
    });
  }

  

  render() {
    if(this.props.dataReady){
      var tabContent;

      if(this.state.currentTab == "edit"){
        tabContent = <InviteGroup closeInviteGroup={this.showInviteGroup.bind(this, false)} isEdit={true} group={this.props.group} />
      }
      else if(this.state.currentTab == "survey"){
        tabContent = 
        <div className="contentwrapper invite">
          <div className="title-table w-row">
          {this.renderSurveyGraph([{name:"test",scored:1,total:1,value:100},{name:"test2",scored:2,total:4,value:50}])}
          </div>;
        </div>
      }
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
                <div className="fontreleway font-invite-title white w-clearfix">
                {this.props.group.groupName}
                </div>
                {/* <div className="fontreleway font-invite-title edit w-clearfix">
                  <span className="cursor-pointer" onClick={this.showInviteGroup.bind(this, true)}>Edit Group</span>
                </div> */}
              </div>
              <div className="tabs w-tabs">
                <div className={"tabs-menu w-tab-menu tap-underline "+ this.state.currentTab}>
                  <a className={"tap edit w-inline-block w-tab-link " + (this.state.currentTab == "edit" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"edit")}>
                    <div>Edit group</div>
                  </a>
                  <a className={"tap survey w-inline-block w-tab-link " + (this.state.currentTab == "survey" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"survey")}>
                    <div>View survey</div>
                  </a>
                  <a className={"tap card w-inline-block w-tab-link " + (this.state.currentTab == "card" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"card")}>
                    <div>Curate cards</div>
                  </a>
                  <a className={"tap report w-inline-block w-tab-link tap-last " + (this.state.currentTab == "report" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"report")}>
                    <div>Get report</div>
                  </a>
                </div>
                <div className="w-tab-content">
                  {tabContent}
                </div>
              </div>

              {/* <div className="screentitlewrapper w-clearfix">
                <div className="phase w-inline-block">
                  <a className={"fontreleway f-phase " + 
                  (this.props.currentFeedbackCycle 
                    ? 
                    "f-old"
                    : 
                    (this.props.feedbackCycle.length > 0 && new Date().getTime() - this.props.feedbackCycle[0].createdAt.getTime()) > (2 * 24 * 60 * 60 * 1000) 
                    ? ""
                    : "f-old"
                  )
                  }>
                    Start new cycle
                    <div className="phase-chevron"></div>
                  </a>
                </div>
                <div className="phase w-inline-block">
                  <a className={"fontreleway f-phase "+ (this.props.currentFeedbackCycle ? "f-active":"f-old")}
                  onClick={this.collectDataClick.bind(this)}>
                    Collect data
                    <div className="phase-chevron"></div>
                  </a>
                </div>
                <div className="phase w-inline-block">
                  <div className={"fontreleway f-phase "+ (!this.props.currentFeedbackCycle ? "f-active":"")} 
                  onClick={this.closeCycleConfirm.bind(this)}>
                    Request report &amp; close cycle
                    <div className="phase-chevron"></div>
                  </div>
                  {!this.props.currentFeedbackCycle && this.props.feedbackCycle.length > 0 &&
                  (new Date().getTime() - this.props.feedbackCycle[0].createdAt.getTime()) < (2 * 24 * 60 * 60 * 1000) &&
                    <div className="close-cycle-cancel" onClick={this.reopenCycleConfirm.bind(this)}>
                      cancel the request (only valid within 24 hours)
                    </div>
                  }
                  
                </div>
                {this.props.feedbackCycle.length > 0 &&
                <div className="phase-select w-clearfix cursor-pointer">
                  <select className="fontreleway w-select" value={this.state.selectedCycleIndex} onChange={this.toggleCycle.bind(this)}>
                  <option value="-1">
                  {this.state.selectedCycleIndex > -1 
                  ?"All Cycle"
                  :"All Cycle"
                  }
                  
                  </option>
                  {this.renderFeedbackCycles()}
                  </select>
                </div>
                }
              </div> */}

              {/* <div className="footersummary w-clearfix">
                <div className="bttn-area-summary contact" >
                  <a className="button fontreleway bttncontact w-button" onClick={this.showInviteGroup.bind(this, true)}>
                  Edit group
                  </a>
                </div>
              </div> */}
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
              {this.state.showReopenConfirm &&
                <SweetAlert
                type={"confirm-reopen-cycle"}
                onCancel={() => {
                    this.setState({ showReopenConfirm: false });
                }}
                onConfirm={() => {
                  this.setState({ showReopenConfirm: false });
                  this.reopenCycle();
                }}/>
              }

              {this.state.showInfo &&
                <SweetAlert
                type={"info"}
                message={this.state.showInfoMessage}
                onCancel={() => {
                    this.setState({ showInfo: false });
                }}/>
              }
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
  var feedbackCycle;
  var currentFeedbackCycle;
  var handleGroup;
    if(props.match.params.id){
        handleGroup = Meteor.subscribe('group',{_id : props.match.params.id},{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        handleFeedbackCycle = Meteor.subscribe('feedback_cycle',{
          groupId : props.match.params.id,
          creatorId : Meteor.userId(),
        },{}, {
          onError: function (error) {
                console.log(error);
            }
        });

        if(handleGroup.ready() && handleFeedbackCycle.ready()){
          group = Group.findOne({_id : props.match.params.id});

          var check = FeedbackCycle.findOne({
            groupId : props.match.params.id,
            creatorId : Meteor.userId(),
          });

          if(!check){
            Meteor.call( 'assign.cycle.old.group', props.match.params.id, ( error, response ) => {
              if ( error ) {
                console.log(error);
              }
            });
          }else{
            feedbackCycle = FeedbackCycle.find({
              groupId : props.match.params.id,
              creatorId : Meteor.userId(),
              to:{$exists: true}
            },
            { sort: { createdAt: -1 } }).fetch();
  
            currentFeedbackCycle = FeedbackCycle.findOne({
              groupId : props.match.params.id,
              creatorId : Meteor.userId(),
              to:{$exists: false}
            },
            { sort: { createdAt: -1 } });

            dataReady = true;
          }
        }
    }
  return {
      group:group,
      feedbackCycle:feedbackCycle,
      currentFeedbackCycle:currentFeedbackCycle,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(GroupPage);
