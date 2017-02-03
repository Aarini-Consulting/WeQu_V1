//All the routes are configured here 
if (Meteor.isClient) {

Router.route('/script-login', function () {
        this.layout('ScriptLayout');

        if(! Meteor.user()) {
            this.render('loading')
            return;
        }

        var self = this;
        var phase = getLoginScript();

        console.log(phase);

        switch(getLoginScript()) {
            case 'init': {
                this.render('scriptLoginInit')
                break;
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


}