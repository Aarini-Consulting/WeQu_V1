// server
Meteor.publish('usersInfo', function (search) {
    if (this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});

        if (Roles.userIsInRole(user, ["admin"])) {
            let searchRegex = new RegExp(search, 'i');

            if(search){
                console.log("search admin:",search);
                let u = Meteor.users.find({
                    "profile.userType": {$ne: null},
                    $or: [
                        {"profile.firstName": searchRegex},
                        {"profile.lastName": searchRegex},
                        {"emails.address": searchRegex},
                    ]
                });
                console.log('count:', u.count());
                return u;
            }

            return Meteor.users.find({"profile.userType": {$ne: null}});
        } else {
            //{fields: {"profile.uniqueId": 1, "profile.totalTransactions": 1}}
            return Meteor.users.find({"profile.userType": {$ne: null}}, {fields: {}});
        }
    }

    return this.ready();
});

