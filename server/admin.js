
Meteor.startup(function () { 

    // admin.js
    importQuestions();

})

    importQuestions = function importQuestions() {
        qdata = { type1you : [], type1he : [], type1she : [] };
        var qs = Assets.getText('WeQu Qualites - 1_You.csv');
        var lines = Papa.parse(qs).data;
        var i;
        var skill;
        for (i = 1; i < lines.length; i++) {
            var l =  lines[i];
            skill = l[0].trim()
            if(!skill2category[skill]) {
                console.log("type1you: unknown skill", skill,  l.join(" "));
                continue;
            }
            qdata.type1you.push({_id: String(i), skill: skill, text: l[1]});
        }

        qs = Assets.getText('WeQu Qualites - 2_He.csv');
        lines = Papa.parse(qs).data;
        for (i = 1; i < lines.length; i++) {
            var l =  lines[i];
            skill = l[0].trim()

            if(!skill2category[skill]) {
                console.log("type1he: unknown skill", skill, l.join(" "));
                continue;
            }
            qdata.type1he.push({_id: String(i), skill: skill, text: l[1]});
        }
        qs = Assets.getText('WeQu Qualites - 3_She.csv');
        lines = Papa.parse(qs).data;
        for (i = 1; i < lines.length; i++) {
            var l =  lines[i];
            skill = l[0].trim()

            if(!skill2category[skill]) {
                console.log("type1she: unknown skill", skill, l.join(" "));
                continue;
            }
            qdata.type1she.push({_id: String(i), skill: skill, text: l[1]});
        }
        // lines = Papa.parse(qs).data;
        // var question;
        // for (i = 1; i < lines.length; i++) {
        //     var l =  lines[i];
        //     skill = l[0].trim()
        //
        //     if(skill && !skill2category[skill]) {
        //         console.log("type3: unknown skill", skill, l.join(" "));
        //         continue;
        //     }
        //     if(l[0]) {
        //         qdata.type3.push(question);
        //         question = { text : l[0], answers : [ {_id: String(i), text: l[1], skill: skill} ] };
        //     } else if(question){
        //         question.answers.push({_id: String(i), text: l[1], skill: skill});
        //     }
        // }
        // qdata.type3.push(question);
    };


Meteor.methods({
    import : importQuestions,
    reset : function(){
        if(Meteor.userId()) {
            //Feedback.remove({from : Meteor.userId()});
            Feedback.remove({to : Meteor.userId()});
            Meteor.users.remove({_id : Meteor.userId()});
        }
    },
    loginTestUser : function(){
        var username = "test" + Math.round(Math.random() * 10000000);
        Accounts.createUser({
            username: username,
            email: username + "@email.test",
            password: username,
            profile: { firstName : username, lastName : ""}});
        return username;

    }
})