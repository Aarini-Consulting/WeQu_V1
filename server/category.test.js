import { Meteor } from 'meteor/meteor';
import chai from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';

// import all the methods that will be tested
import './createGroup/createGroup'; 
import './category';
import StubCollections from 'meteor/hwillson:stub-collections';

import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import './emailTemplate';

if (Meteor.isServer) {
    var runs = [
        {it: 'can pick card for 2 user', userCount: 2},
        {it: 'can pick card for 3 user', userCount: 3},
        {it: 'can pick card for 4 user', userCount: 4},
        {it: 'can pick card for 5 user', userCount: 5},
        {it: 'can pick card for 6 user', userCount: 6},
        {it: 'can pick card for 7 user', userCount: 7},
        {it: 'can pick card for 8 user', userCount: 8},
        {it: 'can pick card for 9 user', userCount: 9},
        {it: 'can pick card for 10 user', userCount: 10},
        {it: 'can pick card for 11 user', userCount: 11},
        {it: 'can pick card for 12 user', userCount: 12},
      ];
      
    runs.forEach(function (run) {
        describe('Group',()=>{
            describe('methods', function() {
                let thisContext = null;
                let userId = null;
                let group = null;
                let cardPlacements = null;
        
                this.timeout(0);
                
                beforeEach(function() {
                    resetDatabase();
                    // StubCollections.stub([Group, GroupQuiz, FeedbackRank, CardPlacement]);
    
                    //create user
                    var emailGameMaster = Random.id(8)+'@sharklasers.com';
                    userId = Accounts.createUser(
                        { 
                            firstName: "game",
                            lastName: "master",
                            email:emailGameMaster
                        }
                    );
                    // set user as gamemaster
                    Meteor.users.update(
                        {
                            "emails.address":emailGameMaster},
                            {
                                '$set':{
									"profile.locale":"en-US"
								}
                            }
                    );

                    //add role
                    Roles.addUsersToRoles(userId, "GameMaster" );
                    
                    //provide context for "this.userId" call in the method
                    thisContext = {userId};
                    
                    //set random groupname
                    var groupName = "testGroup"+Random.id(8);

                    //generate randomized disposable email based on userCount specified at the beginning of this file
                    var emailArray = [];

                    for(i=0;i<run.userCount;i++){
                        emailArray.push(Random.id(8)+'@sharklasers.com');
                    }
        
                    var inviteDatas = [];
        
                    emailArray.forEach(email => {
                        inviteDatas.push({"email":email});
                    });
                    
                    const createGroup = Meteor.server.method_handlers['createGroup'];
        
                    createGroup.apply(thisContext, [groupName, "nl", inviteDatas, emailArray,"long"]);
    
                    var groupCheck = Group.findOne({"groupName": groupName});
    
                    if(groupCheck){
    
                        var userIds = groupCheck.userIds;
    
                        Group.update(
                            {"_id":groupCheck._id},
                            {'$set':{
                                isActive:true , 
                                isPlaceCardActive: true, 
                                userIdsSurveyed:userIds,
                                userIdsSelfRankCompleted:userIds
                            }
                        });
    
                        group = Group.findOne({"_id": groupCheck._id});
    
                        //set mock card placement data
    
                        //mock combined self rank data
                        var mockCombinedRank = [
                            {
                                "patient":6,
                                "resilient":3.1,
                                "outgoing":2.2,
                                "manage_conflict":2.362,
                                "empathetic":4.32,
                                "analytical":2.97,
                                "generous":1,
                                "doer":4.525,
                                "humour":4.4,
                                "reliable":2.25,
                                "mentoring":3.50,
                                "creative":3.125,
                                "respectful":6,
                                "reflective":4.25,
                                "listening":2.125,
                                "connector":3.75,
                                "motivator":3.4,
                                "inquisitive":2.3,
                                "honest":6,
                                "accepts_criticism":5.15,
                                "story_telling":1.85,
                                "assertive":3,
                                "visionary":2,
                                "conceptual_thinking":1.7
                            },
                            {
                                "honest": 6,
                                "doer": 4.8500000000000005,
                                "humour": 3.2,
                                "manage_conflict": 2.1,
                                "empathetic": 2.3000000000000003,
                                "creative": 2.9749999999999996,
                                "patient": 6,
                                "reflective": 5,
                                "listening": 2.6,
                                "reliable": 3.7500000000000004,
                                "mentoring": 2.5999999999999996,
                                "inquisitive": 2.525,
                                "respectful": 6,
                                "resilient": 5,
                                "outgoing": 3.5000000000000004,
                                "assertive": 4.050000000000001,
                                "motivator": 2,
                                "analytical": 2.95,
                                "generous": 6,
                                "accepts_criticism": 4.0531250000000005,
                                "story_telling": 3.3125000000000004,
                                "connector": 3.5249999999999995,
                                "visionary": 2.5,
                                "conceptual_thinking": 1.7500000000000002
                            },
                            {
                                "patient": 6,
                                "reflective": 5.5,
                                "listening": 3.95,
                                "connector": 2.7,
                                "mentoring": 2,
                                "analytical": 2.675,
                                "honest": 6,
                                "accepts_criticism": 4.8500000000000005,
                                "outgoing": 4.300000000000001,
                                "manage_conflict": 2.4750000000000005,
                                "visionary": 1.7000000000000002,
                                "inquisitive": 3.2750000000000004,
                                "generous": 6,
                                "doer": 5.45,
                                "story_telling": 2.5,
                                "reliable": 3.15,
                                "motivator": 3.025,
                                "creative": 2.525,
                                "respectful": 6,
                                "resilient": 3.325,
                                "humour": 3.2,
                                "assertive": 4.237500000000001,
                                "empathetic": 2.3000000000000003,
                                "conceptual_thinking": 2.3499999999999996
                            },
                            {
                                "respectful": 6,
                                "resilient": 4.80625,
                                "listening": 3.2,
                                "manage_conflict": 3.4499999999999997,
                                "mentoring": 3.5875000000000004,
                                "creative": 1.9250000000000003,
                                "generous": 6,
                                "doer": 4.9,
                                "humour": 2.65,
                                "reliable": 2.0250000000000004,
                                "motivator": 1.6,
                                "analytical": 2.65,
                                "honest": 6,
                                "accepts_criticism": 4.3,
                                "outgoing": 3.3499999999999996,
                                "connector": 2.8499999999999996,
                                "empathetic": 2,
                                "conceptual_thinking": 2.9499999999999997,
                                "patient": 6,
                                "reflective": 4.9750000000000005,
                                "story_telling": 2.6,
                                "assertive": 2.25,
                                "visionary": 2,
                                "inquisitive": 2.95
                            },
                            {
                                "respectful": 6,
                                "doer": 4.8500000000000005,
                                "listening": 2.4875000000000003,
                                "assertive": 2.25,
                                "visionary": 2.9,
                                "analytical": 2.075,
                                "patient": 6,
                                "resilient": 5.106250000000001,
                                "humour": 4,
                                "manage_conflict": 3.7500000000000004,
                                "mentoring": 1.9000000000000001,
                                "creative": 3.25,
                                "generous": 6,
                                "reflective": 4.9750000000000005,
                                "story_telling": 2.2,
                                "reliable": 2.6624999999999996,
                                "empathetic": 2.45,
                                "conceptual_thinking": 1.7000000000000002,
                                "honest": 6,
                                "accepts_criticism": 5,
                                "outgoing": 4.1,
                                "connector": 2.8499999999999996,
                                "motivator": 2.2,
                                "inquisitive": 2.3
                            },
                            {
                                "respectful": 4.5,
                                "accepts_criticism": 5,
                                "story_telling": 3.2,
                                "manage_conflict": 2.775,
                                "mentoring": 2.6,
                                "conceptual_thinking": 2.0500000000000003,
                                "honest": 6,
                                "doer": 5.425000000000001,
                                "humour": 1.75,
                                "assertive": 3.75,
                                "empathetic": 3.7,
                                "inquisitive": 2.0875000000000004,
                                "patient": 6,
                                "resilient": 5.45,
                                "listening": 1.9000000000000001,
                                "reliable": 2.7,
                                "motivator": 1.6,
                                "analytical": 1.4500000000000002,
                                "generous": 6,
                                "reflective": 5.4125000000000005,
                                "outgoing": 3.6499999999999995,
                                "connector": 3.5250000000000004,
                                "visionary": 2.8,
                                "creative": 1
							},
							{
								"generous":6,
								"resilient": 4.8500000000000005,
								"story_telling": 1.5500000000000003,
								"connector": 3.3,
								"visionary": 2.8000000000000003,
								"conceptual_thinking": 2.35,
								"respectful":6,
								"accepts_criticism": 2.85625,
								"listening": 3.4,
								"reliable": 2.85,
								"motivator": 3.8000000000000003,
								"analytical": 1.4500000000000002,
								"honest":6,
								"reflective":5,
								"humour": 1.9000000000000001,
								"assertive": 3.15,
								"mentoring": 1.6,
								"creative": 4.1875,
								"patient":6,
								"doer": 4.825000000000001,
								"outgoing": 3.2,
								"manage_conflict": 2.4750000000000005,
								"empathetic":2,
								"inquisitive": 2.9499999999999997
							},
							{
								"patient":6,
								"accepts_criticism": 5.125,
								"outgoing": 2.6,
								"connector": 3.5250000000000004,
								"motivator": 1.6,
								"creative":1,
								"respectful": 4.5,
								"reflective": 4.85,
								"story_telling": 4.25,
								"assertive": 2.1,
								"visionary": 2.8,
								"analytical": 2.95,
								"honest":6,
								"resilient": 3.6500000000000004,
								"listening": 3.65,
								"manage_conflict":3,
								"empathetic": 2.65,
								"conceptual_thinking": 4.1937500000000005,
								"generous":6,
								"doer": 4.8500000000000005,
								"humour": 3.7,
								"reliable": 3.1875,
								"mentoring": 2.05,
								"inquisitive": 2.525
							},
							{
								"honest":6,
								"accepts_criticism": 4.25,
								"outgoing": 4.25,
								"reliable": 2.1,
								"empathetic": 3.8000000000000003,
								"creative": 2.35,
								"generous":6,
								"doer": 4.9,
								"story_telling": 2.8000000000000003,
								"assertive": 3.2249999999999996,
								"visionary": 2.2,
								"conceptual_thinking": 2.0500000000000003,
								"respectful":6,
								"resilient": 3.7,
								"humour": 2.1500000000000004,
								"manage_conflict": 2.025,
								"motivator": 2.9000000000000004,
								"analytical": 2.9749999999999996,
								"patient":6,
								"reflective": 2.8562500000000006,
								"listening": 3.0999999999999996,
								"connector": 2.7,
								"mentoring": 3.5000000000000004,
								"inquisitive": 1.1
							},
							{
								"generous":6,
								"doer": 4.8500000000000005,
								"humour": 2.875,
								"assertive": 3.01875,
								"visionary": 2.35,
								"creative": 1.6765625000000002,
								"respectful":6,
								"reflective": 4.8500000000000005,
								"story_telling": 4.25,
								"connector": 2.25,
								"empathetic": 2.2,
								"inquisitive":1,
								"honest":6,
								"resilient": 4.8500000000000005,
								"outgoing": 3.8,
								"manage_conflict":3,
								"motivator": 1.4000000000000001,
								"analytical":1,
								"patient":6,
								"accepts_criticism": 4.8500000000000005,
								"listening": 2.6,
								"reliable":3,
								"mentoring":2,
								"conceptual_thinking": 2.2250000000000005
							},
							{
								"honest":6,
								"doer": 4.8500000000000005,
								"story_telling": 2.5,
								"assertive":3,
								"empathetic": 2.95,
								"inquisitive": 2.3,
								"respectful": 5.7,
								"resilient": 5.140625,
								"listening": 3.05,
								"manage_conflict": 2.9250000000000003,
								"motivator": 1.7750000000000004,
								"creative":1,
								"generous":6,
								"accepts_criticism": 4.9,
								"outgoing": 2.1500000000000004,
								"reliable": 3.9000000000000004,
								"visionary": 1.6,
								"analytical": 3.2749999999999995,
								"patient":6,
								"reflective":5,
								"humour": 2.6,
								"connector": 2.83125,
								"mentoring": 2.3500000000000005,
								"conceptual_thinking": 2.675
							},
							{
								"generous":6,
								"reflective": 4.9,
								"humour": 2.8750000000000004,
								"connector": 3.7125000000000004,
								"visionary":2,
								"analytical": 1.7000000000000002,
								"honest":6,
								"accepts_criticism": 4.825000000000001,
								"listening":4,
								"manage_conflict": 4.125,
								"motivator": 1.9625000000000001,
								"creative": 2.3125000000000004,
								"respectful": 4.8,
								"doer": 5.63125,
								"outgoing": 2.6,
								"reliable": 2.5500000000000003,
								"mentoring":2,
								"inquisitive": 2.0125,
								"patient":6,
								"resilient": 4.9,
								"story_telling": 3.0999999999999996,
								"assertive":3,
								"empathetic": 2.2,
								"conceptual_thinking": 2.3499999999999996
							}
                        ];
    
                        var mockRankOrder = [
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value": 6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value": 6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value": 6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value": 6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value": 5.15
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value": 4.525
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value": 4.4
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value": 4.325000000000001
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value": 4.25
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value": 3.7500000000000004
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value": 3.5000000000000004
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value": 3.4000000000000004
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value": 3.15
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value": 3.125
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value": 3.1
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value": 2.9749999999999996
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value": 2.5999999999999996
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value": 2.3625000000000003
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value": 2.3
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value": 2.25
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value": 2.2
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value": 2.125
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value": 1.85
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value": 1.1500000000000001
                                }
                            ],
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value": 6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value":6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value":5
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value":5
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value":4.8500000000000005
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value":4.0531250000000005
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value":4.050000000000001
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value":3.7500000000000004
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value":3.5249999999999995
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value":3.5000000000000004
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value":3.3125000000000004
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value":3.2
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value":2.9749999999999996
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value":2.95
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value":2.6
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value":2.5999999999999996
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value":2.525
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value":2.5
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value":2.3000000000000003
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value":2.1
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value":2
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value":1.7500000000000002
                                }
                            ],
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value":6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value":5.5
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value":5.45
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value":4.8500000000000005
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value":4.300000000000001
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value":4.237500000000001
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value":3.95
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value":3.325
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value":3.2750000000000004
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value":3.2
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value":3.15
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value":3.025
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value":2.7
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value":2.675
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value":2.525
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value":2.5
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value":2.4750000000000005
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value":2.3499999999999996
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value":2.3000000000000003
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value":2
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value":1.7000000000000002
                                }
                            ],
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value":6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value":4.9750000000000005
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value":4.9
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value":4.80625
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value":4.3
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value":3.5875000000000004
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value":3.4499999999999997
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value":3.3499999999999996
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value":3.2
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value":2.95
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value":2.9499999999999997
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value":2.8499999999999996
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value":2.65
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value":2.65
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value":2.6
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value":2.25
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value":2.0250000000000004
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value":2
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value":2
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value":1.9250000000000003
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value":1.6
                                }
                            ],
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value":6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value":5.106250000000001
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value":5
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value":4.9750000000000005
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value":4.8500000000000005
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value":4.1
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value":4
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value":3.7500000000000004
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value":3.25
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value":2.9
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value":2.8499999999999996
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value":2.6624999999999996
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value":2.4875000000000003
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value":2.45
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value":2.3
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value":2.25
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value":2.2
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value":2.2
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value":2.075
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value":1.9000000000000001
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value":1.7000000000000002
                                }
                            ],
                            [
                                {
                                    "category": "virtue",
                                    "subCategory": "patient",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "generous",
                                    "value":6
                                }, {
                                    "category": "virtue",
                                    "subCategory": "honest",
                                    "value":6
                                }, {
                                    "category": "self_management",
                                    "subCategory": "resilient",
                                    "value":5.45
                                }, {
                                    "category": "self_management",
                                    "subCategory": "doer",
                                    "value":5.425000000000001
                                }, {
                                    "category": "self_management",
                                    "subCategory": "reflective",
                                    "value":5.4125000000000005
                                }, {
                                    "category": "self_management",
                                    "subCategory": "accepts_criticism",
                                    "value":5
                                }, {
                                    "category": "virtue",
                                    "subCategory": "respectful",
                                    "value":4.5
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "assertive",
                                    "value":3.75
                                }, {
                                    "category": "leadership",
                                    "subCategory": "empathetic",
                                    "value":3.7
                                }, {
                                    "category": "communication",
                                    "subCategory": "outgoing",
                                    "value":3.6499999999999995
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "connector",
                                    "value":3.5250000000000004
                                }, {
                                    "category": "communication",
                                    "subCategory": "story_telling",
                                    "value":3.2
                                }, {
                                    "category": "leadership",
                                    "subCategory": "visionary",
                                    "value":2.8
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "manage_conflict",
                                    "value":2.775
                                }, {
                                    "category": "teamwork",
                                    "subCategory": "reliable",
                                    "value":2.7
                                }, {
                                    "category": "leadership",
                                    "subCategory": "mentoring",
                                    "value":2.6
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "inquisitive",
                                    "value":2.0875000000000004
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "conceptual_thinking",
                                    "value":2.0500000000000003
                                }, {
                                    "category": "communication",
                                    "subCategory": "listening",
                                    "value":1.9000000000000001
                                }, {
                                    "category": "communication",
                                    "subCategory": "humour",
                                    "value":1.75
                                }, {
                                    "category": "leadership",
                                    "subCategory": "motivator",
                                    "value":1.6
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "analytical",
                                    "value":1.4500000000000002
                                }, {
                                    "category": "problem_solving",
                                    "subCategory": "creative",
                                    "value":1
                                }
							],
							[{
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "respectful",
								"value":6
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value":5
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 4.8500000000000005
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 4.825000000000001
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value": 4.1875
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 3.8000000000000003
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value": 3.4
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 3.3
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 3.2
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value": 3.15
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value": 2.9499999999999997
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 2.85625
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value": 2.85
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value": 2.8000000000000003
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value": 2.4750000000000005
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 2.35
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value":2
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 1.9000000000000001
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value": 1.6
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 1.5500000000000003
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value": 1.4500000000000002
							}],
							[{
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 5.125
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 4.8500000000000005
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value": 4.85
							}, {
								"category": "virtue",
								"subCategory": "respectful",
								"value": 4.5
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 4.25
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 4.1937500000000005
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 3.7
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 3.6500000000000004
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value": 3.65
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 3.5250000000000004
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value": 3.1875
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value":3
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value": 2.95
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value": 2.8
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value": 2.65
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 2.6
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value": 2.525
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value": 2.1
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value": 2.05
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 1.6
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value":1
							}],
							[{
								"category": "virtue",
								"subCategory": "respectful",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 4.9
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 4.25
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 4.25
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value": 3.8000000000000003
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 3.7
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value": 3.5000000000000004
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value": 3.2249999999999996
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value": 3.0999999999999996
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value": 2.9749999999999996
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 2.9000000000000004
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value": 2.8562500000000006
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 2.8000000000000003
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 2.7
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value": 2.35
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value": 2.2
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 2.1500000000000004
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value": 2.1
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 2.0500000000000003
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value": 2.025
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value": 1.1
							}],
							[{
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "respectful",
								"value":6
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value": 4.8500000000000005
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 4.8500000000000005
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 4.8500000000000005
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 4.8500000000000005
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 4.25
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 3.8
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value": 3.01875
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value":3
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value":3
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 2.875
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value": 2.6
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value": 2.35
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 2.25
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 2.2250000000000005
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value": 2.2
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value":2
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value": 1.6765625000000002
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 1.4000000000000001
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value":1
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value":1
							}],
							[{
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "respectful",
								"value": 5.7
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 5.140625
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value":5
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 4.9
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 4.8500000000000005
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value": 3.9000000000000004
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value": 3.2749999999999995
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value": 3.05
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value":3
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value": 2.95
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value": 2.9250000000000003
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 2.83125
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 2.675
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 2.6
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 2.5
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value": 2.3500000000000005
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value": 2.3
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 2.1500000000000004
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 1.7750000000000004
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value": 1.6
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value":1
							}],
							[{
								"category": "virtue",
								"subCategory": "generous",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "patient",
								"value":6
							}, {
								"category": "virtue",
								"subCategory": "honest",
								"value":6
							}, {
								"category": "self_management",
								"subCategory": "doer",
								"value": 5.63125
							}, {
								"category": "self_management",
								"subCategory": "resilient",
								"value": 4.9
							}, {
								"category": "self_management",
								"subCategory": "reflective",
								"value": 4.9
							}, {
								"category": "self_management",
								"subCategory": "accepts_criticism",
								"value": 4.825000000000001
							}, {
								"category": "virtue",
								"subCategory": "respectful",
								"value": 4.8
							}, {
								"category": "teamwork",
								"subCategory": "manage_conflict",
								"value": 4.125
							}, {
								"category": "communication",
								"subCategory": "listening",
								"value":4
							}, {
								"category": "teamwork",
								"subCategory": "connector",
								"value": 3.7125000000000004
							}, {
								"category": "communication",
								"subCategory": "story_telling",
								"value": 3.0999999999999996
							}, {
								"category": "teamwork",
								"subCategory": "assertive",
								"value":3
							}, {
								"category": "communication",
								"subCategory": "humour",
								"value": 2.8750000000000004
							}, {
								"category": "communication",
								"subCategory": "outgoing",
								"value": 2.6
							}, {
								"category": "teamwork",
								"subCategory": "reliable",
								"value": 2.5500000000000003
							}, {
								"category": "problem_solving",
								"subCategory": "conceptual_thinking",
								"value": 2.3499999999999996
							}, {
								"category": "problem_solving",
								"subCategory": "creative",
								"value": 2.3125000000000004
							}, {
								"category": "leadership",
								"subCategory": "empathetic",
								"value": 2.2
							}, {
								"category": "problem_solving",
								"subCategory": "inquisitive",
								"value": 2.0125
							}, {
								"category": "leadership",
								"subCategory": "visionary",
								"value":2
							}, {
								"category": "leadership",
								"subCategory": "mentoring",
								"value":2
							}, {
								"category": "leadership",
								"subCategory": "motivator",
								"value": 1.9625000000000001
							}, {
								"category": "problem_solving",
								"subCategory": "analytical",
								"value": 1.7000000000000002
							}]
                        ];
    
                        userIds.forEach((id, index)=>{
                            var combinedRank = mockCombinedRank[index];
                            var rankOrder = mockRankOrder[index];
    
                            var selectRandomIndex = Math.floor(Math.random()*mockCombinedRank.length)
    
                            if(!combinedRank && mockCombinedRank && mockCombinedRank.length > 0){
                                combinedRank = mockCombinedRank[selectRandomIndex];
                            }
    
                            if(!rankOrder){
                                rankOrder = mockRankOrder[selectRandomIndex];
                            }
    
                            CardPlacement.insert({
                                groupId: groupCheck._id,  
                                userId:id,
                                combinedRank:combinedRank,
                                rankOrder:rankOrder
                              });
                        });
    
                        const pickCard = Meteor.server.method_handlers['pick.card'];
        
                        pickCard.apply(thisContext, [groupCheck._id]);
    
                        cardPlacements = CardPlacement.find({groupId: groupCheck._id}).fetch();
                    }
                });
        
                afterEach(function() {
                    // Group.remove();
                    // FeedbackRank.remove();
                    // CardPlacement.remove();
    
                });
        
                it(run.it, function() {
                    chai.assert.exists(group);
                    chai.assert.exists(cardPlacements);
                    chai.assert.strictEqual(cardPlacements.length, group.userIds.length);
                    cardPlacements.forEach((cp)=>{
                        chai.assert.exists(cp.cardPicked);
                        chai.assert.strictEqual(cp.cardPicked.length, 7);
    
                        var cardNumberHolder = {};
                        var topCategoryHolder = {};
                        var lowCategoryHolder = {};
    
                        var duplicateCardNumberFound = false;
                        var duplicateTopCategory = false;
                        var duplicateLowCategory = false;
    
                        cp.cardPicked.forEach(function (item, index) {
    
                            if(!cardNumberHolder[item.cardId]){
                                cardNumberHolder[item.cardId] = 0;
                            }else{
                                cardNumberHolder[item.cardId] += 1;
                            }
    
                            if(index < 4){
                                if(!topCategoryHolder[item.category]){
                                    topCategoryHolder[item.category] = 0;
                                }else{
                                    topCategoryHolder[item.category] += 1;
                                }
    
                            }else{
                                if(!lowCategoryHolder[item.category]){
                                    lowCategoryHolder[item.category] = 0;
                                }else{
                                    lowCategoryHolder[item.category] += 1;
                                }
                            }
                                
                        });
                    
                        for (var prop in cardNumberHolder) {
                            if(cardNumberHolder[prop] > 1) {
                                duplicateCardNumberFound = true;
                            }
                        }
    
                        for (var prop in topCategoryHolder) {
                            if(topCategoryHolder[prop] > 1) {
                                duplicateTopCategory = true;
                            }
                        }
    
                        for (var prop in lowCategoryHolder) {
                            if(lowCategoryHolder[prop] > 1) {
                                duplicateLowCategory = true;
                            }
                        }
    
                        chai.assert.strictEqual(duplicateCardNumberFound,false);
                        chai.assert.strictEqual(duplicateTopCategory,false);
                        chai.assert.strictEqual(duplicateLowCategory,false);
                    });
                });
            });
        });
    });
}