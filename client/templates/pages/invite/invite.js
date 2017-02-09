
    inviteStatus = new ReactiveVar('default');

    Template.invite.created = function () {
        this.gender = new ReactiveVar('Male'); // Setting default to male , since in UI default value is male
    }

    Template.invite.helpers({

    })



    Template.invite.events({

       "submit form" : function (event, template) {
        event.preventDefault();
        inviteStatus.set('sending');
        var email = template.$('input[name=email]').val();
        var name = template.$('input[name=name]').val();

        var gender = template.gender.get(); //template.find('#gender').value;

        console.log(gender);

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

    Template.invite.events({
        "click #male" : function(event,template){
            event.preventDefault();
            template.gender.set('Male');
        },

        "click #female" : function(event,template){
            event.preventDefault();
            template.gender.set('Female');
        }

    });

