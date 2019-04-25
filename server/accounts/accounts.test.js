import { Meteor } from 'meteor/meteor';
import chai from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import './accounts.js'; // import all the methods that will be tested

if (Meteor.isServer) {
    describe('methods', () => {
        let thisContext = null;

        beforeEach(() => {
        resetDatabase();
        });

        afterEach(() => {
        Meteor.users.remove();
        });

        it('can insert user', function() {
        var data =  {
            firstName: "firstName" , 
            lastName: "lastName", 
            registerEmail:Random.id(8)+'@sharklasers.com', 
            registerPassword:'1234', 
            consentSubs:false}

        const createUser = Meteor.server.method_handlers['createAccount'];

        createUser.apply(thisContext, [data]);
        const getUser = Meteor.users.findOne({"emails.address" : data.registerEmail});
        chai.assert.strictEqual(getUser.emails[0].address, data.registerEmail);
        });
    });
}