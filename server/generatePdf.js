import ReactDOMServer from 'react-dom/server';
import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import pdf from 'html-pdf';
import fs from 'fs';
import puppeteer from 'puppeteer'
import {ReportPdfEN} from '/imports/ui/pages/group/reportTemplate/ReportPdfEN';
import {ReportPdfNL} from '/imports/ui/pages/group/reportTemplate/ReportPdfNL';
import {ReportPdfFR} from '/imports/ui/pages/group/reportTemplate/ReportPdfFR';
import {ReportPdfDE} from '/imports/ui/pages/group/reportTemplate/ReportPdfDE';

import i18n from 'meteor/universe:i18n';

import {Group} from '/collections/group';
import {CardPlacement} from '/collections/cardPlacement';

const getBase64String = (path) => {
  try {
    const file = fs.readFileSync(path);
    return new Buffer(file).toString('base64');
  } catch (exception) {
    console.log(exception);
  }
};

const generatePDFFromHtml = async (html, fileName) => {
  try {
    var home = Meteor.absoluteUrl();
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.setCacheEnabled(false);
    
    await page.setRequestInterception(true);
    // Capture first request only
    page.once('request', request => {
      // Fulfill request with HTML, and continue all subsequent requests
      request.respond({body: html});
      page.on('request', request => request.continue());
    });
    await page.goto(home,{waitUntil: 'networkidle2'});

    await page.emulateMedia('screen');
    var pdfBuffer = await page.pdf({
      format:"A4",
      printBackground:true,
    })
    await browser.close();

    return { fileName: fileName, base64: pdfBuffer.toString('base64') };

  } catch (exception) {
    console.log(exception);
  }
};



const generatePreview = async (html, fileName, dataType) => {
  try {
    var home = Meteor.absoluteUrl();
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.setCacheEnabled(false);
    
    await page.setRequestInterception(true);
    // Capture first request only
    page.once('request', request => {
      // Fulfill request with HTML, and continue all subsequent requests
      request.respond({body: html});
      page.on('request', request => request.continue());
    });
    await page.goto(home,{waitUntil: 'networkidle2'});

    await page.emulateMedia('screen');
    
    var result = await page.screenshot({
      type:dataType,
      fullPage:true,
      encoding:"base64"
    })
    await browser.close();

    return { fileName: fileName, base64: result };

  } catch (exception) {
    console.log(exception);
  }
};

const getComponentAsHTML = (component, props) => {
  try {
    return ReactDOMServer.renderToStaticMarkup(component(props));
  } catch (exception) {
    console.log(exception);
  }
};

const generateComponentAsPDF = async ({ languageCode, component, props, fileName, dataType }) => {
  var supportedLocale = Meteor.settings.public.supportedLocale;
  var locale;
  var langObj;
  supportedLocale.forEach((sl)=>{
    var lang = sl.split("-")[0];
    if(langObj){
      langObj[lang] = sl;
    }else{
      langObj = {[lang]:sl};
    }
  });

  if(langObj[languageCode]){
    locale = langObj[languageCode];
  }else{
    locale = supportedLocale[0];
  }

  const html = i18n.runWithLocale(locale, ()=>{
    return getComponentAsHTML(component, props);
  });
  if (html && fileName){
    if(dataType === "pdf"){
      return await generatePDFFromHtml(html, fileName);
    }else if(dataType === "png" || dataType === "jpeg"){
      return await generatePreview(html, fileName, dataType);
    }else{
      throw (new Meteor.Error("invalid_data_type"));
    }
  }
};

const generatePDFFromUrl = async (url, fileName) => {
  try {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.goto(url,{waitUntil: 'networkidle0'});

    await page.emulateMedia('screen');

    var pdfBuffer = await page.pdf({
      format:"A4",
      printBackground:true,
    })
    await browser.close();

    return { fileName: fileName, base64: pdfBuffer.toString('base64') };

  } catch (exception) {
    console.log(exception);
  }
};


Meteor.methods({
    'download.report.group.pdf':function(groupId, languageCode){
      let groupCheck = Group.findOne({'_id': groupId});
      
      if(!groupCheck){
          throw (new Meteor.Error("unknown_group")); 
      }

      var zipName = groupCheck.groupName + "_report.zip";

      var users = Meteor.users.find({
        "_id" : {$in:groupCheck.userIds}
      }).fetch();

      var results = [];
      users.forEach((user) => {
        var result = Meteor.call('download.report.individual.pdf', groupCheck._id, user._id, languageCode);
        results.push(result);
      });

      return {zipName:zipName,results:results};
        
    },
    'download.report.individual.pdf' : async function (groupId, userId, languageCode, dataType="pdf") {


      if(!(dataType == "pdf" || dataType == "png" || dataType == "jpeg")){
        throw (new Meteor.Error("invalid_data_type"));
      }

      let groupCheck = Group.findOne({'_id': groupId});
      
      if(!groupCheck){
          throw (new Meteor.Error("unknown_group")); 
      }

      var creator = Meteor.users.findOne({_id:groupCheck.creatorId});
      if(!creator){
        throw (new Meteor.Error("group_creator_not_found")); 
      }

      var user = Meteor.users.findOne({
        $and : [ 
        {"_id" : {$in:groupCheck.userIds}}, 
        {"_id" : userId}
      ]});

      if(!user){
        throw (new Meteor.Error("user_not_found")); 
      }

      var fileName = groupCheck.groupName + "_" + user.profile.firstName + "_" + user.profile.lastName + "_" + user._id +"."+dataType;

      var propData = { 
        firstName: user.profile.firstName, 
        lastName: user.profile.lastName,
        groupName: groupCheck.groupName,
        groupCreatorFirstName: creator.profile.firstName,
        groupCreatorLastName: creator.profile.lastName,
        groupType:groupCheck.groupType
      };
        
      if(groupCheck.isPlaceCardFinished){
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
        });

        propData.cardPicked = sortedCard;
        propData.cardPickedData = cardPickedData; 
      }

      var reportTemplate;
      var reportTemplates = {
        "en":ReportPdfEN, 
        "nl":ReportPdfNL,
        "fr":ReportPdfFR,
        "de":ReportPdfDE
      }
      
      if(languageCode && reportTemplates[languageCode]){
        reportTemplate = reportTemplates[languageCode];
      }else{
        reportTemplate = ReportPdfEN;
      }
      return (await generateComponentAsPDF({ languageCode:languageCode, component: reportTemplate, props: {propData}, fileName, dataType }));
      
    },
    'generate.preview' : function (groupId, userId, languageCode) {
      return Meteor.call('download.report.individual.pdf', groupId, userId, languageCode, "png");
    },
});

