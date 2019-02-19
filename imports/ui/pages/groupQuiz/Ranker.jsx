import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

import {complexLinkTranslate} from '/imports/ui/complexLinkTranslate';

const SortableItem = SortableElement(({value, disabled, rankItemsLoadExternalField}) =>
    <div className={"rate-box w-clearfix" +(disabled ? " noselect":" cursor-pointer")}>
        <div className="rate-hamburger">
            <div className="rate-line"></div>
            <div className="rate-line"></div>
            <div className="rate-line"></div>
        </div>
        <div className={"font-rate-quality noselect"}>
            {rankItemsLoadExternalField 
            ?
              value.toString()
            :
              i18n.getTranslation(`weq.groupQuizAnswer.${value.toString()}`)
            }
        </div>
    </div>
);

const SortableList = SortableContainer(({items, disabled, rankItemsLoadExternalField}) => {
  return (
    <div className="rate-box-container">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} disabled={disabled} rankItemsLoadExternalField={rankItemsLoadExternalField}/>
      ))}
    </div>
  );
});

class Ranker extends React.Component {
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
            showInfo:false
          };
    }

    componentDidMount(){
        if(this.props.rankItems){
            this.setState({
                items: this.props.rankItems,
            },()=>{
                if(this.state.items.length > 0 && this.props.withTimer){
                    this.setTimer(true);
                }
            });
        }else{
            this.setState({
                firstSwipe:undefined,
                items:[],
            });
            this.setTimer(false);
        }
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.dataReady && nextProps.dataReady){
            if(nextProps.rankItems){
                this.setState({
                    items: nextProps.rankItems,
                },()=>{
                    if(this.state.items.length > 0 && nextProps.withTimer){
                        this.setTimer(true);
                    }
                });
            }else{
                this.setState({
                    firstSwipe:undefined,
                    items:[],
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
            this.quizFinished();
            this.props.submitAction(rankObject);
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
        if(this.state.elapsed <= this.props.timerDuration){
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
        if(!this.state.savingData && this.props.dataReady){
            return (
                    <section className="ranker-container fontreleway purple-bg">
                        <div className="section-name font-rate font-name-header">
                            {this.props.group && this.props.group.groupName &&
                                this.props.group.groupName
                            }
                        </div>
                        {this.props.withTimer &&
                            <div className="div-time-100">
                                <div className="actual-time" style={{width:(Math.round(this.state.elapsed/1000)/60)*100 +"%"}}></div>
                            </div>
                        }
                        <div className="rate-content">
                            <div className="font-rate font-name-header f-white">
                                {i18n.getTranslation(`weq.groupQuizQuestion.${this.props.question}`)}
                            </div>
                            {/* <div className="font-rate font-name-header f-white">Describe yourself</div>
                            <div className="font-rate font-name-header f-white">Sort the following qualities from top (more true) to bottom (less true)</div>
                            <div className="font-rate font-name-header f-white">You have 60 seconds</div> */}
                            <SortableList 
                            items={this.state.items} 
                            onSortEnd={this.onSortEnd.bind(this)} 
                            disabled={this.state.quizOver}
                            rankItemsLoadExternalField={this.props.rankItemsLoadExternalField}/>
                            
                            <div className="w-block cursor-pointer">
                                <div className="font-rate f-bttn w-inline-block noselect" onClick={this.stepFinished.bind(this)}>
                                    {i18n.getTranslation(`weq.rankSelf.ButtonDone`)}
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

Ranker.defaultProps = {
    timerDuration: 60000,
    withTimer: false
  };

export default withTracker((props) => {
    var dataReady;
    var group;
    var rankItems=props.rankItems;
    var handleGroup = Meteor.subscribe('group',{_id : props.groupId},{}, {
        onError: function (error) {
                console.log(error);
            }
    });

    if(handleGroup.ready()){
        group = Group.findOne({_id : props.groupId});

        if(props.rankItemsLoadExternalField && props.rankItemsLoadExternalField == "userFullName"){
            if(group.groupQuizIdList && group.groupQuizIdList.length > 0){
                var handleUsers = Meteor.subscribe('users',
                    {_id:
                    {$in:group.userIds}
                    }, 
                    {}, {
                    onError: function (error) {
                            console.log(error);
                        }
                });
                if(handleUsers.ready()){
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
        }else{
            dataReady = true;
        }
    }
    return {
        group:group,
        rankItems:rankItems,
        dataReady:dataReady
    };
})(Ranker);