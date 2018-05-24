import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';
import QuizRankPlaceCards from '/imports/ui/pages/quizRank/QuizRankPlaceCards';

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

class QuizPregame extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state = {
            start: undefined,
            elapsed:0,
            items:[],
            steps:undefined,
            currentStep:0,
            firstSwipe:undefined,
            savingData:false,
            quizOver:false,
          };
    }

    componentWillMount(){
        Meteor.call( 'generate.pregame.quiz.from.csv', Meteor.userId(), (error, result)=>{
            if(result){
                //result has 6 main categories
                //each main category has 4 sub-categories
                //user needs to get 4 sets of 6 sub-categories
                //every set of this 6 sub-categories must have 1 randomly-selected sub-category from each category
                //BUT sub-category that has been added to the set of 6 sub-categories CANNOT be used again for other set of 6 sub-categories
                var steps={};
                for(var r in result){
                    var quiz = result[r];
                    var subCategory = quiz.subCategory;

                    for(var i = subCategory.length-1;i>=0;i--){
                        var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                        if(steps[i]){
                            steps[i].push(randomSub[0]);
                        }else{
                            steps[i]=[randomSub[0]];
                        }
                    }
                }

                this.setState({
                    steps: steps,
                    items: steps[0]
                });
            }else{
                this.setState({
                    steps: undefined,
                    items:[]
                });
                console.log(error);
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.dataReady && nextProps.dataReady){
            this.setTimer(true);
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
        if(this.state.currentStep < Object.keys(this.state.steps).length){
            this.setTimer(false);

            this.setState({
                savingData:true
            },()=>{
                var rankObject={};
                this.state.items.forEach((el,index,array) => {
                    rankObject[el]=(array.length - index)
                });
                  
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
                            <div className="font-rate font-name-header f-white">Rank your qualities in 60 seconds</div>
                            {this.state.steps &&
                                <div className="font-rate font-name-header f-white">
                                    {(this.state.currentStep+1)+"/"+(Object.keys(this.state.steps).length)}
                                </div>
                            }
                            <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                        </div>
                        <div className="w-block cursor-pointer">
                            {this.state.steps &&
                                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                                    {this.state.currentStep < (Object.keys(this.state.steps).length-1)
                                    ?"Next"
                                    :"Done!"
                                    }
                                </div>
                            }  
                        </div>
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

    if(props.user && props.user.profile.pregame){
        var handleGroup = Meteor.subscribe('group',{_id:props.user.profile.pregame},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.user.profile.pregame});
            currentUser = props.user;
            dataReady = true;
        }
    }else if(props.match.params.gid){
        var handleGroup = Meteor.subscribe('group',{_id:props.match.params.gid},{}, {
            onError: function (error) {
                  console.log(error);
              }
        });

        if(handleGroup.ready()){
            group = Group.findOne({_id:props.match.params.gid});
            currentUser = Meteor.user();
            dataReady = true;
        }
    }else{
        dataReady = true;
    }
   
  return {
      group:group,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizPregame);
