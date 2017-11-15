import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import Loading from './Loading';
import ScriptLoginInit from './ScriptLoginInit'; 
import EmailVerified from './EmailVerified'; 
import Quiz from './Quiz'; 
import Profile from './Profile'; 
import ScriptLoginAfterQuiz from './ScriptLoginAfterQuiz'; 
import Invite from './Invite';
import ScriptLoginFinish from './ScriptLoginFinish';  

class Login extends React.Component {
  render() {
      if(this.props.dataReady){
        var showMenu = this.props.feedback.done;

        switch(getLoginScript()) {
            case 'init': {
                var condition = true;

                // TODO : Need more robust condition here

                if(this.props.user && this.props.user.services && this.props.user.services.linkedin != undefined)
                {
                    condition = true;
                }
                else if(Meteor.settings.public.verifyEmail)
                {
                    condition = this.props.user && this.props.user.emails && this.props.user.emails[0].verified;
                }

                console.log(condition);

                if(condition)
                {
                    return (<ScriptLoginInit/>);
                }
                else
                {
                    return (<EmailVerified/>);
                    
                }
                break;

            }
            case 'quiz': {
    
                // var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: false });
                // if(!myfeedback) {
                //     //TODO : Making this temporarily .. to avoid scriptFail
                //     import '/imports/ui/pages/script/scriptLoginInit/scriptLoginInit.js';
                //     this.render('scriptLoginInit');
                //     //this.render('scriptLoginFail');
                //     return;
                // }
                // import '/imports/ui/pages/quiz/quiz.js';
                // this.render('quiz', {
                //     'data': {
                //         'feedback': myfeedback,
                //         'person': Meteor.user().profile
                //     }
                // })
                return (<Quiz/>);
                break;
            }
            case 'profile' : {
                // this.wait(Meteor.subscribe('feedback'),     Accounts.loginServicesConfigured());
                // if(!this.ready()) {
                //     this.render("loading");
                //     return
                // }
                // var myfeedback = Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId(), done: true});
                // if(!myfeedback) {  
                //     this.render('scriptLoginFail');
                //     return;
                // }
                    var data = { profile : this.props.user.profile };
                    data.myscore = calculateScore(joinFeedbacks(this.props.feedback));

                    var otherFeedback = this.props.feedbacks
                    if(otherFeedback) {
                        var qset = joinFeedbacks(otherFeedback);

                        var validAnswers = _.filter(qset, function(question) { return question.answer });
                        data.otherscore = calculateScore(qset);

                        data.enoughData = (validAnswers.length > 30);
                    }
                    _.extend(data, calculateTopWeak(Feedback.find({to: Meteor.userId()}).fetch()));

                    // import '/imports/ui/pages/profile/profile.js';
                    // this.render('profile', { data : data});
                    return (<Profile data={data}/>)

                break;
            }

            case 'after-quiz' :
            //this.render('scriptLoginAfterQuiz');
            var userId = Meteor.userId();
            // <Redirect to={"/scriptLoginAfterQuiz/" + userId}/>
            return (<ScriptLoginAfterQuiz/>)
            break;
            case 'invite' :
            return (<Invite data={data}/>)
            break;
            case 'finish':
            return (<ScriptLoginFinish/>)
            break
        }
      }else{
          return(
            <Loading/>
          );
      }
  }
}

export default createContainer((props) => {
    Meteor.subscribe("feedback");
    var dataReady;
    var handle = Meteor.subscribe('feedback', props.secret, {
        onError: function (error) {
                console.log(error);
            }
        });
    dataReady = handle.ready();
     
    return {
        user: Meteor.user(),
        feedbacks: Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId()}).fetch(),
        feedback: Feedback.findOne({ 'from': Meteor.userId(), 'to' : Meteor.userId()}),
        dataReady:dataReady,
        handler:handle,
    };
  }, Login);