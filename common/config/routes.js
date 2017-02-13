    //All the routes are configured here 

    Router.configure({
        layoutTemplate: 'ScriptLayout',
        notFoundTemplate: 'notFoundLayout'
    });


    Router.configure(
        //TODO : Verify all the routes , and configure application layouts
       // {  layoutTemplate: 'ApplicationLayout' },
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
                   /* var data = calculateTopWeak([myfeedback]);
                    data.myscore = calculateScore(myfeedback.qset);
                    data.profile = Meteor.user().profile;

                    this.render('profile', { 'data': data });
                    */

                    this.render('profile');

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

    Router.route('/signUp', function () {
        return this.render('signUp');
    } ,{
        name: 'signUp' });

    Router.route('/feed', function () {
        route.set('feed')
        this.layout('ApplicationLayout');
        return this.render('feed');
    }, { 'name': '/feed' });

    Router.route('/invite', function () {
        route.set('invite');
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'));
        if (!this.ready()){
            this.render('loading');
            return;
        }

        var users = Feedback.find({ $or : [ {to: Meteor.userId()}, {from: Meteor.userId()} ]} ).map(function(fb){ return fb.from });
        users = _.without(users, Meteor.userId());

        this.render('invite', {data : { users : Meteor.users.find({_id : {$in : users}}, {profile : 1}) }})
    }, { 'name': '/invite' });

    // Profile routing starts ..
    
    Router.route('/profile', function () {
        route.set("profile");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'),     Accounts.loginServicesConfigured());
        if(this.ready()){
            var myfeedback = Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId() }).fetch();
            var data = { profile : Meteor.user().profile };
            data.myscore = calculateScore(joinFeedbacks(myfeedback));

            var otherFeedback = Feedback.find({ 'from': { '$ne': Meteor.userId() }, 'to' : Meteor.userId() }).fetch();
            var qset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(qset, function(question) { return question.answer });
            data.otherscore = calculateScore(qset);
            data.enoughData = (validAnswers.length > 30);

            _.extend(data, calculateTopWeak(Feedback.find({to: Meteor.userId()}).fetch()))
            this.render('profile', { data : data});  
        } else {
            this.render('loading');
        }
    }, { 'name': '/profile' });

    Router.route('/profile/skills', function () {
        route.set("skills");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'));
        if(this.ready()){
            var data = { profile : Meteor.user().profile }
            var otherFeedback = Feedback.find({ 'to' : Meteor.userId() }).fetch();
            var joinedQset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(joinedQset, function(question) { return question.answer });
            var otherscore = calculateScore(joinedQset, true);
            data.enoughData = (validAnswers.length > 15);

            data.categories = _.map(_.keys(framework), function(category) {
                return {
                    name : i18n[category],
                    category : category,
                    skills : _.map(framework[category], function(skill){
                        var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                        if(otherscore.total[skill] > 0) {
                            data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                        }
                        return data;
                    })
                }
            })
            this.render('profileSkills', { data : data });

        } else {
            this.render('loading');
        }
    }, { 'name': '/profile/skills' });

    Router.route('/profile/written-feedback', function () {
        route.set("feedback");
        this.layout('ApplicationLayout');
        return this.render('profileWrittenFeedback', {
            'data': function () { return Meteor.user(); }
        });
    }, { 'name': '/profile/written-feedback' });


    // Profile routing ends ..


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