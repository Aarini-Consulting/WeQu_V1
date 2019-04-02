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
    
                Roles.addUsersToRoles(userId, "GameMaster" );
    
                thisContext = {userId};

                var groupName = "testGroup"+Random.id(8);
                var emailArray = [
                    Random.id(8)+'@sharklasers.com', 
                    Random.id(8)+'@sharklasers.com', 
                    Random.id(8)+'@sharklasers.com',
                    Random.id(8)+'@sharklasers.com',
                    Random.id(8)+'@sharklasers.com',
                    Random.id(8)+'@sharklasers.com',
                    Random.id(8)+'@sharklasers.com',
                    Random.id(8)+'@sharklasers.com'
                ];
    
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
                            respectful:6,
                            accepts_criticism:5,
                            story_telling:4,
                            manage_conflict:3,
                            empathetic:2,
                            analytical:1,
                            honest:6,
                            resilient:5,
                            humour:4,
                            connector:3,
                            motivator:2,
                            conceptual_thinking:1,
                            generous:6,
                            doer:5,
                            outgoing:4,
                            assertive:3,
                            mentoring:2,
                            inquisitive:1,
                            patient:6,
                            reflective:5,
                            listening:1,
                            reliable:1,
                            visionary:1,
                            creative:1
                        }
                    ];

                    var mockRankOrder = [
                        [
                            {
                                category:"virtue",
                                subCategory:"generous",
                                value:6
                            },
                            {
                                category:"virtue",
                                subCategory:"respectful",
                                value:6
                            },
                            {
                                category:"virtue",
                                subCategory:"honest",
                                value:6
                            },
                            {
                                category:"self_management",
                                subCategory:"doer",
                                value:5
                            },
                            {
                                category:"self_management",
                                subCategory:"reflective",
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
                                category:"teamwork",
                                subCategory:"connector",
                                value:3
                            },
                            {
                                category:"teamwork",
                                subCategory:"manage_conflict",
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
                                subCategory:"mentoring",
                                value:2
                            },
                            {
                                category:"leadership",
                                subCategory:"motivator",
                                value:2
                            },
                            {
                                category:"leadership",
                                subCategory:"visionary",
                                value:2
                            },
                            {
                                category:"leadership",
                                subCategory:"empathetic",
                                value:2
                            },
                            {
                                category:"problem_solving",
                                subCategory:"inquisitive",
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
                            },
                            {
                                category:"problem_solving",
                                subCategory:"creative",
                                value:1
                            }
                        ]
                    ];

                    userIds.forEach((id, index)=>{
                        var combinedRank = mockCombinedRank[index];
                        var rankOrder = mockRankOrder[index];

                        if(!combinedRank && mockCombinedRank[0]){
                            combinedRank = mockCombinedRank[0];
                        }

                        if(!rankOrder && mockRankOrder[0]){
                            rankOrder = mockRankOrder[0];
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
    
            it('can pick card', function() {
                chai.assert.exists(group);
                chai.assert.exists(cardPlacements);
                chai.assert.strictEqual(cardPlacements.length, group.userIds.length);
                chai.assert.exists(cardPlacements[0].cardPicked);
            });
        });
    });
}