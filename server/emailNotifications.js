Meteor.methods({
    sendEmail: function (to, subject, body) {

        this.unblock();
        
        Email.send({
            from: "postmaster@wequ.co",
            to: to,
            subject: subject,
            html: body
        });


    }

});