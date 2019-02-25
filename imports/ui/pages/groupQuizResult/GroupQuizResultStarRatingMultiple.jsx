import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import GroupQuizResultGraphVerticalBar from './GroupQuizResultGraphVerticalBar';
import LoadingGraph from '/imports/ui/pages/loading/LoadingGraph';
import GroupQuizResultGraphHorizontalBar from './GroupQuizResultGraphHorizontalBar';

export default class GroupQuizResultOpenQuestion extends React.Component {
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
        if(props.selectedQuiz){
            this.setState({
                loading: true
            },()=>{
              //using objects to temporarily store combined result information
              var isEmpty = false;
              var data;
              if(props.selectedQuizResult && props.selectedQuizResult.length > 0){
                var dataHolderCombinedResult = {};
                //generate empty state for data array
                if(props.selectedQuiz.starItems && props.selectedQuiz.starItems.length > 0){
                    data = props.selectedQuiz.starItems.map((options)=>{
                        dataHolderCombinedResult[options] = 0;
                        return {amount:0,text:options};
                    });
                }
              
                props.selectedQuizResult.forEach((quizResult) => {
                  var individualResult = quizResult.results;
                  if(individualResult){
                      for (var key in individualResult) {
                          if(typeof individualResult[key] == "number"){
                              dataHolderCombinedResult[key] = dataHolderCombinedResult[key] + individualResult[key];
                          }
                       }
                  }
                });

                data = data.map((d)=>{
                  var newAmount = dataHolderCombinedResult[d.text];
                  newAmount = newAmount/props.selectedQuizResult.length;
                  return {amount:newAmount,text:i18n.getTranslation(`weq.groupQuizAnswer.${d.text}`)};
                });
              }else{
                if(props.selectedQuiz.starItems && props.selectedQuiz.starItems.length > 0){
                    data = props.selectedQuiz.starItems.map((options)=>{
                        return {amount:0,text:i18n.getTranslation(`weq.groupQuizAnswer.${options}`)};
                    });
                }
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
        if(this.state.loading){
            return (
                <LoadingGraph/>
            )
        }else if(this.state.data){
            return (
                <GroupQuizResultGraphHorizontalBar data={this.state.data} isEmpty={this.state.isEmpty} xMaxPoint={5}/>
            );
        }else{
            return(
                <h1>no data</h1>
            )
        }
    }
}