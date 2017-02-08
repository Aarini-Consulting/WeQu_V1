
inviteStatus = new ReactiveVar('default');
Template.invite.events({

 "submit form" : function (event, template) {
    event.preventDefault();
    inviteStatus.set('sending');
    var email = template.$('input[name=email]').val();
    var name = template.$('input[name=name]').val();
    var gender = template.find('#gender').value;

    Meteor.call('invite', name, email, gender, function (err, userId) {
        if(err){
            console.log("error", err);
            inviteStatus.set('error');
            return;
        } 

        template.$('input[name=name]').val('')
        template.$('input[name=email]').val('');
        inviteStatus.set('sent');

        setInterval(function () {
            return inviteStatus.set('default');
        }, 3000);
        if(getLoginScript()){
            quizPerson.set(userId);
            return setLoginScript('finish');
        }
        console.log(err, userId);
    });
}  
})

Template.invite.rendered = function(){
    $('.menuBar').show();

    $('.gender').on('click', function(){
        if(!$(this).hasClass('selected'))
        {
            $('.gender').toggleClass('selected');
        }
    });


}
