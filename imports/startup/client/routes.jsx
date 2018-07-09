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
  browserHistory
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';

import CheckLoginVerified from './CheckLoginVerified';

import Home from '/imports/ui/pages/Home';
import QuizRankPage from '/imports/ui/pages/quizRank/QuizRankPage';
import InviteGroupPage from '/imports/ui/pages/invite/InviteGroupPage';
import GroupPage from '/imports/ui/pages/group/GroupPage';
import InviteGroupLanding from '/imports/ui/pages/invitationLanding/InviteGroupLanding';
import Settings from '/imports/ui/pages/settings/Settings';
import EditEntry from '/imports/ui/pages/settings/EditEntry';
import NotFound from '/imports/ui/pages/NotFound';
import NotAuthorized from '/imports/ui/pages/NotAuthorized';

// import Test from '/imports/ui/pages/test';

import Login from '/imports/ui/pages/accounts/Login';
import RecoverPassword from '/imports/ui/pages/accounts/RecoverPassword';
import SignUp from '/imports/ui/pages/accounts/SignUp';
import VerifyEmail from '/imports/ui/pages/accounts/VerifyEmail';
import VerifyUpdateEmail from '/imports/ui/pages/accounts/VerifyUpdateEmail';
import ResetPassword from '/imports/ui/pages/accounts/ResetPassword';

import Terms from '/imports/ui/pages/legal/Terms';
import PrivacyPolicy from '/imports/ui/pages/legal/PrivacyPolicy';

import AdminUser from '/imports/ui/pages/AdminUser';

import '/imports/startup/client/css/fontawesome-all.min';
import '/imports/startup/client/css/normalize';
import '/imports/startup/client/css/webflow';
import '/imports/startup/client/css/wequ-profile.webflow';
import LinkedInPermission from '/imports/ui/pages/linkedIn/LinkedInPermission';
import LinkedInHandler from '/imports/ui/pages/linkedIn/LinkedInHandler';

const history = createBrowserHistory();

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

const AdminOnly = class AdminOnly extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if(Meteor.userId() && Roles.userIsInRole( Meteor.userId(), 'GameMaster' )){
      return (
        this.props.childComponent
      );
    }else{
      return(
        <Redirect to="/404"/>
      );
    }
  }
}

const App = () => (
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
)

Meteor.startup(()=> {
  $(document).ready(()=>{
    ReactDOM.render((
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ), document.getElementById('react-root'));   
  })                                                                                               
});    
   