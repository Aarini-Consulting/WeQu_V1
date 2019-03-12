import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import GroupQuizResult from '/imports/ui/pages/groupQuiz/GroupQuizResult';
import GroupQuizResultGraphVerticalBar from '/imports/ui/pages/groupQuizResult/GroupQuizResultGraphVerticalBar';

import Loading from '/imports/ui/pages/loading/Loading';

export default class GroupQuizReportPdf extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
      return(
        <GroupQuizResultGraphVerticalBar data={[
            {amount:50, text:"red"},
            {amount:100, text:"teal"},
            {amount:125, text:"yellow"},
            {amount:75, text:"purple"},
            {amount:25, text:"green"}
        ]} isEmpty={true}/>
    );
  }
}

// export default withTracker((props) => {
//     var dataReady;
//     var group;
//     var handleGroup;

//     var selectedGroupQuiz;
//     var selectedGroupQuizData;

//     var groupId = props.match.params.gid;
//     var groupQuizId = props.match.params.qid;

//       if(groupId){
//           handleGroup = Meteor.subscribe('group',{_id : groupId},{}, {
//             onError: function (error) {
//                   console.log(error);
//               }
//           });
  
//           if(handleGroup.ready()){
//             group = Group.findOne({_id : groupId, creatorId:Meteor.userId()});

//             if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
//                 var handleGroupQuiz = Meteor.subscribe('groupQuiz',
//                 {
//                   "_id" : {$in:group.groupQuizIdList}
//                 },{}, {
//                   onError: function (error) {
//                         console.log(error);
//                     }
//                 });
            
//                 if(handleGroupQuiz.ready()){
//                   selectedGroupQuiz=GroupQuiz.findOne({_id : groupQuizId});
            
//                   var handleGroupQuizData = Meteor.subscribe('groupQuizData',
//                   {
//                     "groupId": group._id,
//                     "groupQuizId": groupQuizId
//                   },{}, {
//                     onError: function (error) {
//                           console.log(error);
//                       }
//                   });
            
//                   if(handleGroupQuizData.ready()){
//                     if(group.currentGroupQuizId){
//                       groupQuizDataList = GroupQuizData.find({
//                         "groupId": group._id,
//                       }).fetch();
//                     }
                    
//                     dataReady = true;
//                   }
//                 }
//             }else{
//                 dataReady = true;
//             }
//           }
//       }
//     return {
//         group:group,
//         selectedGroupQuiz:selectedGroupQuiz,
//         selectedGroupQuizData:selectedGroupQuizData,
//         currentUser: Meteor.user(),
//         dataReady:dataReady
//     };
// })(GroupQuizReportPdf);