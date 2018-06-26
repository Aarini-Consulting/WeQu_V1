import React from 'react';

export const ReportPdf = (propData) => (
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/css/normalize.css"/>
            <link rel="stylesheet" type="text/css" href="/css/webflow.css"/>
            <link rel="stylesheet" type="text/css" href="/css/report-pdf.css"/>
            <script src="/js/webfont.js" type="text/javascript"></script>
            <script type="text/javascript">{`
                WebFont.load({google:{families: ["Raleway:200,regular,italic,500,800","Raleway:regular,800,900"]}});
            `}</script>
        </head>
        <body>
        <div className="a4-wrapper">
            <div className="section _1-greeting">
            <h1 className="h1">Hey</h1>
            <h1 className="h1 username">{propData.firstName}</h1>
            <h3 className="h3 subtitle">
            You&#x27;ve just played WeQ with your <strong>{propData.groupName}</strong>. 
            This is your report prepared by <strong>{propData.groupCreatorFirstName}&nbsp;{propData.groupCreatorLastName}</strong>, WeQ Master Coach.
            </h3>
            </div>
            <div className="section _2-content">
            <div className="div-howtoread">
                <div className="box monitor w-clearfix">
                <div className="h4 monitor">Monitor your progress each <br/>time you play</div>
                <div className="arrow-monitor"></div>
                </div>
                <div className="pointer"></div>
                <div className="h3 title-1">How to read this chart </div>
                <div className="bar-wrapper w-clearfix">
                <div className="arrow"></div>
                <div className="bar-howto">The lowest value of this <br/>Quality in your group</div>
                <div className="bar-howto _3">Your current score <br/>(evaluated by you and others)</div>
                <div className="bar-howto _4">Changes from <br/>previous session</div>
                <div className="bar-howto _2">The highest value of this <br/>Quality in your group</div>
                <div className="quality-name number">+1,4</div>
                <div className="quality-name">Quality name (Card#)</div>
                <div className="bar-team">
                    <div className="bar-line"></div>
                </div>
                <div className="bar-value">3,0</div>
                <div className="bar-active"></div>
                </div>
            </div>
            <div className="div-current w-clearfix">
                <div className="h3 current">Current Session #1</div>
                <div className="div-diagram">
                <div className="h4 current">Based on your own data and feedback from others in your team, the WeQ system personalise your session,</div>
                <div className="diagram-wrapper w-clearfix">
                    <div className="diagram">
                    <div className="diagram-position">
                        <div className={`icon _3 badge-${ propData.cardPicked[2].subCategory }`}></div> 
                        <div className={`icon _2 badge-${ propData.cardPicked[0].subCategory }`}></div> 
                        <div className={`icon _1 badge-${ propData.cardPicked[1].subCategory }`}></div> 
                        <div className={`icon _4 badge-${ propData.cardPicked[6].subCategory }`}></div>
                        <div className={`icon _6 badge-${ propData.cardPicked[4].subCategory }`}></div>
                        <div className={`icon _5 badge-${ propData.cardPicked[5].subCategory }`}></div>
                    </div>
                    <div className="diagram-position-bottom">
                    <div className={`icon _7 badge-${ propData.cardPicked[3].subCategory }`}></div>
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
                    <div className="h35">
                        <strong className="q-category leadership">{propData.cardPicked[0].subCategory}&nbsp;({propData.cardPicked[0].cardId})</strong>
                    </div>
                    <div className="q-icon motivator"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[0].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category selfmanagement">{propData.cardPicked[1].subCategory}&nbsp;({propData.cardPicked[1].cardId}</strong>
                    </div>
                    <div className="q-icon doer"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a self-management">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[1].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active self-management"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category problem-solving">{propData.cardPicked[2].subCategory}&nbsp;({propData.cardPicked[2].cardId}</strong></div>
                    <div className="q-icon analytics"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a problem-solving">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[2].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active problem-solving"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category teamwork">{propData.cardPicked[3].subCategory}&nbsp;({propData.cardPicked[3].cardId}</strong></div>
                    <div className="q-icon assertive"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a teamworjk">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[3].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active teamwork"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category communication">{propData.cardPicked[4].subCategory}&nbsp;({propData.cardPicked[4].cardId}</strong></div>
                    <div className="q-icon listening"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a communication">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[4].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active communication"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category virtue">{propData.cardPicked[5].subCategory}&nbsp;({propData.cardPicked[5].cardId}</strong></div>
                    <div className="q-icon generous"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a virtue">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[5].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active virtue"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                <div className="chart-graph w-clearfix">
                    <div className="h35">
                        <strong className="q-category">{propData.cardPicked[6].subCategory}&nbsp;({propData.cardPicked[6].cardId}</strong></div>
                    <div className="q-icon motivator"></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual">
                        <div className="bar-line actual"></div>
                    </div>
                    <div className="bar-value a">
                        <div className="value-actual">{Number.parseFloat(propData.cardPickedData[6].value).toPrecision(2)}</div>
                    </div>
                    <div className="bar-active"></div>
                    </div>
                    <div className="chart-arrow"></div>
                </div>
                </div>
            </div>
            <div className="section-3">
                <div className="h3 next">Next Session #2</div>
                <div className="h4 next">Create awareness of your progress and get feedback about 7 new Qualities.</div>
                <div className="next-demo"></div>
            </div>
            </div>
            <div className="section _3-footer">
            <div className="weq-logo"></div>
            <div className="footer">WeQ - Nothing beats a kick-ass tem  |  Copyright 2018 WeQ B.V. | www.WeQ.io</div>
            </div>
        </div>
        </body>
    </html>
);