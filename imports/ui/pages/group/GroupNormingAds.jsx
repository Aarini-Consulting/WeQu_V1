import React from 'react';

export default class GroupNormingAds extends React.Component{
    render(){
        return(
            <div className="group-norming-wrapper">
                <div className="group-norming-content left">
                    <div className="group-norming-title">
                        Supercharge your WeQ session with Master Coach functionalities
                    </div>
                    
                    Discover different game modules that make the team engaged in repeatable WeQ sessions.

                    <div className="div-block-center">
                        <a className="group-norming-btn" href="https://meetings.hubspot.com/ohyoon/15-min-demo">
                            Book a live demo
                        </a>
                    </div>
                </div>

                <div className="group-norming-content right">
                    <div className="group-norming-title">
                        Deliver data-driven learning experience
                    </div>
                    
                    <div className="div-block-center">
                        <img className="group-norming-img" src="/img/norming.png"/>
                    </div>
                    Multiply your coaching impact and revenue by delivering repeatable sessions to the same team.
                </div>
            </div>
        );
    }
}