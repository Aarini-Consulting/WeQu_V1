// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withTracker } from 'meteor/react-meteor-data';

// import Quiz from './Quiz'; 

// class ScriptLoginInit extends React.Component {
//   componentDidMount(){
//     if( this.props.currentUser && this.props.currentUser.profile.loginScript == 'init'){
//             if(this.props.currentUser && !this.props.feedback){
//               alert("get-question-set");
//                 Meteor.call('gen-question-set', Meteor.userId(), function (err, result) {
//                   if(err){
//                     console.log('gen-question-set', err, result);
//                   }else{
//                     setLoginScript('quiz');
//                   }
//               });        
//             }
//     }
//   }
//   render() {
//     return (
//         <div>
//             <Quiz feedback={this.props.myfeedback} currentUser={this.props.currentUser}/>
//         </div>
//     );
//   }
// }

// export default withTracker((props) => {
//   return {
//       currentUser: Meteor.user()
//   };
// })(ScriptLoginInit);
