    //All the routes are configured here

    Router.configure({
        layoutTemplate: 'ScriptLayout',
        notFoundTemplate: 'notFoundLayout'
    });
 

    Router.configure(
        {  except: ['signIn','signUp','quiz']  }
        );

    Router.onBeforeAction(function () {
        Meteor.userId() ? this.next() : this.render('login');

    }, { 'except': [ '/invitation/:_id', '/script-invitation', '/admin', '/signIn/a', '/signUp',
    '/RecoverPassword', '/verify-email:token','/reset-password/:token','adminUser','adminLogin','terms',
    'privacyPolicy','/profile/publicUser/:userId','adminAccountCreation'
    ] }); 

    Router.onBeforeAction(function () {
       if(Session.get('invite')) {
        Router.go('/script-invitation');
       } else if(getLoginScript()) {
        Router.go('/script-login')
       } 
       return this.next();
    }, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id', '/invite',
                 '/RecoverPassword', '/verify-email:token','/signUp','adminLogin','adminUser','/feed','/settings',
                 'userAfterQuiz/:_id', '/scriptLoginAfterQuiz/:userId?','terms','privacyPolicy',
                 '/quiz/:_id?','/quiz','/profile/publicUser/:userId','adminAccountCreation'
                ] });

    route = new ReactiveVar("quiz");

    Router.route('/script-login', function () {

        let feedbackDone = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: true })
        if(feedbackDone)
        {
          this.layout('ApplicationLayout');
        }
        else{
         this.layout('ScriptLayout');  //no menubar
        }


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
                        //TODO : Making this temporarily .. to avoid scriptFail

                        this.render('scriptLoginInit');
                        //this.render('scriptLoginFail');
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
                //this.render('scriptLoginAfterQuiz');
                var userId = Meteor.userId();
                Router.go(`/scriptLoginAfterQuiz/${userId}`);
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




    Router.route('/signIn/:invited?/:email?/:invitationId?', function () {
        route.set("signIn");
        this.wait(Accounts.loginServicesConfigured(), Meteor.subscribe('group')   );
        if(this.ready()){
           return this.render('signIn');
        }
        else{
            this.render('loading');
        }
        Session.setPersistent('invitation-id', this.params.invitationId);
               
    } ,{ name: 'signIn' });

    Router.route('/', function () {
        return this.render('signIn');
    }, { name: 'home'});

    Router.route('/signUp/:invited?/:email?/:invitationId?', function () {
        var id = this.params.invitationId;
        var query = this.params.query;
        Session.setPersistent('invitation-id', id);
        
        //this.wait(Accounts.loginServicesConfigured());
        
        if(this.ready()){
          return this.render('signUp');
        }
        else{
            this.render('loading');
        }
    } , { name: '/signUp' });

    Router.route('/feed', function () {
        route.set('feed')
        this.layout('ApplicationLayout');
        return this.render('feed');
    }, { 'name': '/feed'});


    Router.route('/invite', function () {
      //this.layout('ScriptLayout');
      switch(getLoginScript()) {
          case 'finish':
          this.render('scriptLoginFinish');
          return;
          break
      }

      route.set('invite');
      this.wait(Meteor.subscribe('connections'), Meteor.subscribe("feedback","allData"),
                Accounts.loginServicesConfigured());
      if (!this.ready()){
        this.render('loading');
        return;
    }
    return this.render('invite');   
    }, { 'name': '/invite' }); 


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

         this.route('adminAccountCreation', {
            layout : 'ApplicationLayout',
            path: '/adminAccountCreation',
            template: 'adminAccountCreation',
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

        this.route('/userAfterQuiz', {
            layout : 'ApplicationLayout',
            path: '/userAfterQuiz/:userId?',
            template: 'userAfterQuiz',
            data: function(){
            } 
        });


    });

    // Custom logic for adminUserPage

    
    Router.onBeforeAction(checkAdminLoggedIn, {
      only: ['adminUser','adminAccountCreation']
      // or except: ['routeOne', 'routeTwo']
  });

    function checkAdminLoggedIn(context,redirect){
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        this.render('/adminLogin');
    } else {
        this.next();
    }
}

