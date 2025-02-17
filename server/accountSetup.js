
// Account setup move it into init.js
// To avoid merge conflict writing here .

Meteor.startup(function () {
    setupAccounts();
});

let setupAccounts = function(){

  if (Meteor.users.find().count() === 0 || !Meteor.users.findOne({ "emails.address" : 'admin@wequ.co' }) ) {
            var users = Meteor.settings.private.defaultUsers;

            _.each(users, function (user) {
                var id;

                id = Accounts.createUser({
                    email: user.email,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName
                });

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    Roles.addUsersToRoles(id, user.roles);
                    // console.log('default user created :', user.email);
                }

            });
        }else{
            // console.log('skipping default user creation as the default users already created');
        }

}