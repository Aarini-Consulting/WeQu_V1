import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';
import SectionProgress from './SectionProgress';
import RadarComparison from './RadarComparison';
import Strength from './Strength';
import ShareProfile from './ShareProfile';
import SkillSet from './SkillSet';
import SectionProfile from './SectionProfile';

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      activeProfileIndex:-1,
      connectingLinkedIn:false,
    }
  }

  handleScroll(ev) {
    var scroll = ev && ev.target && ev.target.scrollTop;
    var progress = ev.target.children[1];
    if(scroll && progress){
      if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
        if (scroll >= 300) {
          progress.classList.add('fix-searchIOS');
        } else {
          progress.classList.remove("fix-searchIOS");
        }
       }else{
          if (scroll >= 300) {
            progress.classList.add('fix-search');
          } else {
            progress.classList.remove("fix-search");
          }
       }
    }
  }

  cycleUserProfileForward(bool){
    var currentIndex = this.state.activeProfileIndex;
    if(bool){
      currentIndex += 1;
    }else{
      currentIndex -= 1;
    }
    if(currentIndex > -1 && currentIndex < this.props.users.length){
      this.setState({
        activeProfileIndex: currentIndex
      });
    }
  }

  getActiveProfile(){
    if(this.props.users && this.state.activeProfileIndex > -1 && this.state.activeProfileIndex < this.props.users.length){
      return this.props.users[this.state.activeProfileIndex];
    }else{
      return Meteor.userId();
    }
  }

  getProfileInfo(){
    if(this.props.userProfiles){
      return this.props.userProfiles.find((profile, index)=>{
        return profile._id == this.getActiveProfile();
      })
    }else{
      return false;
    } 
    
  }

  getLinkedInInfo(){
    if(this.props.currentUser && this.props.currentUser._id == Meteor.userId()){
      var pathname = "linkedin-handler"
      this.props.history.push(`/linkedin-permission/${pathname}`);
    }
  }

  componentWillUnmount() {
      const feed = ReactDOM.findDOMNode(this.refs.feed);
      feed.removeEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataReady){
      if(this.state.activeProfileIndex == -1){
        if(nextProps.initialUser){
          this.setState({
            activeProfileIndex: nextProps.users.indexOf(nextProps.initialUser._id)
          });
        }else{
          this.setState({
            activeProfileIndex: 0
          });
        }
      }
    }
  }

  componentDidMount(prevProps, prevState){
    const feed = ReactDOM.findDOMNode(this.refs.feed);
    if(feed){
      feed.addEventListener('scroll', this.handleScroll);
    }

    if(this.state.activeProfileIndex < 0 && !this.props.initialUser){
      this.setState({
        activeProfileIndex: 0
      });
    }
  }

  componentDidUpdate(prevProps, prevState){
    const feed = ReactDOM.findDOMNode(this.refs.feed);
    if(feed){
      feed.addEventListener('scroll', this.handleScroll);
    }
  }

  render() {
    
    if(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.loginScript && this.props.dataReady){
      var profileInfo = this.getProfileInfo();
      return (
      <section className="feed" id="feed" ref="feed">

        <div className="sectionname">
          <div className="profilename w-container">
            <div className="left profileclick" id="prevPerson">
              {this.state.activeProfileIndex - 1 > -1 &&
                <img className="profilearrow" height="80" src="/img/arrowLeft.png" onClick={this.cycleUserProfileForward.bind(this, false)}/>
              }
            </div>
            <div className="profilefac">
              {profileInfo.profile && profileInfo.profile.pictureUrl 
                ? <img src={profileInfo.profile.pictureUrl} className="avatarprofile" onClick={this.getLinkedInInfo.bind(this)}/>
                : <img src="/img/avatar.png" className="avatarprofile" onClick={this.getLinkedInInfo.bind(this)}/>
              }
              <div className="fontprofilename fontreleway">
              {profileInfo && 
              getUserName(profileInfo.profile)
              } 
              </div>
            </div>
            <div className="profileclick right" id="nextPerson">
              {this.state.activeProfileIndex + 1 < this.props.users.length &&
                <img className="profilearrow" height="80" src="/img/arrowRight.png" onClick={this.cycleUserProfileForward.bind(this, true)}/>
              }
            </div>
          </div>
        </div>

        <SectionProgress quizPerson={this.getActiveProfile()} ref="sectionProgress"/>

        <div className="progressdesdiv">
          <div className="fontprogressdes fontreleway small">Below&nbsp;information is being generated based on the inputs from you and your teammates</div>
        </div>
          
        <RadarComparison quizPerson={this.getActiveProfile()}/>

        <Strength quizPerson={this.getActiveProfile()}/>

        {/* <ShareProfile/> */}

        <SkillSet quizPerson={this.getActiveProfile()}/>

        <SectionProfile/>
      </section>
      );
    }
    else{
        return(
          <Loading/>
        );
    }
  }
}

export default withTracker((props) => {
  var users =[Meteor.userId()];
  var userProfiles;
  var dataReady;
  var handle = Meteor.subscribe('connections', 
  { $or : [ 
    {inviteId:Meteor.userId()},
    {userId:Meteor.userId()}
    ]},
  {},
  {
    onError: function (error) {
          console.log(error);
      }
  });

  if(Meteor.user() && handle.ready()){
    //get unique userId from connections collection
    users = [...new Set(
      users.concat(
        Connections.find( 
          { $or : [ 
            {inviteId:Meteor.userId()},
            {userId:Meteor.userId()}
          ] } ,
          ).fetch()
        .map((conn)=>{
          if(conn.userId == Meteor.userId()){
            return conn.inviteId;
          }else{
            return conn.userId;
          }
        })
      )
    )];
    
    var handleUsers = Meteor.subscribe('users',{_id : {$in : users}},{ createdAt : 1}, {
      onError: function (error) {
              console.log(error);
          }
    });

    if(handleUsers.ready()){
      userProfiles = Meteor.users.find( {_id : {$in : users}},{ createdAt : 1}).fetch();
      dataReady = true;
    }
    
  }
  
  return {
      currentUser: Meteor.user(),
      users: users,
      userProfiles : userProfiles,
      dataReady:dataReady
  };
})(Profile);

