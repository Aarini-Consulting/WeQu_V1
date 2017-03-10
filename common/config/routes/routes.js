    //All the routes are configured here

    Router.configure({
        layoutTemplate: 'ScriptLayout',
        notFoundTemplate: 'notFoundLayout'
    });


    Router.configure(
        {  except: ['signIn','signUp']  }
        );

    Router.onBeforeAction(function () {
        Meteor.userId() ? this.next() : this.render('login');

    }, { 'except': [ '/invitation/:_id', '/script-invitation', '/admin', '/signIn', '/signUp',
    '/RecoverPassword', '/verify-email:token','/reset-password/:token','adminUser','adminLogin'
    ] }); 

    Router.onBeforeAction(function () {
       if(Session.get('invite')) {
        Router.go('/script-invitation');
    } else if(getLoginScript()) {
        Router.go('/script-login')
    }

    return this.next();
}, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id', '/invite',
'/RecoverPassword', '/verify-email:token','/signUp','adminLogin','adminUser'

] });

    route = new ReactiveVar("quiz");

    Router.route('/script-login', function () {

        this.layout('ApplicationLayout');


        if(! Meteor.user()) {
            this.render('loading')
            return;
        }

        var self = this;
        var phase = getLoginScript();

        console.log(phase);

            // Move these functionalities to the rendered function
            switch(getLoginScript()) {
                case 'init': {
                    var condition = true;

                    // TODO : Need more robust condition here

                    if(Meteor.user() && Meteor.user().services && Meteor.user().services.linkedin != undefined
                       || Session.get('loginLinkedin')  )
                    {
                        condition = true;
                    }
                    else if(Meteor.settings.public.verifyEmail)
                    {
                        condition = Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].verified;
                    }
                    else{
                        condition = true;
                    }

                    console.log(condition);

                    if(condition)
                    {
                        this.render('scriptLoginInit');
                        break;
                    }
                    else
                    {
                        this.render('emailVerified');
                        break;
                    }

                }
                case 'quiz': {
                    this.wait(Meteor.subscribe('feedback'));
                    if(!this.ready()){
                        this.render('loading');
                        return;
                    }
                    var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false });
                    if(!myfeedback) {
                        this.render('scriptLoginFail');
                        return;
                    }
                    this.render('quiz', {
                        'data': {
                            'feedback': myfeedback,
                            'person': Meteor.user().profile
                        }
                    })
                    break;
                }
                case 'profile' : {
                    this.wait(Meteor.subscribe('feedback'),     Accounts.loginServicesConfigured());
                    if(!this.ready()) {
                        this.render("loading");
                        return
                    }
                    var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: true});
                    if(!myfeedback) {
                        this.render('scriptLoginFail');
                        return;
                    }
                    if(this.ready()){
                        var myfeedback = Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId() }).fetch();
                        var data = { profile : Meteor.user().profile };
                        data.myscore = calculateScore(joinFeedbacks(myfeedback));

                        var otherFeedback = Feedback.find({ 'from': { '$ne': Meteor.userId() }, 'to' : Meteor.userId() }).fetch();
                        if(otherFeedback) {
                            var qset = joinFeedbacks(otherFeedback);

                            var validAnswers = _.filter(qset, function(question) { return question.answer });
                            data.otherscore = calculateScore(qset);

                            data.enoughData = (validAnswers.length > 30);
                        }
                        _.extend(data, calculateTopWeak(Feedback.find({to: Meteor.userId()}).fetch()))
                        this.render('profile', { data : data});
                    }

                    break;
                }

                case 'after-quiz' :
                this.render('scriptLoginAfterQuiz')
                break;
                case 'invite' :
                this.render('invite');
                break;
                case 'finish':
                this.render('scriptLoginFinish');
                break
            }
        }, { 'name': '/script-login' });



    Router.route('/verify-email/:token', function () {

     this.layout('ScriptLayout');

     this.render('verifyEmail');

 }, { 'name': '/verify-email:token' });

    Router.route('/admin', function () {
        this.layout('ApplicationLayout');
        return this.render('admin');
    }, { 'name': '/admin' });




    Router.route('/signIn', function () {

        this.layout('commonLayout');

        return this.render('signIn');
    } ,{
        name: 'signIn' });

    Router.route('/', function () {
        return this.render('signIn');
    });

    // TODO : Improve with passing as query insteas params

    Router.route('/signUp/:invited?/:email?', function () {
        var id = this.params._id;
        var query = this.params.query;

        //console.log(id,query);
        return this.render('signUp');
    } ,{
        name: '/signUp' });

    Router.route('/feed', function () {
        route.set('feed')
        this.layout('ApplicationLayout');
        return this.render('feed');
    }, { 'name': '/feed' });

    Router.route('/invite', function () {
      this.layout('ApplicationLayout');
      switch(getLoginScript()) {
          case 'finish':
          this.render('scriptLoginFinish');
          return;
          break
      }

      route.set('invite');
      this.wait(Meteor.subscribe('feedback'),Meteor.subscribe('connections'));
      if (!this.ready()){
        this.render('loading');
        return;
    }


    var users = Feedback.find({ $or : [ {to: Meteor.userId()}, {from: Meteor.userId()} ]} ).map(function(fb){ return fb.from });
    users = _.without(users, Meteor.userId());

    this.render('invite', {data : { users : Connections.find({}) }});
}, { 'name': '/invite' });

/* this.render('invite', {data : { users : Meteor.users.find({_id : {$in : users}}, {profile : 1}) }})
}, { 'name': '/invite' }); */

    Router.route('/RecoverPassword', function () {

        return this.render('RecoverPassword');
    }, { 'name': '/RecoverPassword' });


    Router.map(function(){

        this.route('resetpassword', {
            path: '/reset-password/:token',
            template: 'RecoverPassword',
            data: function(){

                return {
                    isresetPassword: true
                };
            }
        });

        this.route('adminUser', {
            layout : 'ApplicationLayout',
            path: '/adminUser',
            template: 'adminUser',
            data: function(){
            }
        });

        this.route('adminLogin', {
            layout : 'ApplicationLayout',
            path: '/adminLogin',
            template: 'adminLogin',
            data: function(){
            } 
        });

    });

    // Custom logic for adminUserPage

    
    Router.onBeforeAction(checkAdminLoggedIn, {
      only: ['adminUser']
      // or except: ['routeOne', 'routeTwo']
  });

    function checkAdminLoggedIn(context,redirect){
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        this.render('/adminLogin');
    } else {
        this.next();
    }
}

