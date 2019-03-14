// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { Redirect } from 'react-router';
// import { withTracker } from 'meteor/react-meteor-data';

// import GroupQuizResult from '/imports/ui/pages/groupQuiz/GroupQuizResult';
// import GroupQuizResultGraphVerticalBar from '/imports/ui/pages/groupQuizResult/GroupQuizResultGraphVerticalBar';

// import Loading from '/imports/ui/pages/loading/Loading';

// import {quizResultGraphSelectorPdf} from '/imports/helper/quizResultGraphSelectorPdf';

// import {quizResultGraphDataCalculator} from '/imports/helper/quizResultGraphDataCalculator';

// export const GroupQuizReportPdf = ({propData}) => {
//   var GraphComponent=propData.graphComponent;
//   return (
//     <html>
//       <head>
//           <meta charSet="UTF-8"/>
//           {/* <link rel="stylesheet" type="text/css" href="/css/normalize.css"/>
//           <link rel="stylesheet" type="text/css" href="/css/webflow.css"/>
//           <link rel="stylesheet" type="text/css" href="/css/report-pdf.css"/> */}
//           <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"/>
//       </head>
//       <body>
//         <div className="group-quiz-cmc-screen">
//           <div className="font-rate font-name-header group-quiz-cmc-screen-question">
//             Quiz question
//           </div>
//           <div className="group-quiz-cmc-screen-content">
//             <img style={{
//               width:100+"%",
//               height:100+"%",
//               filter:"opacity(20%)",
//               backgroundSize:"contain",
//               backgroundRepeat: "no-repeat",
//               backgroundPosition: "center"
//             }} src="https://s3-eu-west-1.amazonaws.com/wequ/groupQuiz/Menti_background.001.jpeg"/>
//             <div className="group-quiz-cmc-screen-content-item">
//             <h1>hello world</h1>
//             {/* <GraphComponent {...propData.propsForGraph}/> */}
//             <GroupQuizResultGraphVerticalBar {...propData.propsForGraph}/>
//             </div>
//           </div>
//       </div>
//       </body>
//     </html>
//   );
// }