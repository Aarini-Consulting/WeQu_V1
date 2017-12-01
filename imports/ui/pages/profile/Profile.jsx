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

import '/imports/startup/client/wequ-profile.webflow.css';

class Profile extends React.Component {
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
  componentWillUnmount() {
      const feed = ReactDOM.findDOMNode(this.refs.feed);
      feed.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount(prevProps, prevState){
    const feed = ReactDOM.findDOMNode(this.refs.feed);
    if(feed){
      feed.addEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate(prevProps, prevState){
    const feed = ReactDOM.findDOMNode(this.refs.feed);
    if(feed){
      feed.addEventListener('scroll', this.handleScroll);
    }
  }

  render() {
    
    if(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.loginScript){
      return (
      <section className="feed" id="feed" ref="feed">

        <div className="sectionname">
          <div className="profilename w-container">
            {/* <div className="left profileclick" id="prevPerson" style="visibility:{{#if prevPerson}}visible{{else}}hidden{{/if}}">
              <img className="profilearrow" height="80" src="/img/arrowLeft.png"/>
            </div> */}
            <div className="profilefac">
              {/* <img className="avatarprofile" src="{{pictureUrl}}"/> */}
              <img src="/img/avatar.png" className="avatarprofile" id="specificUser" data-filter-id={Meteor.userId()}/>
              <div className="fontprofilename fontreleway">
              {this.props.currentUser.profile.firstName + " " + this.props.currentUser.profile.lastName} 
              </div>
            </div>
            {/* <div className="profileclick right" id="nextPerson" style="visibility:{{#if nextPerson}}visible{{else}}hidden{{/if}}">
              <img className="profilearrow" height="80" src="/img/arrowRight.png"/>
            </div> */}
          </div>
        </div>

        <SectionProgress quizPerson={Meteor.userId()} ref="sectionProgress"/>

        <div className="progressdesdiv">
          <div className="fontprogressdes fontreleway small">Below&nbsp;information is being generated based on the inputs from you and your teammates</div>
        </div>
          
        <RadarComparison quizPerson={Meteor.userId()}/>

        <Strength quizPerson={Meteor.userId()}/>

        <ShareProfile/>

        <SkillSet quizPerson={Meteor.userId()}/>

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
  return {
      currentUser: Meteor.user(),
  };
})(Profile);

