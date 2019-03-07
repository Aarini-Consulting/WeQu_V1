import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {quizComponent} from '/imports/helper/quizComponent';
import Loading from '/imports/ui/pages/loading/Loading';
import Error from '/imports/ui/pages/error/Error';
import AnswerSubmitted from './AnswerSubmitted';

class GroupQuizClientPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error:false,
            groupQuizId:undefined,
            changingQuiz:false
        };
    }

    componentDidMount(){
        if(this.props.dataReady && this.props.groupQuiz){
            this.setState({ groupQuizId:this.props.groupQuiz._id });
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.dataReady && nextProps.groupQuiz){
            //ensures that previous component is unmounted by rendering loading screen
            if(this.state.groupQuizId && nextProps.groupQuiz._id != this.state.groupQuizId){
                this.setState(
                    { changingQuiz:true },
                ()=>{
                    this.setState({
                        changingQuiz: false, 
                        groupQuizId:this.props.groupQuiz._id
                    });
                });
            }else{
                this.setState({ groupQuizId:nextProps.groupQuiz._id });
            }
        }
    }

    submitAction(data){
        Meteor.call( 'set.group.quiz.data', this.props.group._id, this.props.groupQuiz._id, data, (error, result)=>{
            if(error){
                this.setState({
                    error: error
                });
            }
        });
    }

    render() {
        if(this.state.error){
            return (
                <Error/>
            );
        }
        else{
            if(this.props.dataReady && !this.state.changingQuiz){
                if(this.props.groupQuiz){
                    if(this.props.groupQuizData){
                        return (
                            <AnswerSubmitted/>
                        );
                    }else{
                        var groupQuiz = this.props.groupQuiz;
                        groupQuiz.groupId=this.props.group._id;
    
                        var SelectedComponent = quizComponent(groupQuiz.component);
    
                        return (
                            <SelectedComponent submitAction={this.submitAction.bind(this)} {...groupQuiz}/>
                        );
                    }
                }else{
                    return (
                        <div className="fillHeight">
                            <section className="section summary fontreleway weq-bg">
                            selected quiz not found
                            </section>
                        </div>
                    );
                }
            }else{
                return(
                    <Loading/>
                )
            }
        }
  }
}

export default withTracker((props) => {
    var dataReady;
    var group = props.group;
    var groupQuiz;
    var groupQuizData;
    if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
        var handleGroupQuiz = Meteor.subscribe('groupQuiz',
        {
          "_id" : {$in:group.groupQuizIdList}
        },{}, {
          onError: function (error) {
                console.log(error);
            }
        });
  
        if(handleGroupQuiz.ready()){
          groupQuiz=GroupQuiz.findOne({_id : group.currentGroupQuizId});

          if(groupQuiz){
            var handleGroupQuizData = Meteor.subscribe('groupQuizData',
            {
              "groupId": group._id,
              "groupQuizId" : groupQuiz._id,
              "creatorId": Meteor.userId()
            },{}, {
              onError: function (error) {
                    console.log(error);
                }
            });

            if(handleGroupQuizData.ready()){
                groupQuizData=GroupQuizData.findOne({
                    "groupId": group._id,
                    "groupQuizId" : groupQuiz._id,
                    "creatorId": Meteor.userId()
                  });
                dataReady = true;
            }
          }else{
            dataReady = true;
          }
        }
    }else{
        dataReady = true;
    }

    
  return {
      dataReady:dataReady,
      groupQuiz:groupQuiz,
      groupQuizData:groupQuizData
  };
})(GroupQuizClientPage);
