import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import MenuPresentation from '/imports/ui/pages/menu/MenuPresentation';
import InviteGroup from '/imports/ui/pages/invite/InviteGroup';
import GroupPlayCardPage from './GroupPlayCardPage';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import GroupReportPage from './GroupReportPage';

import i18n from 'meteor/universe:i18n';
import GroupPresentation from './GroupPresentation';
import GroupQuizPage from './GroupQuizPage';
import GroupTypeformSurvey from './GroupTypeformSurvey';

import {Group} from '/collections/group';
import {CardPlacement} from '/collections/cardPlacement';

import {groupTypeIsShort,groupTypeShortList} from '/imports/helper/groupTypeShort.js';
import GroupNormingAds from './GroupNormingAds';

const T = i18n.createComponent();

class GroupPage extends React.Component {
  constructor(props){
      super(props);
      var locale = i18n.getLocale().split("-")[0];
      if (locale == 'es') {
        locale = i18n.getLocale();
      }

      this.state={
        inviteStatus:false,
        selectedGroupLanguage:locale,
        showInviteGroup:false,
        showConfirmStop:false,
        showConfirmStart:false,
        showReopenConfirm:false,
        showInfo:false,
        showMatrixInfoPanel:undefined,
        presentationFrameLoaded:false,
        sending:false,
        currentTab:"edit"
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.group && nextProps.group.groupLanguage){
      language = nextProps.group.groupLanguage;
    }else{
      language = i18n.getLocale().split("-")[0];
      if (language == 'es') {
        language = i18n.getLocale();
      }
     
    }

    if(language != this.state.selectedGroupLanguage){
      var supportedLocale = Meteor.settings.public.supportedLocale;
      var langObj;
      supportedLocale.forEach((sl)=>{
        var lang = sl.split("-")[0];
        if (lang == 'es') {
          lang = sl;
        }
        if(langObj){
          langObj[lang] = sl;
        }else{
          langObj = {[lang]:sl}
        }
      });

      if(langObj[language]){
        i18n.setLocale(langObj[language]);
      }

      this.setState({
        selectedGroupLanguage:language,
      });
    }
  }

  componentWillUnmount(){
    
    var userLocale = i18n.getLocale();
    var user = this.props.currentUser;
    if(user && user.profile && user.profile.locale){
      userLocale = user.profile.locale;
    }
    i18n.setLocale(userLocale);
  }

  showInviteGroup(bool){
    this.setState({
      showInviteGroup: bool,
    });
  }

  frameIsLoaded(){
    this.setState({
        presentationFrameLoaded:true
    });
  }

  toggleTabs(tabName){
    if(this.state.currentTab != tabName){
      this.setState({
        currentTab:tabName,
      });
    }
  }

  confirmStartGame(){
    if(this.props.group && this.props.group.userIds && this.props.group.userIds.length >= 2){
      this.setState({
        showConfirmStart: true,
      });
    }else{
      this.setState({
        showInfo: true,
        showInfoMessage:"Each group in a WeQ session must have at least 2 players"
      });
    }
  }

  startGamePlaceCards(){
    Meteor.call( 'start.game.place.cards', this.props.group._id, (error, result)=>{
      if(error){
        console.log(error)
        var msg;
        if(error.error == "not_all_invitees_finished_survey"){
          msg = 
          (<div>All participants must complete the survey and be present before you can start the game.<br/> 
          (Be sure to delete any members who will not be participating)</div>)
        }else{
          msg = error.error;
        }
        
        this.setState({
          showInfo: true,
          showInfoMessage:msg
        });
      }
    });
  }

  stopGamePlaceCardConfirm(){
    this.setState({
      showConfirmStop: true,
    });
  }

  stopGamePlaceCards(){
    Meteor.call( 'stop.game.place.cards', this.props.group._id, (error, result)=>{
      if(error){
        console.log(error);
        this.setState({
          showInfo: true,
          showInfoMessage:msg
        });
      }
    });
  }

