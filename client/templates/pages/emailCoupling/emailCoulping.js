 Template.emailCoupling.events({
 	'submit #signIn': function(event) {
 		event.preventDefault();

 		var setQuizPerson = this.setQuizPerson;
 		let email = event.target.loginEmail.value.toLowerCase();
 		let password = event.target.loginPassword.value;

 		Meteor.loginWithPassword(email,password, function (err) {
 			if(err){
 				$('#error').text(err);
 			}
 			else
 			{
 				if(setQuizPerson){
 					console.log(user);
 					quizPerson.set(user.inviteId);
 				}
 				Router.go('/quiz');
 			}
 		});

 		Modal.hide();

 	},
 	'click .close': function(event) {
 		$('#error').text("login attempt cancelled");
 	}

 });