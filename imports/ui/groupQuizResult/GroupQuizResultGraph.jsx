import React from 'react';
import i18n from 'meteor/universe:i18n';

export default class GroupQuizResultGraph extends React.Component {
    componentDidMount(){
        
    }
    render() {
        return (
            <div className="group-quiz-graph-wrapper">
                <div className="ring animated"></div>
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    <h1>awesome graph here</h1>
                </div>
            </div>
        );
    }
}
