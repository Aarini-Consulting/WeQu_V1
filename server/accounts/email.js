
//Customizing the verification template

Accounts.emailTemplates.siteName = "WeQ";
/*Accounts.emailTemplates.from     = "WeQu <info@wequ.co>";*/
Accounts.emailTemplates.from = "WeQ <postmaster@weq.io>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[WeQ] Verify Your Email Address";
  },
  text( user, url ) {
    var emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "contact@weq.io",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return "[WeQ] Reset Your Password";
  },
  text( user, url ) {
    var emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "contact@weq.io",
        emailBody      = `To reset your password for (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};