  renderUserCards(cards){
    var cardsToShow = JSON.parse(JSON.stringify(cards));
    var groupType = this.props.group && this.props.group.groupType;
    var shortMode =  groupType && groupTypeIsShort(groupType);
    if(shortMode){
      //praise
      if(groupTypeShortList[1] === groupType){
        //remove card #5, #6 and #7
        cardsToShow = cardsToShow.slice(0, 4);
      }
      //criticism
      else if(groupTypeShortList[2] === groupType){
        //remove card #3 and #4
        cardsToShow.splice(2,1);
        cardsToShow.splice(2,1);
      }
    }
    
    return cardsToShow.map((card, index) => {
      var className = `font-number ${ card.category }`;
      if(shortMode){
        className = `font-number ${ card.category } card-shape`;
      }
      return(
        <div className={className} key={card.cardId}>
          {card.cardId}
        </div>
      )
    });
  }

  renderUserCardsPlaceholder(){
    var groupType = this.props.group && this.props.group.groupType;
    var shortMode =  groupType && groupTypeIsShort(groupType);
    var cards = [1,2,3,4,5,6,7];
    if(shortMode){
      //praise
      if(groupTypeShortList[1] === groupType){
        //remove card #5, #6 and #7
        cards = cards.slice(0, 4);
      }
      //criticism
      else if(groupTypeShortList[2] === groupType){
        //remove card #3 and #4
        cards.splice(2,1);
        cards.splice(2,1);
      }
    }
    return cards.map((index) => {
      var className = `font-number placeholder`;
      if(shortMode){
        className = `font-number placeholder card-shape`;
      }
      return(
        <div className={className} key={"placeholder-card-"+index}>
          #
        </div>
      )
    });
  }

  renderUsers(){
    return this.props.users.map((user, index) => {
      var userId = user._id;
      var email = user.emails[0].address;
      var readySurvey;
      if(this.props.group.userIdsSurveyed && this.props.group.userIdsSurveyed.indexOf(userId) > -1){
        readySurvey = true;
      }
      var startedOrFinished = (this.props.group.isPlaceCardActive || this.props.group.isPlaceCardFinished);

      var cardPlacement = this.props.cardPlacements.find((cp,index)=>{
        return cp.userId == user._id;
      })

      var odd = (index % 2) > 0;

      var name;

      if(user.profile.firstName && user.profile.lastName){
        name = user.profile.firstName + " " + user.profile.lastName;
      }else{
        name = email;
      }

      if(readySurvey && startedOrFinished && cardPlacement && cardPlacement.cardPicked && cardPlacement.cardPicked.length > 0){
        var userCards;
        if(this.props.group && groupTypeIsShort(this.props.group.groupType)){
          userCards = cardPlacement.cardPicked;
        }else{
          userCards = cardPlacement.cardPicked.sort((a, b)=>{
            return (Number(a.cardId) - Number(b.cardId));
          });
        }

        return(
          <div className={"tap-content card w-clearfix" + (odd ? " grey-bg": "")} key={user._id}>
            <div className="tap-left card">
              <div className="font-card-username-cards ready">
                {name}
              </div>
            </div>
            <div className="show-cards">
                {
                  this.renderUserCards(userCards)
                }
            </div>
          </div>
        );
      }
      else{
        return(
          <div className={"tap-content w-clearfix" + (odd ? " grey-bg": "")} key={user._id}>
            <div className="tap-left card">
              <div className={"font-card-username-cards not-ready"}>
                {name}
              </div>
            </div>
            <div className="show-cards">
              {this.renderUserCardsPlaceholder()}
            </div>
          </div>
        );
      }
    });
  }

