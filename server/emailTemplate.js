SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));

Template.htmlEmail.helpers({
    //Add any helper methods to enable default data in template
});

SSR.compileTemplate('GroupInviteHtmlEmail', Assets.getText('group-invite-email.html'));

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



