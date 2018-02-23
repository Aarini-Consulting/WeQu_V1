Template.adminAccountCreation.events({
  'submit form': function(event){

   event.preventDefault();

   let registerEmail = event.target.registerEmail.value;
   let registerPassword =  event.target.registerPassword.value;
   let firstName =   event.target.firstName.value;
   let lastName =  event.target.lastName.value;
   let userType = "Test User";

   let data = {registerEmail:registerEmail, registerPassword:registerPassword, firstName: firstName, lastName:lastName, userType:userType}
   let verify = true;  
   Meteor.call('createAccount', data ,verify, function (err, result) {
   if(err){} 
   if(result){
   	Router.go('/adminUser');
   }
   });

   }




});