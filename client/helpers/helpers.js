
    Template.registerHelper('inScript', function () {
        return getLoginScript();
    });


    Template.registerHelper("username", getUserName);
    Template.registerHelper("case", function(){
        var pair =_.chain(this).pairs().first().value();

        var key = pair[0];
        var value = pair[1];

        var pdata = Template.parentData(1);
        _.extend(this, pdata);

        if(pdata && pdata[key] && pdata[key] == value) {
            return Template._case_default;
        }
        var rvar = window[key];
        if(!rvar){
            rvar = window[key] = new ReactiveVar("default");
        }
        if(rvar instanceof ReactiveVar && rvar.get() == value) {
            return Template._case_default;
        }
        return null;
    });

    _.chain(this).pairs().filter(function(pair){
        return (pair[1] instanceof ReactiveVar);
    }).each(function(pair){
        Template.registerHelper(pair[0], function(){
            return pair[1].get();
        });
    });


    Template.registerHelper('formatDate', function (val) {
    if (val) {
        return moment(val).format('ll');
    }
    return null;
    });

    Template.registerHelper('formatDateTime', function (val) {
        if (val) {
            return moment(val).format('MM/DD h:mm a');
        }
        return null;
    });


    // Create profile picture collection to store the profile picture

    Template.registerHelper('profilePicture', function () {
    let currentUser = Meteor.users.findOne({_id: Meteor.userId()});
    let picture, data;
    if (currentUser) {
        picture = currentUser.profile.profilePicture;
        data = ProfilePicture.findOne({_id: picture});
        return data && data.url();
    }
    return false;
    });

    // Used in menubar
    Template.registerHelper('route', function (status) {
        return status == route.get();
    });