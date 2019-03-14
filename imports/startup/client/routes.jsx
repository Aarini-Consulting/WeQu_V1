/* eslint-disable max-len */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Redirect,
  Switch,
  BrowserRouter,
  Route,
  Link,
  IndexRoute, 
  browserHistory,
  withRouter
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {render} from 'react-dom';
import CheckLoginVerified from './CheckLoginVerified';
import AdminOnly from './AdminOnly';

import Home from '/imports/ui/pages/Home';
import QuizRankPage from '/imports/ui/pages/quizRank/QuizRankPage';
import InviteGroupPage from '/imports/ui/pages/invite/InviteGroupPage';
import GroupPage from '/imports/ui/pages/group/GroupPage';
import InviteGroupLanding from '/imports/ui/pages/invitationLanding/InviteGroupLanding';
import Settings from '/imports/ui/pages/settings/Settings';
import EditEntry from '/imports/ui/pages/settings/EditEntry';
import NotFound from '/imports/ui/pages/NotFound';
import NotAuthorized from '/imports/ui/pages/NotAuthorized';

import Login from '/imports/ui/pages/accounts/Login';
import RecoverPassword from '/imports/ui/pages/accounts/RecoverPassword';
import SignUp from '/imports/ui/pages/accounts/SignUp';
import VerifyEmail from '/imports/ui/pages/accounts/VerifyEmail';
import VerifyUpdateEmail from '/imports/ui/pages/accounts/VerifyUpdateEmail';
import ResetPassword from '/imports/ui/pages/accounts/ResetPassword';

import AdminUser from '/imports/ui/pages/AdminUser';

import '/imports/startup/client/css/fontawesome-all.min';
import '/imports/startup/client/css/normalize';
import '/imports/startup/client/css/webflow';
import '/imports/startup/client/css/wequ-profile.webflow';
import '/imports/startup/client/css/sweetalert';
import LinkedInPermission from '/imports/ui/pages/linkedIn/LinkedInPermission';
import LinkedInHandler from '/imports/ui/pages/linkedIn/LinkedInHandler';

import Loading from '/imports/ui/pages/loading/Loading';

import {getDefaultLocale} from '/imports/startup/client/getDefaultLocale';

const history = createBrowserHistory();

import i18n from 'meteor/universe:i18n';
import ReportPdf from '/imports/ui/pages/group/ReportPdf';
import GroupQuizReportPdf from '/imports/ui/pages/group/reportTemplate/GroupQuizReportPdf';

const T = i18n.createComponent();

//container component to check user's login status
//if not logged in, redirect to login page
const CheckLogin = class CheckLogin extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if(!Meteor.loggingIn() && !Meteor.userId()){
      Session.set( "loginRedirect", this.props.location.pathname);
      return(
        <Redirect to="/login"/>
      ); 
    }else{
      return (
        this.props.childComponent
      );
    }
  }
}

//container component to check user's login status
//if logged in, redirect to home page
const CheckNotLoggedIn = class CheckNotLoggedIn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if(Meteor.userId()){
      return(
        <Redirect to="/"/>
      ); 
    }else{
      return (
        this.props.childComponent
      );
    }
  }
}

