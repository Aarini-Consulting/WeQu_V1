Template.verifyEmail.events({  
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