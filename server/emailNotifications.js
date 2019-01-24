Meteor.methods({
    getGroupInviteHtmlTemplate(emailData, language){
        if(language){
            return SSR.render(`GroupInviteHtmlEmail-${language}`, emailData);
        }else{
            return SSR.render('GroupInviteHtmlEmail', emailData);
        }
    },
    sendEmail: function (to, subject, body) {

    	check([to, subject], [String]);

        this.unblock();
        
        Email.send({
            from: 'WeQ <postmaster@weq.io>',
            to: to,
            subject: subject,
            html: body
        });
    }
});