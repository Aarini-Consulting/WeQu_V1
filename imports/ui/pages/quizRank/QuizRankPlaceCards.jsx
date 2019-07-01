import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import LoadingAnimated from '/imports/ui/pages/loading/LoadingAnimated';
import SessionWait from '/imports/ui/pages/quizClient/SessionWait';

import i18n from 'meteor/universe:i18n';

import {Group} from '/collections/group';
import {CardPlacement} from '/collections/cardPlacement';

import {groupTypeIsShort} from '/imports/helper/groupTypeShort.js';

class QuizRankPlaceCards extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state = {
            start: undefined,
            elapsed:0,
            wait:3000
        };
    }

    setTimer(bool){
        if(bool){
            this.setState({
                start: new Date(),
                wait:3000,
                elapsed: 0
            },()=>{
                this.timer = setInterval(this.tick.bind(this), 1000);
            });
        }else{
            clearInterval(this.timer);
            this.setState({
                wait:0,
            });
        }
    }

    tick(){
        // This function is called every 1000 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        // Math.round(this.state.elapsed/1000)
        if(this.state.elapsed <= this.state.wait){
             this.setState({elapsed: new Date() - this.state.start});
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.dataReady && nextProps.group.isPlaceCardFinished && (!nextProps.cardPlacement || (nextProps.cardPlacement && !nextProps.cardPlacement.cardPicked))){
            Meteor.call( 'combine.rank.data', nextProps.group._id, Meteor.userId(), (error, result)=>{
                if(error){
                    console.log(error)
                }
            })
        }
    }

    componentWillMount(){
        this.setTimer(true);
    }

    componentWillUnmount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:
        if(this.timer){
            this.setTimer(false);
        }
    }

    renderCards(){
        var cards = this.props.cardPlacement.cardPicked.slice();
        var top4 = cards.splice(0, 4);
        var low3 = cards.reverse();

        var lowCardRow =  low3.map((card) => {
            return(
                <div className={`font-number ${ card.category }`} key={card.cardId}>
                    {card.cardId}
                </div>
            )
        });

        return(
            <div className="w-block rank-separator-top rank-shield-bg">
                <div className="show-cards-row">
                    {lowCardRow}
                </div>
                <div className="show-cards-row">
                    <div className={`font-number ${ top4[1].category }`}>
                        {top4[1] && top4[1].cardId}
                    </div>
                    <div className={`font-number ${ top4[0].category } font-number-main`}>
                        {top4[0] && top4[0].cardId}
                    </div>
                    <div className={`font-number ${ top4[2].category }`}>
                        {top4[2] && top4[2].cardId}
                    </div>
                </div>
                <div className="show-cards-row">
                    <div className={`font-number ${ top4[(top4.length-1)].category }`}>
                        {top4[(top4.length-1)] && top4[(top4.length-1)].cardId}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.props.dataReady && this.props.group && groupTypeIsShort(this.props.group.groupType)){
            return(
                <SessionWait/>
            );
        }
        else if(this.props.dataReady && Math.round(this.state.elapsed)  >= this.state.wait && this.props.cardPlacement && this.props.cardPlacement.cardPicked){
            return (
                <div className="fillHeight">
                    <section className="section summary fontreleway weq-bg">
                    <div className="section-name font-rate font-name-header">
                        {this.props.currentUser && this.props.currentUser.profile &&
                            this.props.currentUser.profile.firstName +" "+ this.props.currentUser.profile.lastName
                        }
                        <div className="w-inline-block font-rate font-name-sub-header">
                        {i18n.getTranslation("weq.quizRankPlaceCard.Instruction")} 
                        </div>
                    </div>
                    <div className="rate-content">
                        {this.renderCards()}
                    </div>
                    </section>
                </div>
            );
        }else{
            return(
                <LoadingAnimated placeCard={true}/>
            );
        }
    }
}

export default withTracker((props) => {
    var dataReady;
    var groupId;
    var group;
    var currentUser;
    var cardPlacement;

    if(props.user && props.user.profile.selfRank){
        groupId = props.user.profile.selfRank;
        currentUser = props.user;
    }else if(props.group){
        groupId = props.group._id;
        currentUser = Meteor.user();
    }

    var handleCardPlacement = Meteor.subscribe('cardPlacement',{groupId:groupId,userId:Meteor.userId()},{}, {
        onError: function (error) {
              console.log(error);
        }
    });

    var handleGroup = Meteor.subscribe('group',{_id:groupId},{}, {
        onError: function (error) {
              console.log(error);
          }
    });

    if(Meteor.user() && handleCardPlacement.ready() && handleGroup.ready()){
        group = Group.findOne({_id:groupId});
        cardPlacement = CardPlacement.findOne({groupId:groupId,userId:Meteor.userId()});
        dataReady = true;
    }
    
    return {
        group:group,
        cardPlacement:cardPlacement,
        currentUser:Meteor.user(),
        dataReady:dataReady,
    };
})(QuizRankPlaceCards);