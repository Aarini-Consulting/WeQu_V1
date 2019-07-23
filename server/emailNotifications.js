
export function getGroupInviteHtmlTemplate(emailData, language){
    if(language){
        return SSR.render(`GroupInviteHtmlEmail-${language}`, emailData);
    }else{
        return SSR.render('GroupInviteHtmlEmail', emailData);
    }
}

export function sendEmail(to, subject, body) {

    check([to, subject], [String]);
    
    Email.send({
        from: 'WeQ <contact@weq.io>',
        to: to,
        subject: subject,
        html: body
    });
}