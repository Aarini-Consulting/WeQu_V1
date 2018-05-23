import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';

const SortableItem = SortableElement(({value, disabled}) =>
    <div className={"rate-box w-clearfix" +(disabled ? " noselect":" cursor-pointer")}>
        <div className="rate-hamburger">
            <div className="rate-line"></div>
            <div className="rate-line"></div>
            <div className="rate-line"></div>
        </div>
        <div className={"font-rate-quality" + (disabled ? " noselect":"")}>{value.toString().replace("_"," ")}</div>
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
            firstSwipe:undefined,
            quizOver:false
          };
    }

    componentDidMount(){
        Meteor.call( 'generate.pregame.quiz.from.csv', Meteor.userId(), (error, result)=>{
            if(result){
                var items=[];
                for(var r in result){
                    var quiz = result[r];
                    var subCategory = quiz.subCategory;
                    var min = Math.ceil(0);
                    var max = Math.floor(subCategory.length);
                    var randomIndex =  Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
                    items.push(subCategory[randomIndex])
                }
                this.setState({
                    items: items,
                });
            }else{
                this.setState({
                    items: undefined,
                });
                console.log(error);
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.dataReady && nextProps.dataReady){
            this.setState({
                start: new Date(),
            },()=>{
                this.timer = setInterval(this.tick.bind(this), 1000);
            });
        }
    }

    componentWillUnmount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:
        if(this.timer){
            clearInterval(this.timer);
        }
        
    }

    quizFinished(){
        console.log("it's over");
        this.setState({
            quizOver: true,
        });
        clearInterval(this.timer);


    }

    tick(){
        // This function is called every 1000 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        if(this.state.elapsed <= 60000){
             this.setState({elapsed: new Date() - this.state.start});
        }
        else{
            this.quizFinished();
        }
    }

    onSortEnd(newArray){
        if(this.state.firstSwipe){
            this.setState({
                firstSwipe: {item:this.state.items[newArray.oldIndex], startingIndex: newArray.oldIndex, newIndex: newArray.newIndex},
            });
        }
        this.setState({
            items: arrayMove(this.state.items, newArray.oldIndex, newArray.newIndex),
        });
    };

    render() {
        if(this.props.dataReady){
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
                        <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                    </div>
                    <div className="w-block cursor-pointer">
                        <div className="font-rate f-bttn w-inline-block" onClick={this.quizFinished.bind(this)}>Done!</div>
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