const App = class App extends React.Component {
    
  constructor(props) {
    super(props);
    this.state={
      initialLocale:getDefaultLocale(),
      languageLoaded:false,
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.currentUser && !nextProps.currentUser){
      //logout detected, set locale back to its initial locale
      this.unsetLocale();
    }

    //only run setlocale on first time (to prevent overriding locale set from group page)
    //I resorted to this hack because i18n.runWithLocale() doesn't seem to work on the client side of the app
    if(!this.props.currentUser && nextProps.currentUser){
      this.setLocale(nextProps);
    }
  }

  componentDidMount(){
    this.setLocale(this.props);
  }

  unsetLocale(){
    i18n.setLocale(this.state.initialLocale);
  }

  setLocale(props){
    //detect current locale
    var locale = getDefaultLocale();
    //e.g. locale = 'en-US';
    var supportedLocale = Meteor.settings.public.supportedLocale;

    //override detected locale with locale value from user profile
    var user = props.currentUser;
    var userHasLocale;
    if(user && user.profile && user.profile.locale){
      locale = user.profile.locale;
      userHasLocale = true;
    }
    
    var languageCode;
    //check type of locale (e.g. "en" or "en-US")
    if(locale.toString().length > 2){
      languageCode = locale.split("-")[0];
    }else{
      languageCode = locale;
    }

    if(supportedLocale.indexOf(locale) < 0){
      //locale not listed as supported
      //check locale lang to see if it match any of the supported lang

      var langObj;
      supportedLocale.forEach((sl)=>{
        var lang = sl.split("-")[0];
        if(langObj){
          langObj[lang] = sl;
        }else{
          langObj = {[lang]:sl};
        }
      });

      if(langObj[languageCode]){
        locale = langObj[languageCode];
      }else{
        locale = supportedLocale[0];
      }
    }

    if(!userHasLocale){
      //set user's locale
      Meteor.call( 'user.set.locale', locale, ( error, response ) => {
        if ( error ) {
          console.log(error);
        }
      });
    }

    i18n.setLocale(locale).then(() => {
      this.setState({
        languageLoaded:true
      });
    });

    if(i18n.getLocale() == locale && !this.state.languageLoaded){
      this.setState({
        languageLoaded:true
      });
    }
  }

  componentWillUnmount(){
    //on destroy, set locale back to original locale
    this.unsetLocale();
  }

  render() {
    if(this.state.languageLoaded){
        return (
          <div style={{height:100+"%"}}>
          { /* Place to put layout codes here */ }
          <Switch history={history}>
              <Route exact path='/' render={(props) => (<CheckLogin childComponent={<Home {...props}/>} {...props}/>)} />
              <Route exact path='/quiz/:gid' render={(props) => (<CheckLoginVerified childComponent={<QuizRankPage {...props}/>} {...props}/>)} />
              <Route exact path='/invite-group' render={(props) => (<AdminOnly childComponent={<InviteGroupPage {...props}/>} {...props}/>)} />
              <Route exact path='/group/:id' render={(props) => (<AdminOnly childComponent={<GroupPage {...props}/>} {...props}/>)} />
              <Route exact path='/settings' render={(props) => (<CheckLoginVerified childComponent={<Settings {...props}/>} {...props}/>)} />
              <Route exact path='/settings/:type' render={(props) => (<CheckLoginVerified childComponent={<EditEntry {...props}/>} {...props}/>)} />
              <Route exact path='/linkedin-permission/:redirect_pathname' render={(props) => (<CheckLoginVerified childComponent={<LinkedInPermission {...props}/>} {...props}/>)} />/>
              <Route exact path='/linkedin-handler' render={(props) => (<CheckLoginVerified childComponent={<LinkedInHandler {...props}/>} {...props}/>)} />/>
              <Route exact path='/group-invitation/:email/:id' component={InviteGroupLanding}/>
              {/* <Route exact path='/debug' component={ReportPdf}/> */}
              {/* <Route exact path='/group-quiz-result-print/:id' render={(props) => (<CheckLoginVerified childComponent={<ReportPdf {...props}/>} {...props}/>)} />/> */}
              <Route exact path='/group-quiz-result-print/:gid/:qid' component={GroupQuizReportPdf}/>
              
              <Route exact path='/login' render={(props) => (<CheckNotLoggedIn childComponent={<Login {...props}/>} {...props}/>)} />
              <Route exact path='/login/:id' render={(props) => (<CheckNotLoggedIn childComponent={<Login {...props}/>} {...props}/>)} />
              <Route path='/recover-password' render={(props) => (<CheckNotLoggedIn childComponent={<RecoverPassword {...props}/>} {...props}/>)} />
              <Route exact path='/reset-password/:token' component={ResetPassword} />
              <Route exact path='/sign-up' render={(props) => (<CheckNotLoggedIn childComponent={<SignUp {...props}/>} {...props}/>)} />
              <Route exact path='/sign-up/:id' render={(props) => (<CheckNotLoggedIn childComponent={<SignUp {...props}/>} {...props}/>)} />
              <Route exact path='/verify-email/:token' component={VerifyEmail} />
              <Route exact path='/update-email/:token' component={VerifyUpdateEmail} />
              <Route path="/adminUser" component={AdminUser}/>
              <Route path="/404" component={NotFound}/>
              <Route path="/401" component={NotAuthorized}/>
              <Route path="*" component={NotFound}/>
          </Switch>
          </div>
        );
    }
    else{
      return (
        <div className="loginwraper">
          <Loading/>
        </div>
      );
    }
  }
};

export const AppWrapper = withRouter(withTracker((props) => {
  var dataReady = false;
  var currentUser = Meteor.user();

  if(Meteor.userId()){
    if(currentUser){
      dataReady = true;
    }
  }else{
    dataReady = true;
  }
  return {
    dataReady: dataReady,
    currentUser: currentUser,
  };
})(App)); 
  
Meteor.startup(()=> {
  $(document).ready(()=>{
    render((
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    ), document.getElementById('react-root'));   
  })                                                                                               
});    