import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import GroupQuizResultGraphHorizontalBar from './GroupQuizResultGraphHorizontalBar';
import LoadingGraph from '/imports/ui/pages/loading/LoadingGraph';

class GroupQuizResultRanker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data:undefined,
            loading:false,
            isEmpty:false
        };
    }

    componentDidMount(){
        this.calculateData(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.calculateData(nextProps);
    }

    calculateData(props){
        if(props.dataReady && props.selectedQuiz){
            this.setState({
                loading: true
            },()=>{
                var data;
                if(props.selectedQuiz.rankItemsLoadExternalField){
                    data = props.rankItems.map((options)=>{
                        return {amount:0,text:options};
                    });
                }else if(props.selectedQuiz.rankItems && props.selectedQuiz.rankItems.length > 0){
                    data = props.selectedQuiz.rankItems.map((options)=>{
                        return {amount:0,text:i18n.getTranslation(`weq.groupQuizAnswer.${options}`)};
                    });
                }
                
                var isEmpty = false;

                if(props.selectedQuizResult && props.selectedQuizResult.length > 0){
                    props.selectedQuizResult.forEach((quizResult) => {
                        // var result = quizResult.results;
                        // var keys = Object.keys(result);

                        // keys.forEach((key)=>{
                        //   Data
                        // })

                        // if(data[selectedIndex]){
                        //     data[selectedIndex].amount = data[selectedIndex].amount+1;
                        // }
                    });
                }else{
                    isEmpty = true;
                }

                this.setState({
                    loading: false,
                    data: data,
                    isEmpty: isEmpty
                });
            });
        }
    }

    render() {
      if(!this.props.dataReady || this.state.loading){
          return (
              <LoadingGraph/>
          )
      }else if(this.state.data){
          return (
              <GroupQuizResultGraphHorizontalBar data={this.state.data} isEmpty={this.state.isEmpty}/>
          );
      }else{
          return(
              <h1>no data</h1>
          )
      }
    }
}

export default withTracker((props) => {
    var dataReady;
    var rankItems=[];

    if(props.selectedQuiz.groupId && props.selectedQuiz.rankItemsLoadExternalField && props.selectedQuiz.rankItemsLoadExternalField == "userFullName"){
        var handleGroup = Meteor.subscribe('group',{_id : props.selectedQuiz.groupId},{}, {
            onError: function (error) {
                    console.log(error);
                }
        });

        if(handleGroup.ready()){
            var group = Group.findOne({_id : props.selectedQuiz.groupId});

            var users = Meteor.users.find(
                {
                    "_id" : {$in:group.userIds}
                }
                ).fetch();
            
            if(users && users.length > 0){
                rankItems = users.map((user)=>{
                    var firstName = user && user.profile && user.profile.firstName;
                    if(!firstName){
                        firstName = "";
                    }
                    var lastName = user && user.profile && user.profile.lastName;

                    if(!lastName){
                        lastName = "";
                    }
                    return (firstName + " " + lastName);
                });
            }
            else{
                rankItems = [];
            }

            dataReady = true;
        }
    }else{
      dataReady = true;
    }
    return {
        rankItems:rankItems,
        dataReady:dataReady
    };
  })(GroupQuizResultRanker);