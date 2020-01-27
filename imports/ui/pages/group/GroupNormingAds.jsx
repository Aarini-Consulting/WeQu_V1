import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class GroupNormingAds extends React.Component{
    render(){
        return(
            <div className="group-norming-wrapper">
                <div className="group-norming-content left">
                    <div className="group-norming-title">
                    <T>weq.GroupNormingAds.SuperchargeYourWeQSessionWithMasterCoachFunctionalities</T>
                    </div>
                    
                    <T>weq.GroupNormingAds.DiscoverDifferentModules</T>

                    <div className="div-block-center">
                        <a className={`group-norming-btn ${this.props.currentTab}`} href="https://calendly.com/weq/live-demo">
                            <T>weq.GroupNormingAds.BookLiveDemo</T>
                        </a>
                    </div>
                </div>

                <div className="group-norming-content right">
                    <div className="group-norming-title">
                        <T>weq.GroupNormingAds.DeliverLearningExperiences</T>
                    </div>
                    
                    <div className="div-block-center">
                        <img className="group-norming-img" src="/img/norming.png"/>
                    </div>
                    <T>weq.GroupNormingAds.MultiplyYourCoachingImpact</T>
                </div>
            </div>
        );
    }
}