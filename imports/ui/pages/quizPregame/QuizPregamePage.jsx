import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import Menu from '/imports/ui/pages/menu/Menu';
import Quiz from './Quiz';
import QuizPregame from './QuizPregame';

class QuizPregamePage extends React.Component {
    renderGroups(){
        return this.props.groups.map((group) => {
            return(
                <tr key={group._id}>
                    <td>
                    {group.groupName}									
                    </td>
                    <td>
                    <Link to={`pregame/${ group._id }`} id="sign-up" className="loginBtn">go to quiz</Link>
                    </td>
                </tr>
            )
        });
    }
    render() {
        if(this.props.dataReady){
            return (
                this.renderGroups()
            );
        }else{
            return(
                <Loading/>
            );
        }
    }
}

export default withTracker((props) => {
    var dataReady;
    var group;
    if(Meteor.user()){
        var email = Meteor.user().emails[0].address;
        handleGroup = Meteor.subscribe('group',{
            $and : [ {"emails" : email }, 
            { "emailsPregameCompleted" : {$nin:[email]}}]
            
        },{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            groups = Group.find({
                $and : [ {"emails" : email }, 
                { "emailsPregameCompleted" : {$nin:[email]}}]
                
            }).fetch();

            dataReady = true;
        }
    }
  return {
      group:groups,
      dataReady:dataReady,
  };
})(QuizPregamePage);
