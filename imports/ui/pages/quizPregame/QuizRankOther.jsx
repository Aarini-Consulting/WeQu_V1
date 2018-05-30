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

class QuizRankOther extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state = {
            start: undefined,
            elapsed:0,
            items:[],
            currentStep:0,
            firstSwipe:undefined,
            savingData:false,
            quizOver:false,
          };
    }

    componentWillMount(){
        Meteor.call( 'generate.rank.category.from.csv', Meteor.userId(), (error, result)=>{
            if(result){
                //result has 6 main categories
                //each main category has 4 sub-categories
                //every user needs to get 1 set of 5 sub-categories
                //this set of 5 sub-categories contains 1 randomly chosen subcategory 
                //from 5 randomly chosen main categories
                //if a subCategory is already chosen, NO other subCategory from the same main category can be used in the same set
                //if a subCategory is already chosen, it cannot be used again for other user
                //a sub categoryif can be reused for other user if all unique subCategory is already chosen 
                //or the remaining subCategory cannot be chosen because current set already contains other subCategory from the same main category

                
                var numUser = 5;
                var numOfSet = 5;

                var categories = JSON.parse(JSON.stringify(result));
                var itemsTotal = [];
                for(var i=0;i<numUser;i++){
                    var items=[];
                    var keys = Object.keys(categories);
                    for(var i2=0;i2<numOfSet;i2++){
                        if(keys.length >= 1){
                            //select random category and remove it from the keys array to ensure that it won't be selected again on this set
                            var randomKeys = keys.splice(Math.floor(Math.random()*keys.length), 1);
                            var randomCat =  categories[randomKeys];
                            var subCategory = categories[randomKeys].subCategory;

                            //select random category and remove it from the array to ensure that it won't be selected again on this set
                            var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                            
                            items.push(randomSub[0]);
                            
                            //if all subCategories from a category is already selected, delete the category
                            if(subCategory.length == 0){
                                console.log("delete" + randomKeys);
                                delete categories[randomKeys];
                            }
                        }else{
                            //either all unique subCategory already selected or
                            //current set already contains a subCategory from the surviving category data
                            var currentSet = items[items.length-1];
                            
                            //load fresh copy of categories
                            categories = JSON.parse(JSON.stringify(result));
                            keys = Object.keys(categories);

                            //removed keys that already selected in the current set
                            for(var r in categories){
                                var quiz = categories[r];
                                var subCategory = quiz.subCategory;

                                subCategory.some((subCat) => {
                                    if(currentSet.indexOf(subCat) > -1){
                                        if(keys.indexOf(r) > -1){
                                            keys.splice(keys.indexOf(r), 1);
                                        }
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });
                            }

                            //do the same thing again
                            var randomKeys = keys.splice(Math.floor(Math.random()*keys.length), 1);
                            var randomCat =  categories[randomKeys];
                            var subCategory = categories[randomKeys].subCategory;
                            var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                            items.push(randomSub[0]);
                            
                            if(subCategory.length == 0){
                                console.log("delete" + randomKeys);
                                delete categories[randomKeys];
                            }
                        }
                    }
                    itemsTotal[i] = items;
                }

                console.log(itemsTotal);

                this.setState({
                    items: []
                });
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
        this.setTimer(false);

        this.setState({
            savingData:true
        },()=>{
            var rankObject={};
            this.state.items.forEach((el,index,array) => {
                rankObject[el]=(array.length - index)
            });
            console.log(rankObject);
            // Meteor.call( 'save.other.rank', this.props.group._id, rankObject, this.state.firstSwipe, (error, result)=>{
            //     if(error){
            //         console.log(error)
            //     }else{
            //         if(this.state.currentStep + 1 >= Object.keys(this.state.steps).length){
            //             this.quizFinished();
            //         }
            //         else{
            //             this.setState({
            //                 items: this.state.steps[(this.state.currentStep + 1)],
            //                 firstSwipe:undefined,
            //                 currentStep:(this.state.currentStep + 1),
            //                 savingData:false
            //             },()=>{
            //                 this.setTimer(true);
            //             });
            //         }
            //     }
            // })
        });
        
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
                            <div className="font-rate font-name-header f-white">{this.props.group.groupName}</div>
                            <div className="font-rate font-name-header f-white">Rank other qualities in 60 seconds</div>
                            <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                        </div>
                        <div className="w-block cursor-pointer">
                            <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                                    {this.props.users
                                    ?"Next"
                                    :"Done!"
                                    }
                            </div>
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
    var users;
    var groupId;
    var feedbackRank;

    if(props.user && props.user.profile.selfRank){
        groupId = props.user.profile.selfRank;
        currentUser = props.user;
    }else if(props.group){
        groupId = props.group._id;
        currentUser = Meteor.user();
    }

    var handleGroup = Meteor.subscribe('group',{_id:groupId},{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    

    if(handleGroup.ready()){
        group = Group.findOne({_id:groupId});
        // users = Meteor.users.findOne(
        //     {
        //         $and : [ 
        //             {$or : [ {"emails.address" : {$in:group.emails}  }, 
        //                 { "profile.emailAddress" : {$in:group.emails}}
        //             ]}, 
        //             { "_id" : {$not:Meteor.userId()}}
        //         ]
        //     },{
        //         sort: { "profile.firstName": 1 }
        //     }
        // );
        
        dataReady = true;
    }
  return {
      users:users,
      group:group,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizRankOther);
