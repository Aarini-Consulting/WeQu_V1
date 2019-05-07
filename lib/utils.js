

_.templateSettings = {
  interpolate: /\[(.+?)\]/g
};


if(Meteor.isClient){
    click = function click() {
        var rest = Array.prototype.slice.call(arguments, 0);
        return _.map(rest, function (selector) {
            return 'click ' + selector + ', touch ' + selector + ', touchend ' + selector;
        }).join(', ');
    };


}

joinFeedbacks = function joinFeedbacks(feedbacks) {
    return _.reduce(feedbacks, function(memo, feedback) { return memo.concat(feedback.qset); }, [] );
}

calculateTopWeak = function calculateTopWeak(feedbacks) {
    var score = calculateScore(joinFeedbacks(feedbacks), true);
    var skillsWithoutCategories = _.difference(_.keys(score.scored), _.keys(framework));
    var keys = _.chain(skillsWithoutCategories).filter(function(key){
        return score.total[key] > 0
    }).sortBy(function(key) {
        return score.scored[key]/score.total[key];
    }).value();
    var result = {};
    result.top3 = _.map(_.last(keys, 3), function(skill){ 
      return { skill: skill, text: i18n[skill], 
               description: skill2description[skill] , color: skill2color[skill]
             } });

    result.weak3 = _.map(_.first(keys, 3), function(skill){
      return { skill: skill, text: i18n[skill] ,
               description: skill2description[skill] , color: skill2color[skill]
             } });
    return result;
}

calculateScore = function calculateScore(questions, nodivide){
    var data = _.chain(questions)
    .filter(function(question) { return question.answer; })
    .reduce(function (data, question) {
        if(!question.answer) {
            return data;
        }
        _.each(question.answers, function(answer){
            if(answer.skill){
                data.total[skill2category[answer.skill]]++;
                data.total[answer.skill]++;
            }
        });
        var answer = _.find(question.answers, function (answer) {
            return question.answer == answer._id;
        });
        if(answer && answer.skill){
            data.scored[skill2category[answer.skill]]++;
            data.scored[answer.skill]++;
        }
        return data;
    }, { scored: _.clone(initialScore), total: _.clone(initialScore) }).value();

    if(nodivide)
        return data;

    return _.reduce(_.keys(initialScore), function(memo, key){
        if(data.total[key] > 0){
            memo[key] = data.scored[key] / data.total[key];
        }
        return memo;
    }, _.clone(initialScore));
}


validateEmail = function validateEmail(email) {
    var re = /\S+@\S+/i
    return re.test(email);
}

getUserName = function getUserName(profile){
    if(!profile) return "unknown";

    if(profile.firstName || profile.lastName) {
        return (profile.firstName || "") + " " + (profile.lastName || "")
    }

    if(profile.name) {
        return profile.name;
    }

    if(profile.emailAddress) return profile.emailAddress;

    return "unknown";
}

getGender = function getGender(profile){
    if(!profile) return "unknown";

    if(profile.gender) {
        return profile.gender;
    }

    if(profile.inviteGender) {
        return profile.inviteGender;
    }

    return "unknown";
}

framework = {
   'VIRTUE':[
   'generous',
   'honest',
   'respectful',
   'patient'
   ],

   'SELF_MANAGEMENT':[
   'reflective',
   'resilient',
   'doer',
   'accepts_criticism',
   ],

   'COMMUNICATION':[
   'listening',
   'humour',
   'story_telling',
   'outgoing',
   ],

   'TEAMWORK':[
   'assertive',
   'connector',
   'manage_conflict',
   'reliable',
   ],

   'LEADERSHIP':[
   'mentoring',
   'motivator',
   'visionary',
   'empathetic',
   ],

   'PROBLEM_SOLVING':[
   'conceptual_thinking',
   'creative',
   'inquisitive',
   'analytical'
   ]
};

