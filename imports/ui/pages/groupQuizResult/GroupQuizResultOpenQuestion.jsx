import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
import GroupQuizResultGraphVerticalBar from './GroupQuizResultGraphVerticalBar';
import LoadingGraph from '/imports/ui/pages/loading/LoadingGraph';
import GroupQuizResultGraphWordCloud from './GroupQuizResultGraphWordCloud';

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
        //only updates when number of "word" in the wordcloud chart changed 
        if(!this.props.selectedQuizResult || (this.props.selectedQuizResult && nextProps.selectedQuizResult && nextProps.selectedQuizResult.length > this.props.selectedQuizResult.length)){
            this.calculateData(nextProps);
        }
    }

    calculateData(props){
        if(props.selectedQuiz){
            this.setState({
                loading: true
            },()=>{
                var arrayHolder=[];
                var isEmpty = false;

                if(props.selectedQuizResult && props.selectedQuizResult.length > 0){
                    props.selectedQuizResult.forEach((quizResult) => {
                        var individualAnswer = quizResult.results && quizResult.results.answer;
                        if(Array.isArray(individualAnswer) && individualAnswer.length > 0){
                          arrayHolder = arrayHolder.concat(individualAnswer);
                        }
                    });
                }else{
                    isEmpty = true;
                }

                var data = arrayHolder.join('`');

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
                <GroupQuizResultGraphWordCloud data={this.state.data} isEmpty={this.state.isEmpty} arrayJoint="`"/>
            );
        }else{
            return(
                <h1>no data</h1>
            )
        }
    }
}