import ReactDOMServer from 'react-dom/server';
import pdf from 'html-pdf';
import fs from 'fs';

// import {PDFTest} from '/imports/ui/pages/pdfTest';
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
      border: { top: '0', right: '0', bottom: '0', left: '0' },
      base: Meteor.absoluteUrl(),
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
    'download.pdf' : function (fileName) {
      var propTest = { _id: 'HLMxoJvg2esP8NobR', title: 'test', body: 'hello world' };
        return generateComponentAsPDF({ component: ReportPdf, props: {propTest}, fileName })
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

