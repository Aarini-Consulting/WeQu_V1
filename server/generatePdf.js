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
      type: "pdf"
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

      if(groupCheck && !groupCheck.isActive){
        throw (new Meteor.Error("group_inactive")); 
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
          var fileName = user._id+".pdf";
          var result = Meteor.call('download.report.individual.pdf',fileName, groupCheck._id);
          results.push(result);
        }
      });

      return {zipName:zipName,results:results};
        
    },
    'download.report.individual.pdf' : function (fileName, groupId) {
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

      var user = Meteor.users.findOne({$or : [ 
        {"emails.address" : {$in:groupCheck.emails}  }, 
        { "profile.emailAddress" : {$in:groupCheck.emails}}
      ]});

      if(!user){
        throw (new Meteor.Error("user_not_found")); 
      }

      var cp = CardPlacement.findOne({'groupId': groupCheck._id,'userId': user._id});

      var cardPickedData = []

      cp.cardPicked.forEach((card) => {
        var data = cp.rankOrder.find(function(element) {
          return (element.category == card.category && element.subCategory == card.subCategory);
        });
        cardPickedData.push(data);
      })

      var propData = { 
        firstName: user.profile.firstName, 
        lastName: user.profile.lastName,
        groupName: groupCheck.groupName,
        groupCreatorFirstName: creator.profile.firstName,
        groupCreatorLastName: creator.profile.lastName,
        cardPicked: cp.cardPicked,
        cardPickedData: cardPickedData };

      return Promise.await(generateComponentAsPDF({ component: ReportPdf, props: {propData}, fileName }));
    },
    'download.multiple.pdf' : function (groupId) {
      var fileName1 = "user1.pdf"
      var report1 = Meteor.call('download.pdf',fileName1);
      console.log("r1");
      console.log(report1)
      var fileName2 = "user2.pdf"
      var report2 = Meteor.call('download.pdf',fileName2);
      console.log("r2");
      console.log(report2)

      return [report1, report2]
      // let groupCheck = Group.findOne({'_id': groupId});

      // if(!groupCheck){
      //     throw (new Meteor.Error("unknown_group")); 
      // }

      // var cardPlacements = CardPlacement.find({groupId:groupCheck._id}).fetch();
      // var pdfReports = [];

      // cardPlacements.forEach((cp, index, _arr) => {
      //   var user = Meteor.users.findOne(cp.userId);
        
      // });

      // var propTest = { _id: 'HLMxoJvg2esP8NobR', title: 'test', body: 'hello world' };
      //   return generateComponentAsPDF({ component: PDFTest, props: {propTest}, fileName })
    },
});

