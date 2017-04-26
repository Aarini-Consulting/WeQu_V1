
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


    Template.registerHelper('route', function (status) {
        return status == route.get();
    });


    Template.registerHelper('picture', function (userId) {
        //TODO : Applicable only for linked in login
        let data = Meteor.users.findOne({_id: userId});
        let pictureUrl = data && data.profile && data.profile.pictureUrl;
        return pictureUrl;
    });


    Template.registerHelper('formatDate', function (val) {
        if (val) {
            let day = moment().dayOfYear() - moment(val).dayOfYear(); // gives number of days 
            // Writing custom logic for calculating days , weeks 
            if(day > 7){
                let week =  parseInt(day / 7) ;

                if(week > 4 )
                {
                    let month =  parseInt(week / 4) ;
                    return `${month}m`
                }

                return `${week}w`;
            }
            if(day == 0){
                day++;    
            }
            return `${day}d`;


        }
        return null;
    });

    Template.registerHelper('equals', function (a, b) {
        return a === b;
    });

    // Used in menubar
    Template.registerHelper('route', function (status) {
        return status == route.get();
    });

    Template.registerHelper('GameMaster', function (status) {
        let emailAddress =  Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address;
        if(emailAddress == "wequ-test1@springbuck.tech"){
            return true;
        }
        return false;
    });