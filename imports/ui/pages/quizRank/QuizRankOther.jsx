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
        <div className={"font-rate-quality noselect"}>{i18n.getTranslation(`weq.rankItem.${value.toString()}`)}</div>
    </div>
);

const SortableList = SortableContainer(({items, disabled}) => {
  return (
    <div className="rate-box-container">
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
            firstSwipe:undefined,
            savingData:false,
            quizOver:false,
          };
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.dataReady && nextProps.dataReady){
            if(nextProps.feedbackRank && nextProps.feedbackRank.rankItems){
                this.setState({
                    items: nextProps.feedbackRank.rankItems[0],
                    firstSwipe:undefined,
                    savingData:false
                },()=>{
                    this.setTimer(true);
                });
            }else{
                this.setState({
                    firstSwipe:undefined,
                    items:[]
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
        this.setTimer(false);

        this.setState({
            savingData:true
        },()=>{
            var rankObject={};
            this.state.items.forEach((el,index,array) => {
                rankObject[el]=(array.length - index)
            });

            Meteor.call( 'save.others.rank', this.props.feedbackRank.to, this.props.group._id, rankObject, this.state.firstSwipe, (error, result)=>{
                if(error){
                    console.log(error)
                }else{
                    this.quizFinished();
                }
            })
        });
        
    }

    quizFinished(){
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
                    <section className="ranker-container fontreleway purple-bg">
                        <div className="section-name font-rate font-name-header">
                            {this.props.quizUser && this.props.quizUser.profile &&
                                this.props.quizUser.profile.firstName +" "+ this.props.quizUser.profile.lastName
                            }
                        </div>
                        <div className="div-time-100">
                            <div className="actual-time" style={{width:(Math.round(this.state.elapsed/1000)/60)*100 +"%"}}></div>
                        </div>
                        <div className="rate-content">
                            <div className="font-rate font-name-header f-white">Rank teammate's qualities in 60 seconds</div>
                            <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                        
                            <div className="w-block cursor-pointer">
                                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                                        {this.props.users
                                        ?"Next"
                                        :"Done!"
                                        }
                                </div>
                            </div>
                        </div>
                        
                    </section>
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
    var quizUser;
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
        var handleFeedbackRank = Meteor.subscribe('feedbackRank',
        {groupId:groupId,
        from:Meteor.userId(),
        to:props.feedbackRank.to},
        {}, {
            onError: function (error) {
                    console.log(error);
            }
        });

        if(handleFeedbackRank.ready()){
            if(group){
                feedbackRank = FeedbackRank.findOne({
                    groupId:groupId,
                    from:Meteor.userId(),
                    to:props.feedbackRank.to});
            }

            quizUser = Meteor.users.findOne(
                {_id:feedbackRank.to}
            );

            currentUser = Meteor.user();
            dataReady = true;
        }
    }
  return {
      quizUser:quizUser,
      users:users,
      group:group,
      feedbackRank:feedbackRank,
      currentUser:currentUser,
      dataReady:dataReady,
  };
})(QuizRankOther);
