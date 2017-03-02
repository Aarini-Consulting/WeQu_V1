
// Account setup move it into init.js
// To avoid merge conflict writing here .

Meteor.startup(function () {

    dbIndexes();

    if (Meteor.users.find().count() === 0) {
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
                console.log('default user created :', user.email);
            }

        });
    }else{
        console.log('skipping default user creation as the default users already created');
    }

});

let dbIndexes = function(){
    Meteor.users._ensureIndex({"emails[0].address": 1, "profile.firstName": 1, "profile.lastName": 1, "profile.uniqueId": 1, "profile.userType": 1});
}