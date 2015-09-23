if (Meteor.isClient) {  
  
    Router.configure({ layoutTemplate: 'ApplicationLayout' });
    Router.onBeforeAction(function () {
        Meteor.userId() ? this.next() : this.render('login');
    }, { 'except': [ '/invitation/:_id', '/script-invitation' ] });


    Router.onBeforeAction(function () {
        getLoginScript() ? Router.go('/script-login') : void 0;
        Session.get('invite') ? Router.go('/script-invitation') : void 0;
        return this.next();
    }, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id' ] });

    route = new ReactiveVar("quiz");
  
    Router.route('/', function () {
        route.set('profile');
        return Router.go('/profile');
    }, { 'name': '/' });

    Router.route('/feed', function () {
        route.set('feed')
        return this.render('feed');
    }, { 'name': '/feed' });

    Template.menu.helpers ({  
      route: function(status) {
        return status == route.get();
      }
    });
  
    Template.menuProfile.helpers ({  
      route: function(status) {
        return status == route.get();
      }
    });
  
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

    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile || {};
        user.profile.loginScript = 'init';
        user.profile.gradient = Math.floor(Math.random() * 5) + 1;
        console.log('onUserCreated', user.profile);
        return user;
    });
}
