Meteor.autorun(function () {
  if (Meteor.userId()) {
   
  } else {
    Router.go('/signIn');
  }
});