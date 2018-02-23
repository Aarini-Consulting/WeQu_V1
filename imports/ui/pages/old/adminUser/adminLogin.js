 
 
Template.adminLogin.rendered = function(){
  if(Meteor.userId()){
    Router.go('/adminUser');
  }
}

 Template.adminLogin.events({
    'submit #signIn': function(event) {
      event.preventDefault();

      if(event.target.loginEmail.value != "admin@wequ.co"){
        $('#error').text("Check admin email id");
        return ;
      }

      Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value, function (err) {
        if(err){
          $('#error').text(err);
        }
        else
        {
          Router.go('/adminUser');
        }
      });
    }

});