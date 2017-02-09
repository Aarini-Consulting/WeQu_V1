    //All the routes are configured here 

    Router.configure({
        layoutTemplate: 'ScriptLayout',
        notFoundTemplate: 'notFoundLayout'
    });


    Router.configure(
        {  layoutTemplate: 'ApplicationLayout' },
        {  except: ['signIn']  }
        );

    Router.onBeforeAction(function () {
        Meteor.userId() ? this.next() : this.render('login');
    }, { 'except': [ '/invitation/:_id', '/script-invitation', '/admin', '/signIn', '/signUp', 
                    '/RecoverPassword', '/verify-email:token','/reset-password/:token'
    ] });

    Router.onBeforeAction(function () {
        if(Session.get('invite')) {
            Router.go('/script-invitation');
        } else if(getLoginScript()) {
            Router.go('/script-login')
        }
        return this.next();
    }, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id', '/invite',
                      '/RecoverPassword', '/verify-email:token'

    ] });

    route = new ReactiveVar("quiz");

    Router.route('/script-login', function () {
        this.layout('ScriptLayout');

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
                    this.wait(Meteor.subscribe('feedback'));
                    if(!this.ready()) {
                        this.render("loading");
                        return
                    }
                    var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: true});
                    if(!myfeedback) {
                        this.render('scriptLoginFail');
                        return;
                    }
                    var data = calculateTopWeak([myfeedback]);
                    data.myscore = calculateScore(myfeedback.qset);
                    data.profile = Meteor.user().profile;

                    this.render('profile', { 'data': data });
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
        return this.render('admin');
    }, { 'name': '/admin' });




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

     Router.route('/invite', function () {
        route.set('invite');
        this.wait(Meteor.subscribe('feedback'));
        if (!this.ready()){
            this.render('loading');
            return;
        }

        var users = Feedback.find({ $or : [ {to: Meteor.userId()}, {from: Meteor.userId()} ]} ).map(function(fb){ return fb.from });
        users = _.without(users, Meteor.userId());

        this.render('invite', {data : { users : Meteor.users.find({_id : {$in : users}}, {profile : 1}) }})
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

    });