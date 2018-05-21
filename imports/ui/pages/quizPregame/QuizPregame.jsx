import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

import Loading from '/imports/ui/pages/loading/Loading';

const SortableItem = SortableElement(({value}) =>
    <div className="rate-box w-clearfix cursor-pointer">
        <div className="rate-hamburger">
            <div className="rate-line"></div>
            <div className="rate-line"></div>
            <div className="rate-line"></div>
        </div>
        <div className="font-rate-quality">{value}</div>
    </div>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <div className="w-block">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

class SortableComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: ['Item 1a;dklfj;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', 
            'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
          };
    }
  
    onSortEnd(newArray){
        this.setState({
            items: arrayMove(this.state.items, newArray.oldIndex, newArray.newIndex),
        });
    };
    render() {
        return <SortableList items={this.state.items} onSortEnd={this.onSortEnd.bind(this)} />;
    }
}

class QuizPregame extends React.Component {
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
                    <div className="actual-time" style={{width:60 +"%"}}></div>
                </div>
                <div className="rate-content">
                    <div className="font-rate font-name-header f-white">Rank my qualities in 60 seconds</div>
                    <SortableComponent/>
                </div>
                <div className="w-block cursor-pointer">
                    <div className="font-rate f-bttn w-inline-block">Done!</div>
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
