

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
    result.top3 = _.map(_.last(keys, 3), function(skill){ return { skill: skill, text: i18n[skill] } });
    result.weak3 = _.map(_.first(keys, 3), function(skill){return { skill: skill, text: i18n[skill] } });
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
        if(answer.skill){
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


framework = {
   'VIRTUE':[
   'generous',
   'honest',
   'respectful',
   'patient'
   ],

   'SELF MANAGEMENT':[
   'reflective', 
   'resilient',
   'doer',
   'accepts criticism',
   ],

   'COMMUNICATION':[
   'listening',
   'humorous', 
   'story telling', 
   'outgoing',
   ],

   'TEAMWORK':[
   'assertive',
   'connector',
   'manage conflict',
   'reliable', 
   ],

   'LEADERSHIP':[
   'mentoring',
   'motivator',
   'visionary',
   'empathetic',
   ],

   'PROBLEM SOLVING':[
   'conceptual thinker',
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

    'reflective' : 'SELF MANAGEMENT',
    'resilient' : 'SELF MANAGEMENT',
    'doer' : 'SELF MANAGEMENT',
    'accepts criticism' : 'SELF MANAGEMENT',

    'listening' : 'COMMUNICATION',
    'humorous' : 'COMMUNICATION',
    'story telling' : 'COMMUNICATION',
    'outgoing' : 'COMMUNICATION',

    'assertive' : 'TEAMWORK',
    'connector' : 'TEAMWORK',
    'manage conflict' : 'TEAMWORK',
    'reliable' : 'TEAMWORK',

    'mentoring' : 'LEADERSHIP',
    'motivator' : 'LEADERSHIP',
    'visionary' : 'LEADERSHIP',
    'empathetic' : 'LEADERSHIP',

    'conceptual thinker' : 'PROBLEM SOLVING',
    'creative' : 'PROBLEM SOLVING',
    'inquisitive' : 'PROBLEM SOLVING',
    'analytical'  : 'PROBLEM SOLVING'
};

initialScore =  {
  'VIRTUE': 0,
  'generous': 0,
  'honest': 0,
  'respectful': 0,
  'patient': 0,
  'SELF MANAGEMENT': 0,
  'reflective': 0,
  'resilient': 0,
  'doer': 0,
  'accepts criticism': 0,
  'COMMUNICATION': 0,
  'listening': 0,
  'humorous': 0,
  'story telling': 0,
  'outgoing': 0,
  'TEAMWORK': 0,
  'assertive': 0,
  'connector': 0,
  'manage conflict': 0,
  'reliable': 0,
  'LEADERSHIP': 0,
  'mentoring': 0,
  'motivator': 0,
  'visionary': 0,
  'empathetic': 0,
  'PROBLEM SOLVING': 0,
  'conceptual thinker': 0,
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
  'SELF MANAGEMENT' : 'SELF MANAGEMENT',
  'reflective' : 'Reflective',
  'resilient' : 'Resilient',
  'doer' : 'Doer',
  'accepts criticism' : 'Accepts Criticism',
  'COMMUNICATION' : 'COMMUNICATION',
  'listening' : 'Listening',
  'humorous' : 'Humorous',
  'story telling' : 'Story Telling',
  'outgoing' : 'Outgoing',
  'TEAMWORK' : 'TEAMWORK',
  'assertive' : 'Assertive',
  'connector' : 'Connector',
  'manage conflict' : 'Manage Conflict',
  'reliable' : 'Reliable',
  'LEADERSHIP' : 'LEADERSHIP',
  'mentoring' : 'Mentoring',
  'motivator' : 'Motivator',
  'visionary' : 'Visionary',
  'empathetic' : 'Empathetic',
  'PROBLEM SOLVING' : 'PROBLEM SOLVING',
  'conceptual thinker' : 'Conceptual Thinker',
  'creative' : 'Creative',
  'inquisitive' : 'Inquisitive',
  'analytical'  : 'Analytical'
};

quizzy =  _.template("What do you like about [name]?");

genInitialQuestionSet = function genYouQuestionSet(name, answers, num){

    var profile = Meteor.user().profile;
    var name2 = getUserName(profile);

    var questionText = quizzy({ 'name': name2 });
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

    result.push({ text : "Are you Male or Female ?", answers : [ {_id: "He" , skill: "genderId", text: "Male"},
                                                       {_id: "She" , skill: "genderId", text: "Female"}   ]  });


    //console.log("answers", answers.length, _.uniq(_.pluck(answers, 'skill')).length)
    return result;

}

genQuizQuestionSet =  function genInviteQuestionSet(name) {
    var questionText = quizzy({ 'name': name });
    var answers = _.chain(qdata.type1others).shuffle().reduce(function(memo, answer){
        //1 question for every skill
        if(_.some(memo, function(answer1) { return answer1.skill == answer.skill })){
            return memo;
        }
        var a = _.clone(answer);
        a.text = _.template(answer.text)({name: name});
        return memo.concat(a);
    }, []).value();
    answers = _.last(answers, Math.min(8, Math.floor(answers.length * 0.5) * 2) );
    var result = [];
    for(var i = 0; i < answers.length; i+=2) {
        result.push({ text : questionText, answers : [ answers[i], answers[i+1] ]});
    }

    var type3questions = _.chain(qdata.type3).shuffle().compact().last(3).map(function(question){
        var q = _.clone(question);
        q.text = _.template(question.text)({name : name})
        _.each(q.answers, function(answer){
            answer.text = _.template(answer.text)({name : name})
        });
        return q;
    }).value();

    return _.shuffle(result.concat(type3questions));
};
