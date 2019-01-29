import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import InviteGroup from '/imports/ui/pages/invite/InviteGroup';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import GroupReportPage from './GroupReportPage';

import {typeformUrlSelector} from '/imports/ui/typeformUrlSelector';

import i18n from 'meteor/universe:i18n';
import GroupPresentation from './GroupPresentation';
import GroupQuiz from './GroupQuiz';

const T = i18n.createComponent();

class GroupPage extends React.Component {
  constructor(props){
      super(props);
      this.state={
        inviteStatus:false,
        selectedGroupLanguage:i18n.getLocale().split("-")[0],
        showInviteGroup:false,
        showConfirm:false,
        showConfirmStart:false,
        showReopenConfirm:false,
        showInfo:false,
        showMatrixInfoPanel:undefined,
        sending:false,
        currentTab:"edit",
        gettingTypeformResult:false
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.group && nextProps.group.groupLanguage){
      language = nextProps.group.groupLanguage;
    }else{
      language = i18n.getLocale().split("-")[0];
    }

    this.setState({
      selectedGroupLanguage:language,
    });
  }

  showInviteGroup(bool){
    this.setState({
      showInviteGroup: bool,
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

  startGame(){
    Meteor.call( 'start.game', this.props.group._id, (error, result)=>{
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

  toggleMatrixInfoPanel(skillName){
    var matrix = this.state.showMatrixInfoPanel;

    if(!matrix){
      matrix = {};
    }

    if(matrix && matrix[skillName]){
      matrix[skillName]=false;
    }else{
      matrix[skillName]=true;
    }
    this.setState({
      showMatrixInfoPanel:matrix
    });
  }

  getTypeFormResult(){
    if(!this.state.gettingTypeformResult && this.props.group.userIds && this.props.group.userIdsSurveyed && this.props.group.userIds.length == this.props.group.userIdsSurveyed.length){
      this.setState({
        gettingTypeformResult: true,
      });

      var supportedLocale = Meteor.settings.public.supportedLocale;

      var formIds = [];

      supportedLocale.forEach((locale)=>{
        var languageCode = locale.split("-")[0];
        var formIdTest = Meteor.settings.public.typeformTestFormCode;
        var formIdProd =  Meteor.settings.public.typeformProdFormCode;

        var formIdSelected;

        if(window.location.hostname == "app.weq.io"){
          formIdSelected = formIdProd[languageCode];
          if(!formIdSelected){
            formIdSelected = formIdProd["en"];
          }
        }else{
          formIdSelected = formIdTest[languageCode];
          if(!formIdSelected){
            formIdSelected = formIdTest["en"];
          }
        }

        formIds.push(formIdSelected);
      });

      Meteor.call('get.all.response.typeform', this.props.group._id, formIds, this.props.group.createdAt, (error, result)=>{
        if(error){
          console.log(error);
        }

        this.setState({
          gettingTypeformResult: false,
        });
      });
    }
  }

  renderUserCards(cards){
    return cards.map((card, index) => {
      return(
        <div className={`font-number ${ card.category }`} key={card.cardId}>
          {card.cardId}
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
      var started = this.props.group.isActive;

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

      if(readySurvey && started && cardPlacement && cardPlacement.cardPicked && cardPlacement.cardPicked.length > 0){
        return(
          <div className={"tap-content w-clearfix" + (odd ? " grey-bg": "")} key={user._id}>
            <div className="tap-left card">
              <div className="font-card-username-cards ready">
                {name}
              </div>
            </div>
            <div className="show-cards">
                {this.renderUserCards(cardPlacement.cardPicked.sort((a, b)=>{
                  return (Number(a.cardId) - Number(b.cardId));
                }))}
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
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
              <div className={`font-number placeholder`}>
                #
              </div>
            </div>
          </div>
        );
      }
    });
  }

  renderUsersSurvey(){
    return this.props.users.map((user, index) => {
      var userId = user._id;
      var email = user.emails[0].address;
      var readySurvey;
      if(this.props.group.userIdsSurveyed && this.props.group.userIdsSurveyed.indexOf(userId) > -1){
        readySurvey = true;
      }
      var started = this.props.group.isActive;

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

      return(
        <div className={"tap-content w-clearfix" + (odd ? " grey-bg": "")} key={user._id}>
          <div className="tap-left card">
            <div className={"font-card-username "+(readySurvey ? "ready": "not-ready")}>
              {name}
            </div>
          </div>
          <div className="show-cards">
            {readySurvey && started
            ?
              <div className="bttn-next-card">session in progress</div>
            :
              readySurvey 
              ? 
                <div className="bttn-next-card">Ready!</div>
              : 
              <div>
                {!readySurvey && <div className="bttn-next-card not-ready">Survey incomplete</div>}
              </div>
            }
          </div>
        </div>
      )
    });
  }

  renderSurveyGraph(skills){
    if(!skills || skills.length < 1){
      if(this.props.group && this.props.group.userIds && this.props.group.userIdsSurveyed && this.props.group.userIds.length == this.props.group.userIdsSurveyed.length){
        return(
          <div className="create-chart-tab">
              <div className="create-chart-wrapper">
                <div className="create-chart-icon-wrapper">
                  <i className="far fa-chart-bar"></i>
                </div>
                {this.state.gettingTypeformResult 
                  ?
                  <div className="invitebttn create-chart w-button w-inline-block noselect">
                    Loading...
                  </div>
                  :
                  <div className="invitebttn create-chart w-button w-inline-block" onClick={this.getTypeFormResult.bind(this)}>
                    Calculate survey result
                  </div>
                }
                
              </div>
            </div>
        );
      }else{
        return(
          <div className="font-matric">
            Please check again when all surveys are completed
            {this.renderUsersSurvey()}
          </div>
        )
      }
    }
    else{
      var skills = skills.map((skill, index) => {
        var leftPos = 0;
        var total = skill.total || 0;
        var score = skill.score || 0;
        var formattedScore = Number.parseFloat(score).toPrecision(2);

        var value = 0;
        if(total > 0){
          value = formattedScore/total * 100;
        }
        
        if(value > 0){
          leftPos = `calc(${ value }% - 40px)`;
        }

        var infoText = undefined;
        var skillName = undefined;

        switch(skill.name){
          case "Psychological Safety":
            skillName = i18n.getTranslation("weq.groupPage.PsychologicalSafety");
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.PsychologicalSafetyText1</T><br/>
            <T>weq.groupPage.PsychologicalSafetyText2</T><br/>
            <T>weq.groupPage.PsychologicalSafetyText3</T>
            </div>
            break;
          case "Constructive Feedback":
            skillName = i18n.getTranslation("weq.groupPage.ConstructiveFeedback");
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.ConstructiveFeedbackText1</T><br/>
            <T>weq.groupPage.ConstructiveFeedbackText2</T><br/>
            <T>weq.groupPage.ConstructiveFeedbackText3</T>
            </div>
            break;
          case "Cognitive Bias":
            skillName = i18n.getTranslation("weq.groupPage.CognitiveBias");
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.CognitiveBiasText1</T><br/>
            <T>weq.groupPage.CognitiveBiasText2</T><br/>
            <T>weq.groupPage.CognitiveBiasText3</T>
            </div>
            break;
          case "Control over Cognitive Bias":
            skillName = i18n.getTranslation("weq.groupPage.CognitiveBias");
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.CognitiveBiasText1</T><br/>
            <T>weq.groupPage.CognitiveBiasText2</T><br/>
            <T>weq.groupPage.CognitiveBiasText3</T>
            </div>
            break;
          case "Social Norms":
            skillName = i18n.getTranslation("weq.groupPage.SocialNorms");
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.SocialNormsText1</T><br/>
            <T>weq.groupPage.SocialNormsText2</T><br/>
            <T>weq.groupPage.SocialNormsText3</T>
            </div>
            break;
          default:
            skillName = skill.name;
            infoText = <div className="font-matric font-info">
            <T>weq.groupPage.NoMatrixInfo</T>
            </div>
            break;
        }
        
        return (
          <div key={skill.name}>
            <div className="tap-content w-clearfix">
              <div className="tap-left">
                <div className="font-matric">
                  {skillName}
                </div>
                <div className="w-inline-block font-matric-info" onClick={this.toggleMatrixInfoPanel.bind(this, skill.name)}>
                <i className="fas fa-info-circle"></i>
                </div>
              </div>
              <div className="show-numbers">
                <div className="chart-graph w-clearfix">
                  <div className="chart-graph bg"></div>
                  <div className="chart-graph active" style={{width:value + "%"}}></div>
                  <div className="chart-number" style={{left:leftPos}}>
                    <div className="font-chart-nr">{formattedScore}</div>
                  </div>
                </div>
              </div>
              <div className="tap-right">
                <div className="font-matric">
                  {formattedScore} / {total}
                </div>
              </div>
            </div>
            {this.state.showMatrixInfoPanel && this.state.showMatrixInfoPanel[skill.name] && infoText &&
              <div className="w-block matric-info-panel" onClick={this.toggleMatrixInfoPanel.bind(this, skill.name)}>
                <div className="font-matric font-close">
                  <i className="fa fa-window-close" aria-hidden="true"></i>
                </div>
                {infoText}
              </div>
            }
            
          </div>
        );
      });

      return (
        <div>
          {this.props.group && !this.props.group.isActive && !this.props.group.isFinished &&
            <a id="submitSend" className="invitebttn w-button w-inline-block" onClick={this.confirmStartGame.bind(this)}>Start game</a>
          }
          {(this.props.group && this.props.group.isFinished) 
            ?
            <a id="submitSend" className="invitebttn w-button w-inline-block noselect disabled">
              Game Finished
            </a>
            :this.props.group.isActive &&
            <a id="submitSend" className="invitebttn w-button w-inline-block noselect disabled">
              Game Started
            </a>
          }
          {skills}
          <br/>
          <br/>
            <div className="div-block-right">
              <div className="w-inline-block survey-graph-footer">
                <div className="font-matric-refresh">
                  {this.props.group.userIdsSurveyed.length} out of {this.props.group.userIds.length} people
                  <br/>
                  completed the survey
                </div>
                {this.state.gettingTypeformResult 
                  ?
                  <div className="invitebttn create-chart refresh w-button w-inline-block noselect">
                    Loading...
                  </div>
                  :
                  <div className="invitebttn create-chart refresh w-button w-inline-block" onClick={this.getTypeFormResult.bind(this)}>
                    Refresh
                  </div>
                }  
              </div>
          </div>
        </div>
      );
    }
  }

  render() {
    if(this.props.dataReady){
      var tabContent;

      if(this.state.currentTab == "edit"){
        tabContent = (<InviteGroup isEdit={true} group={this.props.group}/>);
      }
      else if(this.state.currentTab == "presentation"){
        tabContent = 
        (<GroupPresentation language={this.state.selectedGroupLanguage}/>);
      }
      else if(this.state.currentTab == "survey"){
        tabContent = 
        (<div className="tap-content-wrapper">
          {this.renderSurveyGraph(this.props.group.typeformGraph)}
        </div>);
      }
      else if(this.state.currentTab == "card"){
        tabContent = 
        (<div className="tap-content-wrapper" ref="printTarget">
          {this.renderUsers()}
          {!this.props.group.isActive &&
            <div className="tap-content w-clearfix">
              <div className="tap-left card">
              </div>
            </div>
          }
        </div>);
      }
      else if(this.state.currentTab == "quiz"){
        tabContent = 
        (<GroupQuiz language={this.state.selectedGroupLanguage}/>);
      }
      else if(this.state.currentTab == "report"){
        tabContent = 
        (<GroupReportPage groupId={this.props.match.params.id}/>);
      }
      return(
            <section className="section home fontreleway groupbg" >
              <Menu location={this.props.location} history={this.props.history}/>
              <div className="screentitlewrapper w-clearfix">
                <div className="screentitlebttn back">
                  <a className="w-clearfix w-inline-block cursor-pointer arrow-left-white" onClick={()=>{
                    this.props.history.goBack();
                  }}>
                  <i className="fas fa-arrow-left"></i>
                  </a>
                </div>
                <div className="fontreleway font-invite-title white w-clearfix">
                {this.props.group.groupName}
                </div>
              </div>
              <div className={"tabs-menu w-tab-menu tap-underline "+ this.state.currentTab}>
                <a className={"tap edit w-inline-block w-tab-link " + (this.state.currentTab == "edit" && "w--current")}
                onClick={this.toggleTabs.bind(this,"edit")}>
                  <div>Manage group</div>
                </a>
                <a className={"tap presentation w-inline-block w-tab-link " + (this.state.currentTab == "presentation" && "w--current")}
                onClick={this.toggleTabs.bind(this,"presentation")}>
                  <div>Present</div>
                </a>
                <a className={"tap survey w-inline-block w-tab-link " + (this.state.currentTab == "survey" && "w--current")}
                onClick={this.toggleTabs.bind(this,"survey")}>
                  <div>View survey</div>
                </a>
                <a className={"tap card w-inline-block w-tab-link " + (this.state.currentTab == "card" && "w--current")}
                onClick={this.toggleTabs.bind(this,"card")}>
                  <div>Prepare cards</div>
                </a>
                <a className={"tap quiz w-inline-block w-tab-link " + (this.state.currentTab == "quiz" && "w--current")}
                onClick={this.toggleTabs.bind(this,"quiz")}>
                  <div>Do Quiz</div>
                </a>
                <a className={"tap report w-inline-block w-tab-link tap-last " + (this.state.currentTab == "report" && "w--current")}
                onClick={this.toggleTabs.bind(this,"report")}>
                  <div>Download report</div>
                </a>
              </div>
              <div className="tabs w-tabs">
                  {tabContent}
              </div>

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
                message={"Are the participants all present and ready?"}
                confirmText={"Let's go!"}
                cancelText={"Cancel"}
                onCancel={() => {
                    this.setState({ showConfirmStart: false });
                }}
                onConfirm={() => {
                  this.setState({ showConfirmStart: false });
                  this.startGame();
                }}/>
              }
            </section>
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