skill2category =  {
    'generous' : 'VIRTUE',
    'honest' : 'VIRTUE',
    'respectful' : 'VIRTUE',
    'patient' : 'VIRTUE',

    'reflective' : 'SELF_MANAGEMENT',
    'resilient' : 'SELF_MANAGEMENT',
    'doer' : 'SELF_MANAGEMENT',
    'accepts_criticism' : 'SELF_MANAGEMENT',

    'listening' : 'COMMUNICATION',
    'humour' : 'COMMUNICATION',
    'story_telling' : 'COMMUNICATION',
    'outgoing' : 'COMMUNICATION',

    'assertive' : 'TEAMWORK',
    'connector' : 'TEAMWORK',
    'manage_conflict' : 'TEAMWORK',
    'reliable' : 'TEAMWORK',

    'mentoring' : 'LEADERSHIP',
    'motivator' : 'LEADERSHIP',
    'visionary' : 'LEADERSHIP',
    'empathetic' : 'LEADERSHIP',

    'conceptual_thinking' : 'PROBLEM_SOLVING',
    'creative' : 'PROBLEM_SOLVING',
    'inquisitive' : 'PROBLEM_SOLVING',
    'analytical'  : 'PROBLEM_SOLVING'
};

initialScore =  {
  'VIRTUE': 0,
  'generous': 0,
  'honest': 0,
  'respectful': 0,
  'patient': 0,
  'SELF_MANAGEMENT': 0,
  'reflective': 0,
  'resilient': 0,
  'doer': 0,
  'accepts_criticism': 0,
  'COMMUNICATION': 0,
  'listening': 0,
  'humour': 0,
  'story_telling': 0,
  'outgoing': 0,
  'TEAMWORK': 0,
  'assertive': 0,
  'connector': 0,
  'manage_conflict': 0,
  'reliable': 0,
  'LEADERSHIP': 0,
  'mentoring': 0,
  'motivator': 0,
  'visionary': 0,
  'empathetic': 0,
  'PROBLEM_SOLVING': 0,
  'conceptual_thinking': 0,
  'creative': 0,
  'inquisitive': 0,
  'analytical' : 0
};

i18n =  {
  'VIRTUE' : 'VIRTUE',
  'generous' : 'Generous',
  'honest' : 'Honest',
  'respectful' : 'Respectful',
  'patient' : 'Patient',
  'SELF_MANAGEMENT' : 'SELF MANAGEMENT',
  'reflective' : 'Reflective',
  'resilient' : 'Resilient',
  'doer' : 'Doer',
  'accepts_criticism' : 'Accepts Criticism',
  'COMMUNICATION' : 'COMMUNICATION',
  'listening' : 'Listening',
  'humour' : 'Humorous',
  'story_telling' : 'Story Telling',
  'outgoing' : 'Outgoing',
  'TEAMWORK' : 'TEAMWORK',
  'assertive' : 'Assertive',
  'connector' : 'Connector',
  'manage_conflict' : 'Manage Conflict',
  'reliable' : 'Reliable',
  'LEADERSHIP' : 'LEADERSHIP',
  'mentoring' : 'Mentoring',
  'motivator' : 'Motivator',
  'visionary' : 'Visionary',
  'empathetic' : 'Empathetic',
  'PROBLEM_SOLVING' : 'PROBLEM SOLVING',
  'conceptual_thinking' : 'Conceptual Thinker',
  'creative' : 'Creative',
  'inquisitive' : 'Inquisitive',
  'analytical'  : 'Analytical'
};

skill2description = {
  'generous' : 'You offer to help whenever you can',
  'honest': 'You do not pretend to like things to impress people',
  'patient' : 'You know the value of postponing gratification',
  'respectful' : 'When you say, “it is good to see you”, you mean it',
  'reflective' : 'Every situation is an opportunity for you to learn',
  'resilient' : 'You use failure as reason to try again',
  'doer' : ' You finish what you start',
  'accepts_criticism' : '  You seek out criticism and ways to improve',
  'listening' : ' You listen to others without judging what they say',
  'humour' : ' Your sense of humor brings people together',
  'story_telling' : ' People often repeat your stories to others',
  'outgoing' : ' You turn small conversations into friendships',
  'assertive' : ' You put yourself in a position to lead',
  'connector' : ' You promote good ideas in a discussion',
  'manage_conflict' : ' When a team is divided, you will help bridge the two sides',
  'reliable' : ' You always do by what you say or promise',
  'mentoring' : ' You love to see other people succeed', 
  'motivator' : ' Your energy is contagious',
  'visionary' : ' You can see how today relates to tomorrow',
  'empathetic' : ' You take a real interest in the lives of other people',
  'conceptual_thinking' : ' You see well how things work together',
  'creative' : ' You often surprise other people with good, new ideas',
  'inquisitive' : ' You want to get to the bottom of things',
  'analytical' : ' You tend to be deliberate and precise'
};

