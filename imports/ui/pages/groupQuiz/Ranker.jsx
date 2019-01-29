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

export default class Ranker extends React.Component {
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
                    if(items.length > 0 && nextProps.withTimer){
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
            // Meteor.call( 'save.self.rank', this.props.group._id, rankObject, this.state.firstSwipe, (error, result)=>{
            //     if(error){
            //         console.log(error)
            //     }else{
            //         this.quizFinished();
            //     }
            // });
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
        if(!this.state.savingData){
            return (
                    <section className="ranker-container fontreleway purple-bg">
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
                            <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} disabled={this.state.quizOver}/>
                            
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