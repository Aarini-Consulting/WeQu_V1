import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';
import QuizRankPlaceCards from '/imports/ui/pages/quizRank/QuizRankPlaceCards';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

const SortableItem = SortableElement(({value, disabled}) =>
    <div className={"rate-box w-clearfix" +(disabled ? " noselect":" cursor-pointer")}>
        <div className="rate-hamburger">
            <div className="rate-line"></div>
            <div className="rate-line"></div>
            <div className="rate-line"></div>
        </div>
        <div className={"font-rate-quality noselect"}>{value.toString().replace("_"," ")}</div>
    </div>
);

const SortableList = SortableContainer(({items, disabled}) => {
  return (
    <div className="w-block">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} disabled={disabled}/>
      ))}
    </div>
  );
});

class QuizRankSelf extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state = {
            start: undefined,
            elapsed:0,
            items:[],
            steps:undefined,
            currentStep:-1,
            firstSwipe:undefined,
            savingData:false,
            quizOver:false,
            showInfo:false
          };
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.dataReady && nextProps.dataReady){
            if(nextProps.feedbackRank && nextProps.feedbackRank.rankItems){
                var currentStep = 0;
                var lengthOfSet = Object.keys(nextProps.feedbackRank.rankItems[0]).length;
                var numOfSet = Object.keys(nextProps.feedbackRank.rankItems).length;
                if(nextProps.feedbackRank.rank){
                    currentStep = Math.round(Object.keys(nextProps.feedbackRank.rank).length/lengthOfSet)-1;
                }

                if(currentStep >= numOfSet){
                    currentStep = numOfSet-1;
                }
                if(currentStep < 0){
                    currentStep = 0;
                }

                if(currentStep == 0){
                    this.setState({
                        showInfo:true,
                        showInfoMessage:
                        <div>
                            Describe Yourself
                            <br/>
                            <br/>
                            Which qualities are most true about you?<br/>
                            Sort the following words from top to bottom by dragging them up or down in the list.<br/>
                            <br/>
                            You have 60 seconds.
                        </div>
                    });
                }

                this.setState({
                    steps: nextProps.feedbackRank.rankItems,
                    items: nextProps.feedbackRank.rankItems[currentStep],
                    currentStep: currentStep
                },()=>{
                    if(currentStep > 0){
                        this.setTimer(true);
                    }
                });
            }else{
                this.setState({
                    steps: undefined,
                    currentStep:-1,
                    firstSwipe:undefined,
                    items:[],
                    showInfo:false
                });
                this.setTimer(false);
            }
        }
    }

    componentWillUnmount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:
        if(this.timer){
            this.setTimer(false);
        }
        
    }

    stepFinished(){
        if(this.state.currentStep >= 0 && this.state.currentStep < Object.keys(this.state.steps).length){
            this.setTimer(false);

            this.setState({
                savingData:true
            },()=>{
                var rankObject={};
                this.state.items.forEach((el,index,array) => {
                    rankObject[el]=(array.length - index)
                });
                console.log(rankObject);
                Meteor.call( 'save.self.rank', this.props.group._id, rankObject, this.state.firstSwipe, (error, result)=>{
                    if(error){
                        console.log(error)
                    }else{
                        if(this.state.currentStep + 1 >= Object.keys(this.state.steps).length){
                            this.quizFinished();
                        }
                        else{
                            this.setState({
                                items: this.state.steps[(this.state.currentStep + 1)],
                                firstSwipe:undefined,
                                currentStep:(this.state.currentStep + 1),
                                savingData:false
                            },()=>{
                                this.setTimer(true);
                            });
                        }
                    }
                })
            });
        }
    }

    quizFinished(){
        console.log("it's over");
        this.setState({
            quizOver: true,
        });
        this.setTimer(false);
    }

    setTimer(bool){
        if(bool){
            this.setState({
                start: new Date(),
                elapsed: 0
            },()=>{
                this.timer = setInterval(this.tick.bind(this), 1000);
            });
        }else{
            clearInterval(this.timer);
        }
    }

    tick(){
        // This function is called every 1000 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        if(this.state.elapsed <= 60000){
             this.setState({elapsed: new Date() - this.state.start});
        }
        else{
            this.stepFinished();
        }
    }

    onSortEnd(newArray){
        if(!this.state.firstSwipe){
            this.setState({
                firstSwipe: {item:this.state.items[newArray.oldIndex], startingIndex: newArray.oldIndex, newIndex: newArray.newIndex},
            });
        }
        this.setState({
            items: arrayMove(this.state.items, newArray.oldIndex, newArray.newIndex),
        });
    };
    
    render() {
        if(this.props.dataReady && !this.state.savingData){
            return (
                <div className="fillHeight">
                    <section className="section summary fontreleway purple-bg">
                        <div className="section-name font-rate font-name-header">
                            {this.props.currentUser && this.props.currentUser.profile &&
                                this.props.currentUser.profile.firstName +" "+ this.props.currentUser.profile.lastName
                            }
                        </div>
                        <div className="div-time-100">
                            <div className="actual-time" style={{width:(Math.round(this.state.elapsed/1000)/60)*100 +"%"}}></div>
                        </div>
                        <div className="rate-content">
                            {/* <div className="font-rate font-name-header f-white">Describe yourself</div>
                            <div className="font-rate font-name-header f-white">Sort the following qualities from top (more true) to bottom (less true)</div>
                            <div className="font-rate font-name-header f-white">You have 60 seconds</div> */}
                            {this.state.steps && this.state.currentStep >= 0 &&
                                <div className="font-rate font-name-header f-white">
                                    {(this.state.currentStep+1)+"/"+(Object.keys(this.state.steps).length)}
                                </div>
                            }
                            <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                        </div>
                        <div className="w-block cursor-pointer">
                            {this.state.steps && this.state.currentStep >= 0 &&
                                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                                    {this.state.currentStep < (Object.keys(this.state.steps).length-1)
                                    ?"Next"
                                    :"Done!"
                                    }
                                </div>
                            }  
                        </div>

                        {this.state.showInfo &&
                            <SweetAlert
                            type={"info"}
                            message={this.state.showInfoMessage}
                            btnText={"Let's go!"}
                            onCancel={() => {
                                this.setState({ showInfo: false });
                                this.setTimer(true);
                            }}/>
                        }
                    </section>
                </div>
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
    var currentUser;
    var feedbackRank;

    if(props.user && props.user.profile.selfRank){
        var handleGroup = Meteor.subscribe('group',{_id:props.user.profile.selfRank},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.user.profile.selfRank});
            currentUser = props.user;
            dataReady = true;
        }
    }else if(props.group){
        var handleGroup = Meteor.subscribe('group',{_id:props.group._id},{}, {
            onError: function (error) {
                  console.log(error);
            }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.group._id});

            var handleFeedbackRank = Meteor.subscribe('feedbackRank',
            {groupId:props.group._id,from:Meteor.userId(),to:Meteor.userId()},
            {}, {
                onError: function (error) {
                      console.log(error);
                }
            });

            if(handleFeedbackRank.ready()){
                if(group){
                    feedbackRank = FeedbackRank.findOne({groupId:props.group._id,from:Meteor.userId(),to:Meteor.userId()});
                }
                currentUser = Meteor.user();
                dataReady = true;
            }
        }
    }else{
        dataReady = true;
    }
   
  return {
      group:group,
      feedbackRank:feedbackRank,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizRankSelf);
