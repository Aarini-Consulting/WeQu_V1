SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));

Template.htmlEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupInviteHtmlEmail', Assets.getText('group-invite-email.html'));
SSR.compileTemplate('GroupInviteHtmlEmail-en', Assets.getText('group-invite-email.html'));
SSR.compileTemplate('GroupInviteHtmlEmail-nl', Assets.getText('group-invite-email-nl.html'));
SSR.compileTemplate('GroupInviteHtmlEmail-fr', Assets.getText('group-invite-email-fr.html'));
SSR.compileTemplate('GroupInviteHtmlEmail-de', Assets.getText('group-invite-email-de.html'));

Template.GroupInviteHtmlEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupCloseCycleEmail', Assets.getText('group-close-cycle-email.html'));

Template.GroupCloseCycleEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupCloseCycleCancelEmail', Assets.getText('group-close-cycle-cancel-email.html'));

Template.GroupCloseCycleCancelEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupCreatorCloseCycleEmail', Assets.getText('group-creator-close-cycle-email.html'));

Template.GroupCreatorCloseCycleEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupCreatorCloseCycleCancelEmail', Assets.getText('group-creator-close-cycle-cancel-email.html'));

Template.GroupCreatorCloseCycleCancelEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('EmailChangeVerification', Assets.getText('email-change-verification.html'));

Template.EmailChangeVerification.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GamemasterConfirmationEmail', Assets.getText('gamemaster-confirmation-email.html'));

Template.GamemasterConfirmationEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupCreationEmail', Assets.getText('group-creation-email.html'));

Template.GroupCreationEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupSurveyCompletedEmail', Assets.getText('group-survey-completed-email.html'));

Template.GroupSurveyCompletedEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupSurveyCompletedEmailCmc', Assets.getText('group-survey-completed-email-cmc.html'));

Template.GroupSurveyCompletedEmailCmc.helpers({
    //Add any helper methods to enable default data in template
});




