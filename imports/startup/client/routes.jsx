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
import Login from '/imports/ui/pages/Login';

const history = createBrowserHistory();

//container component to check user's login status
//if not logged in, redirect to home
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
      <Route path='/script-login' render={(props) => (<CheckLogin childComponent={<ScriptLogin {...props}/>} {...props}/>)} />
      <Route name="login" path="/login" component={ Login } />
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
   