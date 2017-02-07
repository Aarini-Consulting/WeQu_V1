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
    }, { 'except': [ '/invitation/:_id', '/script-invitation', '/admin', '/signIn', '/signUp'] });

    Router.onBeforeAction(function () {
        if(Session.get('invite')) {
            Router.go('/script-invitation');
        } else if(getLoginScript()) {
            Router.go('/script-login')
        }
        return this.next();
    }, { 'except': [ '/script-login', '/admin', '/script-invitation', '/invitation/:_id', '/invite'
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
                    var condition;

                    if(Meteor.user() && Meteor.user().services && Meteor.user().services.linkedin != undefined )
                        condition = true;
                    else
                        condition = Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].verified;
                    
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

       console.log(this.params.token);

       Accounts.verifyEmail( this.params.token, ( error ) =>{
          if ( error ) {
            console.log( error.reason);
        } else {
            alert( 'Email verified! Thanks!', 'success' );

            Router.go( '/script-login' );
            setLoginScript("quiz");


        }
    });

       this.render('verifyEmail', {data : this })

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