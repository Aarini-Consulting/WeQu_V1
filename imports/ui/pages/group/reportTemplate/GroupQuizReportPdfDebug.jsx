// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { Redirect } from 'react-router';
// import { withTracker } from 'meteor/react-meteor-data';

// import GroupQuizResult from '/imports/ui/pages/groupQuiz/GroupQuizResult';
// import GroupQuizResultGraphVerticalBar from '/imports/ui/pages/groupQuizResult/GroupQuizResultGraphVerticalBar';

// import Loading from '/imports/ui/pages/loading/Loading';

// import {quizResultGraphSelectorPdf} from '/imports/helper/quizResultGraphSelectorPdf';

// import {quizResultGraphDataCalculator} from '/imports/helper/quizResultGraphDataCalculator';

// export default class GroupQuizReportPdfDebug extends React.Component {
//   constructor(props){
//     super(props);
//   }

//   render() {
//     console.log(quizResultGraphSelectorPdf("GroupQuizResultGraphVerticalBar"));
//     var GraphComponent = quizResultGraphSelectorPdf("GroupQuizResultGraphVerticalBar");
//     var props = quizResultGraphDataCalculator("test");

//     return(
//       <html>
//         <head>
//             <meta charSet="UTF-8"/>
//             {/* <link rel="stylesheet" type="text/css" href="/css/normalize.css"/>
//             <link rel="stylesheet" type="text/css" href="/css/webflow.css"/>
//             <link rel="stylesheet" type="text/css" href="/css/report-pdf.css"/> */}
//             <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"/>
//         </head>
//         <body>
//           <div className="group-quiz-cmc-screen">
//             <div className="font-rate font-name-header group-quiz-cmc-screen-question">
//               Quiz question
//             </div>
//             <div className="group-quiz-cmc-screen-content">
//               <img style={{
//                 width:100+"%",
//                 height:100+"%",
//                 filter:"opacity(20%)",
//                 backgroundSize:"contain",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center"
//               }} src="https://s3-eu-west-1.amazonaws.com/wequ/groupQuiz/Menti_background.001.jpeg"/>
//               <div className="group-quiz-cmc-screen-content-item">
//               <GraphComponent {...props}/>
//               </div>
//             </div>
//         </div>
//         </body>
//       </html>
      
//     );
//   }
// }

// // export default withTracker((props) => {
// //     var dataReady;
// //     var group;
// //     var handleGroup;

// //     var selectedGroupQuiz;
// //     var selectedGroupQuizData;

// //     var groupId = props.match.params.gid;
// //     var groupQuizId = props.match.params.qid;

// //       if(groupId){
// //           handleGroup = Meteor.subscribe('group',{_id : groupId},{}, {
// //             onError: function (error) {
// //                   console.log(error);
// //               }
// //           });
  
// //           if(handleGroup.ready()){
// //             group = Group.findOne({_id : groupId, creatorId:Meteor.userId()});

// //             if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
// //                 var handleGroupQuiz = Meteor.subscribe('groupQuiz',
// //                 {
// //                   "_id" : {$in:group.groupQuizIdList}
// //                 },{}, {
// //                   onError: function (error) {
// //                         console.log(error);
// //                     }
// //                 });
            
// //                 if(handleGroupQuiz.ready()){
// //                   selectedGroupQuiz=GroupQuiz.findOne({_id : groupQuizId});
            
// //                   var handleGroupQuizData = Meteor.subscribe('groupQuizData',
// //                   {
// //                     "groupId": group._id,
// //                     "groupQuizId": groupQuizId
// //                   },{}, {
// //                     onError: function (error) {
// //                           console.log(error);
// //                       }
// //                   });
            
// //                   if(handleGroupQuizData.ready()){
// //                     if(group.currentGroupQuizId){
// //                       groupQuizDataList = GroupQuizData.find({
// //                         "groupId": group._id,
// //                       }).fetch();
// //                     }
                    
// //                     dataReady = true;
// //                   }
// //                 }
// //             }else{
// //                 dataReady = true;
// //             }
// //           }
// //       }
// //     return {
// //         group:group,
// //         selectedGroupQuiz:selectedGroupQuiz,
// //         selectedGroupQuizData:selectedGroupQuizData,
// //         currentUser: Meteor.user(),
// //         dataReady:dataReady
// //     };
// // })(GroupQuizReportPdf);