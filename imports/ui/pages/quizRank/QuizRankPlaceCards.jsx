import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

class QuizRankPlaceCards extends React.Component {
    constructor(props){
        super(props);
        var timer = undefined;
        this.state = {
            start: undefined,
            elapsed:0,
          };
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
        // Math.round(this.state.elapsed/1000)
        if(this.state.elapsed <= 3000){
             this.setState({elapsed: new Date() - this.state.start});
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.dataReady){
            Meteor.call( 'generate.rank.category.from.csv', (error, result)=>{
                console.log(result);
            });

            Meteor.call( 'generate.card.from.csv', (error, result)=>{
                console.log(result);
            });
        }
        if(nextProps.dataReady && !nextProps.cardPlacement){
            Meteor.call( 'combine.rank.data', nextProps.group._id, (error, result)=>{
                if(error){
                    console.log(error)
                }
            })
        }else if(nextProps.dataReady && nextProps.cardPlacement){
            console.log("startPicking");
            Meteor.call( 'pick.card', nextProps.group._id, (error, result)=>{
                if(error){
                    console.log(error)
                }
                if(result){
                    console.log(result);
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

    render() {
        if(this.props.dataReady && Math.round(this.state.elapsed/1000)  == 3 && this.props.cardPlacement && this.props.cardPlacement.cardOrder){
            return (
                <div className="fillHeight">
                    <section className="section summary fontreleway weq-bg">
                    <div className="section-name font-rate font-name-header">
                        {this.props.currentUser && this.props.currentUser.profile &&
                            this.props.currentUser.profile.firstName +" "+ this.props.currentUser.profile.lastName
                        }
                        <div className="w-inline-block font-rate font-name-sub-header">Place your card face down with the following arrangement </div>
                    </div>
                    <div className="rate-content">
                        <div className="w-block rank-separator-top rank-shield-bg">
                            <div className="show-cards-row">
                                <div className={"font-number c-1"}>
                                    99
                                </div>
                                <div className={"font-number c-2"}>
                                    99
                                </div>
                                <div className={"font-number c-3"}>
                                    99
                                </div>
                            </div>
                            <div className="show-cards-row">
                                <div className={"font-number c-1"}>
                                    99
                                </div>
                                <div className={"font-number c-2"}>
                                    99
                                </div>
                                <div className={"font-number c-3"}>
                                    99
                                </div>
                            </div>
                            <div className="show-cards-row">
                                <div className={"font-number c-1"}>
                                    99
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="w-block cursor-pointer">
                        <div className="font-rate f-bttn w-inline-block noselect" onClick={()=>{
                            console.log("done")
                        }}>Done!</div>
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
