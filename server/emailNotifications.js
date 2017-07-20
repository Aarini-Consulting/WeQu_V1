Meteor.methods({
    sendEmail: function (to, subject, body) {

    	check([to, subject], [String]);

        this.unblock();
        
        Email.send({
            from: 'WeQu <postmaster@wequ.co>',
            to: to,
            subject: subject,
            html: body
        });


    }

});