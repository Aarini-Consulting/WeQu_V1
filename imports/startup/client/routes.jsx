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

import ScriptLogin from '/imports/ui/pages/ScriptLogin';
import QuizPage from '/imports/ui/pages/quiz/QuizPage';
import ProfilePage from '/imports/ui/pages/profile/ProfilePage';
import InvitePage from '/imports/ui/pages/invite/InvitePage';
import NotFound from '/imports/ui/pages/NotFound';

import Test from '/imports/ui/pages/test';

import Login from '/imports/ui/pages/accounts/Login';
import RecoverPassword from '/imports/ui/pages/accounts/RecoverPassword';
import SignUp from '/imports/ui/pages/accounts/SignUp';
import VerifyEmail from '/imports/ui/pages/accounts/VerifyEmail';

import Terms from '/imports/ui/pages/legal/Terms';
import PrivacyPolicy from '/imports/ui/pages/legal/PrivacyPolicy';

import AdminUser from '/imports/ui/pages/AdminUser';


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

// const authenticate = (nextState, replace) => {
//   if (!Meteor.loggingIn() && !Meteor.userId()) {
//     // Session.set( "loginRedirect", nextState.location.pathname );
//     replace({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname },
//     });
//   }
// };

const App = () => (
  <Switch history={history}>
      {/* <Route name="script-login" path="/script-login" component={ ScriptLogin } onEnter={ authenticate } /> */}
      <Route exact path='/' render={(props) => (<CheckLogin childComponent={<ScriptLogin {...props}/>} {...props}/>)} />
      <Route exact path='/quiz' render={(props) => (<CheckLogin childComponent={<QuizPage {...props}/>} {...props}/>)} />
      <Route exact path='/quiz/:uid' render={(props) => (<CheckLogin childComponent={<QuizPage {...props}/>} {...props}/>)} />
      <Route exact path='/profile' render={(props) => (<CheckLogin childComponent={<ProfilePage {...props}/>} {...props}/>)} />
      <Route exact path='/invite' render={(props) => (<CheckLogin childComponent={<InvitePage {...props}/>} {...props}/>)} />
      <Route path='/login' render={(props) => (<CheckNotLoggedIn childComponent={<Login {...props}/>} {...props}/>)} />
      <Route path='/recover-password' render={(props) => (<CheckNotLoggedIn childComponent={<RecoverPassword {...props}/>} {...props}/>)} />
      <Route path='/sign-up' render={(props) => (<CheckNotLoggedIn childComponent={<SignUp {...props}/>} {...props}/>)} />
      <Route path='/terms' component={Terms}/>
      <Route path='/privacy' component={PrivacyPolicy}/>
      <Route exact path='/verify-email/:token' component={VerifyEmail} />
      <Route path="/test" component={Test}/>
      <Route path="/adminUser" component={AdminUser}/>
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
   