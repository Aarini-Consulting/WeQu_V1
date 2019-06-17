import React from 'react';
import {calculateChartLineWidth} from '/imports/helper/pdfCalculateChartWidth';
import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

export const ReportPdfDE = ({propData}) => (
    <html>
        <head>
            <meta charSet="UTF-8"/>
            <link rel="stylesheet" type="text/css" href="/css/normalize.css"/>
            <link rel="stylesheet" type="text/css" href="/css/webflow.css"/>
            <link rel="stylesheet" type="text/css" href="/css/report-pdf.css"/>
        </head>
        <body>
        <div className="a4-wrapper">
            <div className="section _1-greeting">
            <h1 className="h1">Hey</h1>
            <h1 className="h1 username">{propData.firstName},</h1>
            <h3 className="h3 subtitle">
                Sie haben gerade WeQ gespielt als <strong>{propData.groupName}</strong>.
                Dies ist Ihr Bericht von <strong>{propData.groupCreatorFirstName} {propData.groupCreatorLastName}</strong>, WeQ Master Coach.
            </h3>
            </div>
            <div className="section _2-content">
            <div className="div-howtoread">
                {/* <div className="box monitor w-clearfix">
                <div className="h4 monitor">Monitor your progress each <br/>time you play</div>
                <div className="arrow-monitor"></div>
                </div> */}
                {/* <div className="pointer"></div> */}
                <div className="h3 title-1">Wie lesen Sie diese Tabelle?</div>
                <div className="bar-wrapper w-clearfix">
                {/* <div className="arrow"></div> */}
                <div className="bar-howto">Der niedrigste Wert dieser<br/>Qualität in Ihrer Gruppe.</div>
                <div className="bar-howto _3">Ihre aktuelle Punktzahl <br/>(bewertet von Ihnen und ihren Teammitgliedern)</div>
                {/* <div className="bar-howto _4">Changes from <br/>previous session</div> */}
                <div className="bar-howto _2">Der höchste Wert dieser <br/>Qualität in Ihrer Gruppe.</div>
                {/* <div className="quality-name number">+1,4</div> */}
                <div className="quality-name">Name (Karte#)</div>
                <div className="bar-team">
                    <div className="bar-line"></div>
                </div>
                <div className="bar-value category-leadership" style={{left:45 + "%"}}>3.0</div>
                <div className="bar-active category-leadership" style={{width:50 + "%"}}></div>
                </div>
            </div>
            <div className="div-current w-clearfix">
                <div className="h3 current">Aktuelle Sitzung - {propData.firstName} {propData.lastName}</div>
                {propData.groupType == "short" 
                ?
                <div className="h4 current">Based on your own data and feedback from others in your team, the WeQ system personalizes your session.</div>
                :
                <div className="div-diagram">
                    <div className="h4 current">Basierend auf Ihren eigenen Daten und dem Feedback anderer Teammitglieder personalisiert das WeQ-System Ihre Session.</div>
                    <div className="diagram-wrapper w-clearfix">
                        {propData.cardPicked 
                            ?
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
                            :
                            <div className="diagram">
                                <div className="diagram-position">
                                    <div className="icon _3 badge-placeholder"></div> 
                                    <div className="icon _2 badge-placeholder"></div> 
                                    <div className="icon _1 badge-placeholder"></div> 
                                    <div className="icon _4 badge-placeholder"></div>
                                    <div className="icon _6 badge-placeholder"></div>
                                    <div className="icon _5 badge-placeholder"></div>
                                </div>
                            
                                <div className="diagram-position-bottom">
                                    <div className={`icon _7 badge-placeholder`}></div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
                
                <div className={propData.groupType == "short" ? "div-current-chart full-width" : "div-current-chart"}>
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

                    {propData.cardPicked && propData.cardPicked.length > 0 
                    ? 
                        propData.cardPicked.map((cp,index,array)=>{
                            var cpData = propData.cardPickedData[index];
                            return(
                                <div className="chart-graph w-clearfix" key={cp.category+index}>
                                    <div className="h35">
                                        <strong className={`q-category text-category-${ cp.category }`}>
                                            {i18n.getTranslation(`weq.rankItem.${cp.subCategory.toString()}`)} ({cp.cardId})
                                        </strong>
                                    </div>
                                    <div className={`q-icon badge-${ cp.subCategory }`}></div>
                                    <div className="bar-wrapper actual w-clearfix">
                                    <div className="bar-team actual" style={{
                                    left:(-100+((cpData.maxValue-cpData.minValue)*100/6)+((cpData.minValue)*200/6)) + "%",
                                    width:calculateChartLineWidth(cpData.maxValue,cpData.minValue) + "%"}}>
                                        <div className="bar-line actual"></div>
                                    </div>
                                    <div className={`bar-value a category-${ cp.category }`} style={{left:(Number.parseFloat(cpData.value*100/6).toPrecision(3))-8 + "%"}}>
                                        <div className="value-actual">{Number.parseFloat(cpData.value).toPrecision(2)}</div>
                                    </div>
                                    <div className={`bar-active category-${ cp.category }`} style={{width:Number.parseFloat(cpData.value*100/6).toPrecision(3)  + "%"}}></div>
                                    </div>
                                    {/* <div className="chart-arrow"></div> */}
                                </div>
                            );
                        })
                    :
                        [0,1,2,3,4,5,6].map((value)=>{
                            return(
                                <div className="chart-graph w-clearfix" key={"placeholder"+value}>
                                    <div className="h35">
                                        <strong className="q-category text-category-placeholder">###</strong>
                                    </div>
                                    <div className="q-icon badge-placeholder"></div>
                                    <div className="bar-wrapper actual w-clearfix">
                                    </div>
                                    {/* <div className="chart-arrow"></div> */}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className="section-3">
                <div className="h3 next">Boosterpackung</div>
                {propData.groupType == "short" 
                    ?
                    <div className="h4 next">
                        Werde ein WeQ-Champion!
                        <br/>
                        Sind Sie leidenschaftlich am Aufbau eines großartigen Teams? Und möchten WeQ-Sitzungen erleichtern?
                        <br/>
                        <br/>
                        Fragen Sie Ihren Trainer nach dem WeQ Champion-Programm oder senden Sie eine E-Mail an <a href="mailto:contact@weq.io">contact@weq.io</a>
                    </div>
                    :
                    <div className="h4 next">
                        Verlieren Sie nicht den Schwung!
                        <br/>
                        Bauen Sie mit unserer <br/>1-stündigen Nachhaltigkeits-Session gesunde Gewohnheiten auf.
                        <br/>
                        <br/>
                        Fragen Sie {propData.groupCreatorFirstName} nach weiteren Informationen.
                    </div>
                }
                <div className={`next-demo ${propData.groupType == "short" ? "short":""}`}></div>
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