  renderLockIcon(){
    if(!Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) || this.props.group && this.props.group.groupType === "norming"){
      return (
        <i className="fas fa-lock"></i>
      );
    }
    else{
      return false;
    }
  }

  tabContentNormingCheck(realContentToShow, currentTab){
    if(!Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) || this.props.group && this.props.group.groupType === "norming"){
      return (
        <GroupNormingAds currentTab={currentTab}/>
      );
    }
    else{
      return realContentToShow;
    }
  }

  render() {
    if(this.props.dataReady){
      var tabContent;

      if(this.state.currentTab == "edit"){
        tabContent = (<InviteGroup isEdit={true} group={this.props.group}/>);
      }
      else if(this.state.currentTab == "presentation"){
        tabContent = "";
      }
      else if(this.state.currentTab == "survey"){
        tabContent = 
        (<GroupTypeformSurvey group={this.props.group} users={this.props.users}/>);
      }
      else if(this.state.currentTab == "card"){
        var readySurvey;
        if(this.props.group.userIdsSurveyed && this.props.group.userIds.length == this.props.group.userIdsSurveyed.length){
          readySurvey = true;
        }

        let realTabContent = 
        (<div className="tap-content-wrapper card">
          
          {this.props.group && !this.props.group.isFinished && !this.props.group.isPlaceCardFinished && readySurvey &&
            (
              <div className="tap-content w-clearfix">
                {this.props.group.isPlaceCardActive 
                ?
                <div className="w-inline-block game-status">Waiting for participants...</div>
                :
                <a id="submitSend" className="invitebttn w-button w-inline-block" onClick={this.confirmStartGame.bind(this)}>Start</a>
                }
              </div>
            )
          }
          {this.props.group && this.props.group.isPlaceCardActive && !this.props.group.isFinished && !this.props.group.isPlaceCardFinished && readySurvey &&
            <div className="tap-content w-clearfix">
              <a id="submitSend" className="invitebttn w-button w-inline-block" onClick={this.stopGamePlaceCardConfirm.bind(this)}>stop</a>
            </div>
          }

          {this.renderUsers()}

          {!this.props.group.isPlaceCardActive &&
            <div className="tap-content w-clearfix">
              <div className="tap-left card">
              </div>
            </div>
          }
        </div>);
        
        tabContent = this.tabContentNormingCheck(realTabContent,this.state.currentTab);

      }
      else if(this.state.currentTab == "quiz"){
        tabContent = 
        (<GroupQuizPage group={this.props.group} language={this.state.selectedGroupLanguage} cardPlacements={this.props.cardPlacements}/>);
      }
      else if(this.state.currentTab == "play-cards"){
        tabContent = this.tabContentNormingCheck(<GroupPlayCardPage group={this.props.group}/>, this.state.currentTab);
      }
      else if(this.state.currentTab == "report"){
        tabContent = this.tabContentNormingCheck(<GroupReportPage groupId={this.props.match.params.id}/>,this.state.currentTab);
      }
      return(
            <section className="section home fontreleway groupbg" >
              <MenuPresentation location={this.props.location} history={this.props.history} groupName={this.props.group.groupName}/>

              <div className={"tabs-menu w-tab-menu"}>
                <div className="tabs-menu-manage-session">
                  <div className={"tap edit w-inline-block w-tab-link " + (this.state.currentTab == "edit" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"edit")}>
                    <div>Manage session</div>
                  </div>
                </div>
                <div className="tabs-menu-inner-wrapper">
                  <div className={"tap presentation w-inline-block w-tab-link " + (this.state.currentTab == "presentation" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"presentation")}>
                    <div>Present slide</div>
                  </div>
                  <div className={"tap survey w-inline-block w-tab-link " + (this.state.currentTab == "survey" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"survey")}>
                    <div>View survey</div>
                  </div>
                  <div className={"tap card w-inline-block w-tab-link " + (this.state.currentTab == "card" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"card")}>
                    <div>Prepare cards &nbsp;{this.renderLockIcon()}</div>
                  </div>
                  <div className={"tap quiz w-inline-block w-tab-link " + (this.state.currentTab == "quiz" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"quiz")}>
                    <div>Do quiz</div>
                  </div>
                  {this.props.group && (groupTypeIsShort(this.props.group.groupType) || this.props.group.groupType === "norming") &&
                    <div className={"tap play-cards w-inline-block w-tab-link " + (this.state.currentTab == "play-cards" && "w--current")}
                    onClick={this.toggleTabs.bind(this,"play-cards")}>
                      <div>Play cards &nbsp;{this.renderLockIcon()}</div>
                    </div>
                  }
                  <div className={"tap report w-inline-block w-tab-link tap-last " + (this.state.currentTab == "report" && "w--current")}
                  onClick={this.toggleTabs.bind(this,"report")}>
                    <div>Download report &nbsp;{this.renderLockIcon()}</div>
                  </div>
                </div>
              </div>
              <div className={`tabs w-tabs ${this.state.currentTab}`} style={{display:this.state.currentTab == "presentation"?"none":"block"}}>
                  {tabContent}
              </div>


              {(this.state.currentTab == "presentation" || this.state.presentationFrameLoaded) &&
                //unlike other tab content, always render "presentation" tabs
                //this is done so it 'remembers' which slide was last on when switching between tabs
                <div className={`tabs w-tabs ${this.state.currentTab}`} style={{display:this.state.currentTab == "presentation"?"block":"none"}}>
                  <GroupPresentation 
                  language={this.state.selectedGroupLanguage} 
                  group={this.props.group} 
                  frameIsLoaded={this.frameIsLoaded.bind(this)}
                  display={this.state.currentTab == "presentation"}
                  />
                </div>
              }
              

              {this.state.showInfo &&
                <SweetAlert
                type={"info"}
                message={this.state.showInfoMessage}
                onCancel={() => {
                    this.setState({ showInfo: false });
                }}/>
              }

              {this.state.showConfirmStart &&
                <SweetAlert
                type={"confirm"}
                message={"Everyone ready for interactive mode?"}
                imageUrl={"/img/gameMaster/interactive.gif"}
                confirmText={"Let's go!"}
                cancelText={"Cancel"}
                onCancel={() => {
                    this.setState({ showConfirmStart: false });
                }}
                onConfirm={() => {
                  this.setState({ showConfirmStart: false });
                  this.startGamePlaceCards();
                }}/>
              }

              {this.state.showConfirmStop &&
                <SweetAlert
                type={"confirm"}
                message={"Are you sure? You'll need to start over if you stop this now"}
                confirmText={"Yes, stop this now"}
                cancelText={"Cancel"}
                onCancel={() => {
                    this.setState({ showConfirmStop: false });
                }}
                onConfirm={() => {
                  this.setState({ showConfirmStop: false });
                  this.stopGamePlaceCards();
                }}/>
              }
            </section>
      ) 
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
  var group;
  var users;
  var cardPlacements;
  var handleGroup;
    if(props.match.params.id){
        handleGroup = Meteor.subscribe('group',{_id : props.match.params.id},{}, {
          onError: function (error) {
                console.log(error);
            }
        });


        if(handleGroup.ready()){
          group = Group.findOne({_id : props.match.params.id});

          var handleCardPlacement = Meteor.subscribe('cardPlacement',{groupId:group._id},{}, {
              onError: function (error) {
                    console.log(error);
              }
          });

          if(handleCardPlacement.ready()){
            cardPlacements = CardPlacement.find({groupId:group._id}).fetch();
            users = Meteor.users.find(
              {
                "_id" : {$in:group.userIds}
              }
            ).fetch();
  
            dataReady = true;
          }
        }
    }
  return {
      users:users,
      group:group,
      cardPlacements:cardPlacements,
      currentUser: Meteor.user(),
      dataReady:dataReady
  };
})(GroupPage);
