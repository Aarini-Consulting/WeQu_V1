/* eslint-disable max-len */

import React from 'react';
import { render } from 'react-dom';
import {
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

const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

const App = class App extends React.Component {
  
    constructor(props) {
      super(props);

      this.state={
        languageLoaded:true,
      }
    }

    componentWillMount(){
      // var locale = 'nl-NL';
      // if(i18n.getLocale() != locale){
      //   i18n.setLocale(locale).then(() => {
      //     this.setState({
      //       languageLoaded:true
      //     });
      //   });
      // }
      // else if(i18n.getLocale() == locale && this.state.languageLoaded == false){
      //   this.setState({
      //     languageLoaded:true
      //   });
      // }
    }
  
    render() {
      if(this.state.languageLoaded){
        return (
          <div>
          { /* Place to put layout codes here */ }
          <Switch history={history}>
          <Route name="script-login" path="/script-login" component={ ScriptLogin } onEnter={ authenticate } />
          <Route name="login" path="/login" component={ Login } />
          </Switch>
          </div>
        );
      }
      else{
        return (
          <div>
            loading
          </div>
        );
      }
    }
  }

Meteor.startup(()=> {
  $(document).ready(()=>{
    render((
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ), document.getElementById('root'));   
  })                                                                                               
});    
   