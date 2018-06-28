import ReactDOMServer from 'react-dom/server';
import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import pdf from 'html-pdf';
import fs from 'fs';

import {ReportPdf} from '/imports/ui/pages/group/ReportPdf';


let module;

const getBase64String = (path) => {
  try {
    const file = fs.readFileSync(path);
    return new Buffer(file).toString('base64');
  } catch (exception) {
    module.reject(exception);
  }
};

const generatePDF = (html, fileName) => {
  try {
    pdf.create(html, {
      format: 'A4',
      orientation: "portrait",
      border: { top: '0', right: '0', bottom: '0', left: '0' },
      base: Meteor.absoluteUrl(),
      type: "pdf",
    }).toFile(`./tmp/${fileName}`, (error, response) => {
      if (error) {
        module.reject(error);
      } else {
        module.resolve({ fileName, base64: getBase64String(response.filename) });
        fs.unlink(response.filename);
      }
    });
  } catch (exception) {
    module.reject(exception);
  }
};

const getComponentAsHTML = (component, props) => {
  try {
    return ReactDOMServer.renderToStaticMarkup(component(props));
  } catch (exception) {
    module.reject(exception);
  }
};

const handler = ({ component, props, fileName }, promise) => {
  module = promise;
  const html = getComponentAsHTML(component, props);
  if (html && fileName) generatePDF(html, fileName);
};

export const generateComponentAsPDF = (options) => {
  return new Promise((resolve, reject) => {
    return handler(options, { resolve, reject });
  });
};


Meteor.methods({
    'download.report.group.pdf':function(groupId){
      let groupCheck = Group.findOne({'_id': groupId});
      
      if(!groupCheck){
          throw (new Meteor.Error("unknown_group")); 
      }

      if(groupCheck && !groupCheck.isFinished){
        throw (new Meteor.Error("group_session_not_done")); 
      }

      var zipName = groupCheck.groupName + "_report.zip";

      var users = Meteor.users.find({$or : [ 
        {"emails.address" : {$in:groupCheck.emails}  }, 
        { "profile.emailAddress" : {$in:groupCheck.emails}}
      ]}).fetch();

      var results = [];
      users.forEach((user) => {
        var cardPlacementCheck = CardPlacement.findOne({'groupId': groupCheck._id,'userId': user._id});
        if(cardPlacementCheck){
          var fileName = groupCheck.groupName + "_" + user.profile.firstName + "_" + user.profile.lastName + "_" + user._id +".pdf";
          var result = Meteor.call('download.report.individual.pdf',fileName, groupCheck._id, user._id);
          results.push(result);
        }
      });

      return {zipName:zipName,results:results};
        
    },
    'download.report.individual.pdf' : function (fileName, groupId, userId) {
      let groupCheck = Group.findOne({'_id': groupId});
      
      if(!groupCheck){
          throw (new Meteor.Error("unknown_group")); 
      }

      if(groupCheck && !groupCheck.isActive){
        throw (new Meteor.Error("group_inactive")); 
      }

      if(groupCheck && !groupCheck.isFinished){
        throw (new Meteor.Error("group_session_not_done")); 
      }

      var creator = Meteor.users.findOne({_id:groupCheck.creatorId});
      if(!creator){
        throw (new Meteor.Error("group_creator_not_found")); 
      }

      var user = Meteor.users.findOne({
        _id:userId,
        $or : [ 
        {"emails.address" : {$in:groupCheck.emails}  }, 
        { "profile.emailAddress" : {$in:groupCheck.emails}}
      ]});

      if(!user){
        throw (new Meteor.Error("user_not_found")); 
      }

      var individualCardPlacement = CardPlacement.findOne({'groupId': groupCheck._id,'userId': user._id});

      var collectiveCardPlacements = CardPlacement.find({'groupId': groupCheck._id}).fetch();

      var cardPickedData = [];

      //order the card picked by value
      //the last 3 card are picked from an array of rank data that is ordered by value (highest to lowest)
      //therefore, simply reversing it would do the trick
      var top4 = individualCardPlacement.cardPicked.splice(0, 4);
      var low3 = individualCardPlacement.cardPicked.reverse();

      var sortedCard = top4.concat(low3);

      sortedCard.forEach((card) => {
        var cardData = individualCardPlacement.rankOrder.find(function(element) {
          return (element.category == card.category && element.subCategory == card.subCategory);
        });
        var minValue;
        var maxValue;
        //get all values for this subCategory from everyone in the group
        var valueHolder = [];
        collectiveCardPlacements.forEach((ccp) => {
          ccp.rankOrder.forEach((ro)=>{
            if(ro.category == card.category && ro.subCategory == card.subCategory){
              valueHolder.push(parseFloat(ro.value));
            }
          })
        });
        
        //get minimum and max value for this subCategory from everyone in the group
        minValue = Math.min(...valueHolder);
        maxValue = Math.max(...valueHolder);

        if((isNaN(parseFloat(minValue)) || !isFinite(minValue)) || (isNaN(parseFloat(maxValue)) || !isFinite(maxValue))){
          minValue = 1;
          maxValue = 1;
        }

        if(cardData){
          cardData.minValue = minValue;
          cardData.maxValue = maxValue;
        }else{
          cardData = {category:card.category,
            subCategory:card.subCategory,
            value:1,
            minValue:minValue, 
            maxValue:maxValue};
        }

        cardPickedData.push(cardData);
      })

      var propData = { 
        firstName: user.profile.firstName, 
        lastName: user.profile.lastName,
        groupName: groupCheck.groupName,
        groupCreatorFirstName: creator.profile.firstName,
        groupCreatorLastName: creator.profile.lastName,
        cardPicked: sortedCard,
        cardPickedData: cardPickedData };

      return Promise.await(generateComponentAsPDF({ component: ReportPdf, props: {propData}, fileName }));
    },
});

