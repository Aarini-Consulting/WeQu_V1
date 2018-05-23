import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';

class QuizRankPlaceCards extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        if(this.props.dataReady){
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
                        <div className="w-block rank-separator-top">
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
    if(Meteor.user()){
        dataReady = true;
    }
    
    return {
        currentUser:Meteor.user(),
        dataReady:dataReady,
    };
})(QuizRankPlaceCards);
