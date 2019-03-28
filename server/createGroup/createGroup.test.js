import { Meteor } from 'meteor/meteor';
import chai from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import './createGroup'; // import all the methods that will be tested
import StubCollections from 'meteor/hwillson:stub-collections';

import Group from '/collections/group';
import GroupQuiz from '/collections/groupQuiz';
import FeedbackRank from '/collections/feedbackRank';
import CardPlacement from '/collections/cardPlacement';
import '../emailTemplate';


if (Meteor.isServer) {
    describe('Group',()=>{
        describe('methods', function() {
            let thisContext = null;
            let userId = null;
    
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
            });
    
            afterEach(function() {
                resetDatabase();
                // StubCollections.restore();
            });
    
            it('can create group', function() {
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
                const getGroup = Group.findOne({"groupName": groupName});
    
                chai.assert.exists(getGroup);
                // chai.assert.strictEqual(getGroup.groupName, groupName);
                // chai.assert.strictEqual(getGroup.userIds, emailArray.length);
            });
        });
    });
}