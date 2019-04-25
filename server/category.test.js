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
        
                    createGroup.apply(thisContext, [groupName, "nl", inviteDatas, emailArray]);
    
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
                                honest:6,
                                reflective:5,
                                story_telling:4,
                                manage_conflict:3.9,
                                mentoring:2,
                                conceptual_thinking:1,
                                respectful:6,
                                resilient:5,
                                outgoing:4,
                                assertive:3,
                                visionary:2,
                                creative:1,
                                patient:6,
                                doer:5,
                                listening:4,
                                connector:3,
                                empathetic:1.6,
                                inquisitive:1,
                                generous:6,
                                accepts_criticism:5,
                                humour:3.8,
                                reliable:3,
                                motivator:2,
                                analytical:1.7
                            },
                            {
                                respectful:6,
                                accepts_criticism:5,
                                outgoing:4,
                                assertive:3.9,
                                mentoring:2,
                                creative:1,
                                honest:6,
                                doer:5,
                                humour:4,
                                reliable:3,
                                motivator:2,
                                inquisitive:2.9,
                                patient:6,
                                reflective:5,
                                story_telling:4,
                                manage_conflict:3,
                                empathetic:1.6,
                                analytical:1,
                                generous:6,
                                resilient:5,
                                listening:2.6,
                                connector:3,
                                visionary:2,
                                conceptual_thinking:1
                            },
                            {
                                inquisitive:1.7,
                                generous:6,
                                accepts_criticism:5,
                                outgoing:4,
                                assertive:3,
                                mentoring:2,
                                patient:6,
                                doer:3.1,
                                listening:4,
                                manage_conflict:3,
                                motivator:2,
                                analytical:1,
                                respectful:6,
                                reflective:5,
                                story_telling:5,
                                connector:3,
                                empathetic:2,
                                creative:1,
                                honest:4.8,
                                resilient:5,
                                humour:4,
                                reliable:3,
                                visionary:3.4,
                                conceptual_thinking:1
                            }
                        ];
    
                        var mockRankOrder = [
                            [
                                {
                                    category:"virtue",
                                    subCategory:"patient",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"honest",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"generous",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"respectful",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"doer",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"resilient",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"accepts_criticism",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"reflective",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"listening",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"outgoing",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"story_telling",
                                    value:4
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"manage_conflict",
                                    value:3.9
                                },
                                {
                                    category:"communication",
                                    subCategory:"humour",
                                    value:3.8
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"reliable",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"connector",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"assertive",
                                    value:3
                                },
                                {
                                    category:"leadership",
                                    subCategory:"visionary",
                                    value:2
                                },
                                {
                                    category:"leadership",
                                    subCategory:"motivator",
                                    value:2
                                },
                                {
                                    category:"leadership",
                                    subCategory:"mentoring",
                                    value:2
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"analytical",
                                    value:1.7
                                },
                                {
                                    category:"leadership",
                                    subCategory:"empathetic",
                                    value:1.6
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"inquisitive",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"conceptual_thinking",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"creative",
                                    value:1
                                }
                            ],
                            [
                                {
                                    category:"virtue",
                                    subCategory:"patient",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"respectful",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"generous",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"honest",
                                    value:6
                                },
                                {
                                    category:"self_management",
                                    subCategory:"accepts_criticism",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"doer",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"resilient",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"reflective",
                                    value:5
                                },
                                {
                                    category:"communication",
                                    subCategory:"story_telling",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"outgoing",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"humour",
                                    value:4
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"reliable",
                                    value:3.3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"assertive",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"manage_conflict",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"connector",
                                    value:3
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"inquisitive",
                                    value:2.9
                                },
                                {
                                    category:"communication",
                                    subCategory:"listening",
                                    value:2.6
                                },
                                {
                                    category:"leadership",
                                    subCategory:"motivator",
                                    value:2.2
                                },
                                {
                                    category:"leadership",
                                    subCategory:"mentoring",
                                    value:2
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"analytical",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"creative",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"inquisitive",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"conceptual_thinking",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"creative",
                                    value:1
                                }
                            ],
                            [
                                {
                                    category:"virtue",
                                    subCategory:"respectful",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"patient",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"generous",
                                    value:6
                                },
                                {
                                    category:"virtue",
                                    subCategory:"honest",
                                    value:6
                                },
                                {
                                    category:"self_management",
                                    subCategory:"resilient",
                                    value:5
                                },
                                {
                                    category:"communication",
                                    subCategory:"story_telling",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"reflective",
                                    value:5
                                },
                                {
                                    category:"self_management",
                                    subCategory:"accepts_criticism",
                                    value:5
                                },
                                {
                                    category:"virtue",
                                    subCategory:"honest",
                                    value:4.8
                                },
                                {
                                    category:"communication",
                                    subCategory:"humour",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"outgoing",
                                    value:4
                                },
                                {
                                    category:"communication",
                                    subCategory:"listening",
                                    value:4
                                },
                                {
                                    category:"leadership",
                                    subCategory:"visionary",
                                    value:3.4
                                },
                                {
                                    category:"self_management",
                                    subCategory:"doer",
                                    value:3.1
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"connector",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"reliable",
                                    value:3
                                },
                                {
                                    category:"teamwork",
                                    subCategory:"assertive",
                                    value:3
                                },
                                {
                                    category:"leadership",
                                    subCategory:"motivator",
                                    value:2
                                },
                                {
                                    category:"leadership",
                                    subCategory:"empathetic",
                                    value:2
                                },
                                {
                                    category:"leadership",
                                    subCategory:"mentoring",
                                    value:2
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"inquisitive",
                                    value:1.7
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"creative",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"analytical",
                                    value:1
                                },
                                {
                                    category:"problem_solving",
                                    subCategory:"conceptual_thinking",
                                    value:1
                                }
                            ],
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