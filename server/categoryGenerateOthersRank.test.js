import { Meteor } from 'meteor/meteor';
import chai from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';

// import all the methods that will be tested
import './createGroup/createGroup'; 
import './category';
import {generateOthersRank} from './category';
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
            let feedbackRanks = null;

            var emailArray = [
                Random.id(8)+'@sharklasers.com', 
                Random.id(8)+'@sharklasers.com', 
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com',
                Random.id(8)+'@sharklasers.com'
            ];

    
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
                
    
                var inviteDatas = [];
    
                emailArray.forEach(email => {
                    inviteDatas.push({"email":email});
                });

                const createGroup = Meteor.server.method_handlers['createGroup'];
    
                createGroup.apply(thisContext, [groupName, "nl", inviteDatas, emailArray]);

                const checkGroup = Group.findOne({"groupName": groupName});

                if(checkGroup){
                    checkGroup.userIds.forEach((userId)=>{
                        generateOthersRank(userId,checkGroup._id);
                    });
                    
                    feedbackRanks = FeedbackRank.find(
                        {
                            groupId:checkGroup._id
                        }
                    ).fetch();
                }
            });
    
            afterEach(function() {
                // Group.remove();
                // FeedbackRank.remove();
                // CardPlacement.remove();

            });
    
            it('can create others feedbackrank', function() {
                chai.assert.exists(feedbackRanks);
                chai.assert.strictEqual(feedbackRanks.length, emailArray.length * emailArray.length);
                feedbackRanks.forEach((feedbackRank)=>{
                    if(feedbackRank.from != feedbackRank.to){
                        var rankItems = feedbackRank.rankItems[0];

                        var objectHolder = {};

                        var duplicateFound = false;

                        rankItems.forEach(function (item) {
                            if(!objectHolder[item])
                                objectHolder[item] = 0;
                              objectHolder[item] += 1;
                        });
                  
                        for (var prop in objectHolder) {
                            if(objectHolder[prop] > 1) {
                                duplicateFound = true;
                            }
                        }

                        chai.assert.strictEqual(duplicateFound,false);
                  
                    }
                })
            });
        });
    });
}