skill2color = {
  'generous' : '#D0376F',
  'honest' : '#D0376F',
  'patient' : '#D0376F',
  'respectful' : '#D0376F',
  'reflective' : '#9964B8',
  'resilient' : '#A561AF',
  'doer' : '#A561AF',
  'accepts_criticism' : '#A561AF',
  'listening' : '#00AADB',
  'humour' : '#00AADB',
  'story_telling' : '#00AADB',
  'outgoing' : '#00AADB',
  'assertive' : '#F46021',
  'connector' : '#F46021',
  'manage_conflict' : '#F46021',
  'reliable' : '#F46021',
  'mentoring' : '#1C307E',
  'motivator' : '#1C307E',
  'visionary' : '#1C307E',
  'empathetic' : '#1C307E',
  'conceptual_thinking' : '#3FA033',
  'creative' : '#3FA033',
  'inquisitive' : '#3FA033',
  'analytical' :'#3FA033'
}


quizzy =  _.template(" What is more true about [name]?");

genInitialQuestionSet = function genYouQuestionSet(name, answers, num){

    var profile = Meteor.user().profile;
    var name2 = getUserName(profile);

    var questionText = quizzy({ 'name': name });
    if(name.toLowerCase() == "you") {
        questionText = "What is more true about you?";
    }
    var answers = _.chain(answers).shuffle().reduce(function(memo, answer){
        //1 question for every skill
        if(_.some(memo, function(answer1) { return answer1.skill == answer.skill })){
            return memo;
        }
        var a = _.clone(answer);
        a.text = (_.template(a.text)({name: name}));
        return memo.concat(a);
    }, []).value();

    answers = _.last(answers, Math.min(num * 2, Math.floor(answers.length * 0.5) * 2) );
    var result = [];
    for(var i = 0; i < answers.length; i+=2) {
        result.push({ text : questionText, answers : [ answers[i], answers[i+1] ]});
    }

    // Adding new Question to identify gender

    // Here skill with genderId is udes to identify the question
    if(name.toLowerCase() == "you") {
      if(!profile.gender){
    result.push({ text : "Are you Male or Female ?", answers : [ {_id: "Male" , skill: "genderId", text: "Male"},
                                                       {_id: "Female" , skill: "genderId", text: "Female"}   ]  });
                                                      }
                                                      }
    return result;

}

genQuizQuestionSet =  function genInviteQuestionSet(profile) {
    var name = getUserName(profile);
    var gender_result = getGender(profile);
    var questionText = quizzy({ 'name': name });
    var qset = qdata.type1he; // TO avoid issue in invited user
    if (gender_result == 'Male'){
       qset = qdata.type1he;
    }else if (gender_result == 'Female') {
       qset = qdata.type1she;
    }

    // console.log(qset);
    var answers = _.chain(qset).shuffle().reduce(function(memo, answer){
        //1 question for every skill
        if(_.some(memo, function(answer1) { return answer1.skill == answer.skill })){
            return memo;
        }
        var a = _.clone(answer);
        a.text = _.template(answer.text)({name: name});
        return memo.concat(a);
    }, []).value();
    answers = _.last(answers, Math.min(24, Math.floor(answers.length * 0.5) * 2) );
    var result = [];
    for(var i = 0; i < answers.length; i+=2) {
        result.push({ text : questionText, answers : [ answers[i], answers[i+1] ]});
    }
    return result;
};
