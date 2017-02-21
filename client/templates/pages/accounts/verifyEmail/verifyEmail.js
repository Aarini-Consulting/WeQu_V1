        
    // Using Reactive variables to display the status 

    // since jquery way of setting the text is not a good practice

    Template.verifyEmail.created = function () {
        this.info = new ReactiveVar('');
    }

    Template.verifyEmail.helpers({
        info: function () {
            return Template.instance().info.get();
        }
    })

    Template.verifyEmail.rendered = function(){

      let token = Router.current().params.token;
      Accounts.verifyEmail( token, ( error ) =>{
          if ( error ) {
            this.info.set(error.reason);
        } else {
            this.info.set('Email verified! Thanks! success');
            setTimeout(function(){
              Router.go( '/script-login' );
              setLoginScript("quiz");    
            },3000)
            
        } 
    }); 

  }

    // TODO : Remove the below code later  , as it is not really used 

  /* Template.verifyEmail.events({  
      'submit #set-password': function(event, template) {
        event.preventDefault();

        var email = template.find('#email').value;
        var token = Router.current().params.token


        if(isEmail(email))
        {
            Meteor.call('isAccountVerified',{email},function(err,res){
                console.log(err);
                console.log(res);
                if(err){
                    sAlert.error(err);
                }
                else
                {
                    if(res){
                     $('#error').text(`You have already verified your email , Redirecting shortly ..`);

                     setTimeout(function(){
                        Router.go('/signIn');
                    }, 3000)
                 }
                 else
                 { 
                    Meteor.call('validateToken', {email: email, token: token}, function(err, user){
                        if(err){
                           // sAlert.error('There was an error while Validating the token.');
                           $('#error').text('There was an error while Validating the token.');
                       }else{
                        if(user){
                            console.log(user);
                            Accounts.verifyEmail(token, function (err) {
                                if(err){
                                            //sAlert.error(err.reason);
                                            $('#error').text(err.reason);
                                        }
                                        else{
                                            sAlert.success("Thank you for account confirmation.",
                                            {
                                                effect: '',
                                                position: 'top-right',
                                                timeout: '10000',
                                                onRouteClose: false
                                            });
                                            $('#info').text("Thank you for account confirmation.");

                                        }
                                    });

                        }
                        else{
                            $('#error').text('There is no user with verificaton token');
                        }
                    }
                });

                }
            }
        }); 
        } 

        return false;
    }

});

*/