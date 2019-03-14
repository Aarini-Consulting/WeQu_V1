import React from 'react';
import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();
import {complexLinkTranslate} from '/imports/helper/complexLinkTranslate';
import {calculateChartLineWidth} from '/imports/helper/pdfCalculateChartWidth';

export default class ReportPdf extends React.Component {
    render(){
        var propData = {
            firstName:'pz',
            lastName:'gr',
            groupName:'g1',
            groupCreatorFirstName:'y',
            groupCreatorLastName:'w',
            cardPicked:[
                {category:'virtue',subCategory:'generous',cardId:'1'},
                {category:'communication',subCategory:'listening',cardId:'36'},
                {category:'self_management',subCategory:'resilient',cardId:'24'},
                {category:'leadership',subCategory:'visionary',cardId:'73'},
                {category:'teamwork',subCategory:'assertive',cardId:'50'},
                {category:'leadership',subCategory:'mentoring',cardId:'68'},
                {category:'problem_solving',subCategory:'inquisitive',cardId:'89'},
            ],
            cardPickedData:[
                {category:'virtue',subCategory:'generous',value:6,minValue:4.2,maxValue:6},
                {category:'communication',subCategory:'listening',value:5,minValue:4.2,maxValue:6},
                {category:'self_management',subCategory:'resilient',value:3,minValue:1,maxValue:5},
                {category:'leadership',subCategory:'visionary',value:2,minValue:2,maxValue:2},
                {category:'teamwork',subCategory:'assertive',value:6,minValue:6,maxValue:6},
                {category:'leadership',subCategory:'mentoring',value:3,minValue:3,maxValue:3},
                {category:'problem_solving',subCategory:'inquisitive',value:6,minValue:4.2,maxValue:6},
            ]
        }
        return(
            <html>
                <head>
                    <meta charSet="UTF-8"/>
                    <link rel="stylesheet" type="text/css" href="/css/normalize.css"/>
                    <link rel="stylesheet" type="text/css" href="/css/webflow.css"/>
                    <link rel="stylesheet" type="text/css" href="/css/report-pdf.css"/>
                    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"/>
                    <script src="/js/webfont.js" type="text/javascript"></script>
                    <script type="text/javascript">{`
                        WebFont.load({google:{families: ["Raleway:200,regular,italic,500,800","Raleway:regular,800,900"]}});
                    `}</script>
                </head>
                <body>
                <div className="a4-wrapper">
                    <div className="section _1-greeting">
                    <h1 className="h1"><T>weq.reportPdf.Gretings</T></h1>
                    <h1 className="h1 username">{propData.firstName},</h1>
                    <h3 className="h3 subtitle">
                    {complexLinkTranslate("reportPdf.OpeningParagraph",{
                        groupName: propData.groupName,
                        groupCreatorFirstName: propData.groupCreatorFirstName,
                        groupCreatorLastName: propData.groupCreatorLastName
                        })
                    }
                    </h3>
                    </div>
                    <div className="section _2-content">
                    <div className="div-howtoread">
                        {/* <div className="box monitor w-clearfix">
                        <div className="h4 monitor">Monitor your progress each <br/>time you play</div>
                        <div className="arrow-monitor"></div>
                        </div> */}
                        {/* <div className="pointer"></div> */}
                        <div className="h3 title-1"><T>weq.reportPdf.TutorialTitle</T></div>
                        <div className="bar-wrapper w-clearfix">
                        {/* <div className="arrow"></div> */}
                        <div className="bar-howto"><T>weq.reportPdf.TutorialLowestValue</T></div>
                        <div className="bar-howto _3"><T>weq.reportPdf.TutorialCurrentScore</T><br/><T>weq.reportPdf.TutorialCurrentScoreBracket</T></div>
                        {/* <div className="bar-howto _4">Changes from <br/>previous session</div> */}
                        <div className="bar-howto _2"><T>weq.reportPdf.TutorialHighestValue</T></div>
                        {/* <div className="quality-name number">+1,4</div> */}
                        <div className="quality-name"><T>weq.reportPdf.TutorialQualityName</T></div>
                        <div className="bar-team">
                            <div className="bar-line"></div>
                        </div>
                        <div className="bar-value category-leadership" style={{left:45 + "%"}}>3.0</div>
                        <div className="bar-active category-leadership" style={{width:50 + "%"}}></div>
                        </div>
                    </div>
                    <div className="div-current w-clearfix">
                        <div className="h3 current"><T firstName={propData.firstName} lastName={propData.lastName}>weq.reportPdf.CurrentSession</T></div>
                        <div className="div-diagram">
                        <div className="h4 current"><T>weq.reportPdf.GraphOpeningParagraph</T></div>
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
                            <div className="font-legend">0</div>
                            <div className="font-legend">1</div>
                            <div className="font-legend">2</div>
                            <div className="font-legend">3</div>
                            <div className="font-legend">4</div>
                            <div className="font-legend">5</div>
                            <div className="font-legend last">6</div>
                            </div>
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[0].category }`}>{propData.cardPicked[0].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[0].cardId})</strong>
                            </div>
                            <div className={`q-icon badge-${ propData.cardPicked[0].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[0].maxValue-propData.cardPickedData[0].minValue)*100/6)+((propData.cardPickedData[0].minValue)*200/6)) + "%",
                            width:calculateChartLineWidth(propData.cardPickedData[0].maxValue,propData.cardPickedData[0].minValue) + "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[0].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[0].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[0].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[0].category }`} style={{width:Number.parseFloat(propData.cardPickedData[0].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[1].category }`}>{propData.cardPicked[1].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[1].cardId})</strong>
                            </div>
                            <div className={`q-icon badge-${ propData.cardPicked[1].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[1].maxValue-propData.cardPickedData[1].minValue)*100/6)+((propData.cardPickedData[1].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[1].maxValue,propData.cardPickedData[1].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[1].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[1].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[1].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[1].category }`} style={{width:Number.parseFloat(propData.cardPickedData[1].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[2].category }`}>
                                {"mobilisateur(trice)"} {"(99)"}
                                {/* {propData.cardPicked[2].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[2].cardId}) */}
                                </strong></div>
                            <div className={`q-icon badge-${ propData.cardPicked[2].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[2].maxValue-propData.cardPickedData[2].minValue)*100/6)+((propData.cardPickedData[2].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[2].maxValue,propData.cardPickedData[2].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[2].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[2].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[2].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[2].category }`} style={{width:Number.parseFloat(propData.cardPickedData[2].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[3].category }`}>{propData.cardPicked[3].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[3].cardId})</strong></div>
                            <div className={`q-icon badge-${ propData.cardPicked[3].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[3].maxValue-propData.cardPickedData[3].minValue)*100/6)+((propData.cardPickedData[3].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[3].maxValue,propData.cardPickedData[3].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[3].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[3].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[3].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[3].category }`} style={{width:Number.parseFloat(propData.cardPickedData[3].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[4].category }`}>{propData.cardPicked[4].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[4].cardId})</strong></div>
                            <div className={`q-icon badge-${ propData.cardPicked[4].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[4].maxValue-propData.cardPickedData[4].minValue)*100/6)+((propData.cardPickedData[4].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[4].maxValue,propData.cardPickedData[4].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[4].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[4].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[4].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[4].category }`} style={{width:Number.parseFloat(propData.cardPickedData[4].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[5].category }`}>{propData.cardPicked[5].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[5].cardId})</strong></div>
                            <div className={`q-icon badge-${ propData.cardPicked[5].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[5].maxValue-propData.cardPickedData[5].minValue)*100/6)+((propData.cardPickedData[5].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[5].maxValue,propData.cardPickedData[5].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[5].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[5].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[5].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[5].category }`} style={{width:Number.parseFloat(propData.cardPickedData[5].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                        <div className="chart-graph w-clearfix">
                            <div className="h35">
                                <strong className={`q-category text-category-${ propData.cardPicked[6].category }`}>{propData.cardPicked[6].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[6].cardId})</strong></div>
                            <div className={`q-icon badge-${ propData.cardPicked[6].subCategory }`}></div>
                            <div className="bar-wrapper actual w-clearfix">
                            <div className="bar-team actual" style={{
                            left:(-99+((propData.cardPickedData[6].maxValue-propData.cardPickedData[6].minValue)*100/6)+((propData.cardPickedData[6].minValue)*200/6)) + "%",
                            width: calculateChartLineWidth(propData.cardPickedData[6].maxValue,propData.cardPickedData[6].minValue)+ "%"}}>
                                <div className="bar-line actual"></div>
                            </div>
                            <div className={`bar-value a category-${ propData.cardPicked[6].category }`} style={{left:(Number.parseFloat(propData.cardPickedData[6].value*100/6).toPrecision(3))-8 + "%"}}>
                                <div className="value-actual">{Number.parseFloat(propData.cardPickedData[6].value).toPrecision(2)}</div>
                            </div>
                            <div className={`bar-active category-${ propData.cardPicked[6].category }`} style={{width:Number.parseFloat(propData.cardPickedData[6].value*100/6).toPrecision(3)  + "%"}}></div>
                            </div>
                            {/* <div className="chart-arrow"></div> */}
                        </div>
                    </div>
                    </div>
                    <div className="section-3">
                        <div className="h3 next"><T>weq.reportPdf.FooterTitle</T></div>
                        <div className="h4 next">
                        <T>weq.reportPdf.FooterTextLine1</T>
                        <br/>
                        <T>weq.reportPdf.FooterTextLine2</T>
                        <br/>
                        <T groupCreatorFirstName={propData.groupCreatorFirstName}>weq.reportPdf.FooterTextLine3</T>
                        </div>
                        <div className="next-demo"></div>
                    </div>
                    </div>
                    <div className="section _3-footer">
                    <div className="weq-logo"></div>
                    <div className="footer">WeQ - Nothing beats a kick-ass team  |  Copyright 2019 WeQ B.V. | www.WeQ.io</div>
                    </div>
                </div>
                </body>
            </html>
        );
    }
}