
//Customizing the verification template

Accounts.emailTemplates.siteName = "WeQu";
/*Accounts.emailTemplates.from     = "WeQu <info@wequ.co>";*/
Accounts.emailTemplates.from = "WeQu <postmaster@wequ.co>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[WeQu] Verify Your Email Address";
  },
  text( user, url ) {
    var emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@wequ.com",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return "[WeQu] Reset Your Password";
  },
  text( user, url ) {
    var emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@wequ.com",
        emailBody      = `To reset your password for (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};