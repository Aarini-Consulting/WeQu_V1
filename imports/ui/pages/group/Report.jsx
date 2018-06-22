import React from 'react';

import '/imports/startup/client/css/report';

export default class Report extends React.Component{
    render(){
        return(
            <div className="a4-wrapper">
                <div className="section _2-content">
                <div className="div-current w-clearfix">
                    <div className="h3 current">Current Session #1</div>
                    <div className="div-diagram">
                    <div className="h4 current">Based on your own data and feedback from others in your team, the WeQ system personalise your session,</div>
                    <div className="diagram-wrapper w-clearfix">
                        <div className="diagram">
                        <div className="diagram-position">
                            <div className="icon _6 analytical"></div>
                            <div className="icon _5"></div>
                            <div className="icon _4 assertive"></div>
                            <div className="icon _1 motivator"></div>
                            <div className="icon _3 generous"></div>
                            <div className="icon _2 listening"></div>
                        </div>
                        <div className="diagram-position-bottom">
                            <div className="icon _7 motivator"></div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="div-current-chart">
                    <div className="chart-legend w-clearfix">
                        <div className="h35"></div>
                        <div className="bar-wrapper actual legend w-clearfix">
                        <div className="font-legend _1">1</div>
                        <div className="font-legend _2">2</div>
                        <div className="font-legend _4">4</div>
                        <div className="font-legend _3">3</div>
                        <div className="font-legend _5">5</div>
                        <div className="font-legend _6">6</div>
                        </div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category leadership">Motivator (37)</strong></div>
                        <div className="q-icon motivator"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category selfmanagement">Doer (16)</strong></div>
                        <div className="q-icon doer"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a self-management">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active self-management"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category problem-solving">Analytics (82)</strong></div>
                        <div className="q-icon analytics"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a problem-solving">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active problem-solving"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category teamwork">Assertive (40)</strong></div>
                        <div className="q-icon assertive"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a teamworjk">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active teamwork"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category communication">Listening (32)</strong></div>
                        <div className="q-icon listening"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a communication">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active communication"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category virtue">Generous (1)</strong></div>
                        <div className="q-icon generous"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a virtue">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active virtue"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    <div className="chart-graph w-clearfix">
                        <div className="h35"><strong className="q-category">Motivator (16)</strong></div>
                        <div className="q-icon motivator"></div>
                        <div className="bar-wrapper actual w-clearfix">
                        <div className="bar-team actual">
                            <div className="bar-line actual"></div>
                        </div>
                        <div className="bar-value a">
                            <div className="value-actual">3,0</div>
                        </div>
                        <div className="bar-active"></div>
                        </div>
                        <div className="chart-arrow"></div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="section _3-footer">
                <div className="weq-logo"></div>
                <div className="footer">WeQ - Nothing beats a kick-ass tem  |  Copyright 2018 WeQ B.V. | www.WeQ.io</div>
                </div>
            </div>
        );
    }
}