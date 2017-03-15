Meteor.methods({
    sendEmail: function (to, subject, body) {

    	check([to, subject], [String]);

        this.unblock();
        
        Email.send({
            from: 'WeQu <info@wequ.co>',
            to: to,
            subject: subject,
            html: body
        });


    }

});