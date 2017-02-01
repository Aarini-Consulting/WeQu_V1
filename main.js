if (Meteor.isClient) {

    Router.configure({ layoutTemplate: 'ApplicationLayout' },
        {
        except: ['signIn']
    });
    Router.onBeforeAction(function () {
        Meteor.userId() ? this.next() : this.render('login');
    }, { 'except': [ '/invitation/:_id', '/script-invitation', '/admin', '/signIn', '/signUp'] });

    Router.onBeforeAction(function () {
        if(Session.get('invite')) {
            Router.go('/script-invitation');
        } else if(getLoginScript() /* && Router.current().route.getName()!="/invite" */) {
            Router.go('/script-login')
        }
        return this.next();
    }, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id', '/invite' ] });

    route = new ReactiveVar("quiz");

    Router.route('/signIn', function () {
        return this.render('signIn');
    } ,{
        name: 'signIn' });

    Router.route('/', function () {
        return this.render('signIn');
    });

    Router.route('/signUp', function () {
        return this.render('signUp');
    } ,{
        name: 'signUp' });

    Router.route('/feed', function () {
        route.set('feed')
        return this.render('feed');
    }, { 'name': '/feed' });
    Template.menu.helpers ({
      route: function(status) {
        return status == route.get();
      },
      loggedIn: function(){
        return !Meteor.userId();
      }
    });

    Template.menu.events({
      "click #logout" : function(){
          Meteor.logout();
          Router.go('/profile');
       }
        
   });

    Template.menuProfile.helpers ({
      route: function(status) {
        return status == route.get();
      }
    });

    Template.login.rendered = function(){
        // TODO : Temporarily doing this .. verify is this way needed .
        Session.set("loginWithEmail", true);
    }

    Template.login.events({
       "click .loginEmail" : function(){
          Session.set("loginWithEmail", true);
          Router.go('/signIn');
        }
    })

    Template.login.helpers({
      loginWithEmail: function () {
        return Session.get('loginWithEmail');
      },
    });

    setLoginScript =  function setLoginScript(value) {
        Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': value } });
    };


    Template.registerHelper("username", getUserName);
    Template.registerHelper("case", function(){
        var pair =_.chain(this).pairs().first().value();

        var key = pair[0];
        var value = pair[1];

        var pdata = Template.parentData(1);
        _.extend(this, pdata);

        if(pdata && pdata[key] && pdata[key] == value) {
            return Template._case_default;
        }
        var rvar = window[key];
        if(!rvar){
            rvar = window[key] = new ReactiveVar("default");
        }
        if(rvar instanceof ReactiveVar && rvar.get() == value) {
            return Template._case_default;
        }
        return null;
    });

    _.chain(this).pairs().filter(function(pair){
        return (pair[1] instanceof ReactiveVar);
    }).each(function(pair){
        Template.registerHelper(pair[0], function(){
            return pair[1].get();
        });
    });

}

Connections = new Mongo.Collection("connections");

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.publish("connections", function(){
            //make linkedin api call
            if(this.userId) {
                //make api call
                //this.added("connections", 1, {firstName : "Ilya Ovdin"});
            }
            this.ready();
        });
        // code to run on server at startup
    });
}
