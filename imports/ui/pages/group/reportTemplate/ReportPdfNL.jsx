import React from 'react';

export const ReportPdfNL = ({propData}) => (
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
            <h1 className="h1">Hoi</h1>
            <h1 className="h1 username">{propData.firstName},</h1>
            <h3 className="h3 subtitle">
            U heeft net WeQ met uw <strong>{propData.groupName}</strong> Team gespeeld. 
            Dit is uw rapport die door <strong>{propData.groupCreatorFirstName}&nbsp;{propData.groupCreatorLastName}</strong> WeQ Master Coach is opgesteld.
            </h3>
            </div>
            <div className="section _2-content">
            <div className="div-howtoread">
                {/* <div className="box monitor w-clearfix">
                <div className="h4 monitor">Monitor your progress each <br/>time you play</div>
                <div className="arrow-monitor"></div>
                </div> */}
                {/* <div className="pointer"></div> */}
                <div className="h3 title-1">Hoe u deze graﬁek moet lezen</div>
                <div className="bar-wrapper w-clearfix">
                {/* <div className="arrow"></div> */}
                <div className="bar-howto">De laagste waarde <br/> van deze Kwaliteit in uw groep</div>
                <div className="bar-howto _3">Uw huidige score<br/>(beoordeeld door u en anderen)</div>
                {/* <div className="bar-howto _4">Changes from <br/>previous session</div> */}
                <div className="bar-howto _2">De hoogste waarde <br/> van deze Kwaliteit in uw groep</div>
                {/* <div className="quality-name number">+1,4</div> */}
                <div className="quality-name">Kwaliteitsnaam (Kaart #)</div>
                <div className="bar-team">
                    <div className="bar-line"></div>
                </div>
                <div className="bar-value category-leadership" style={{left:45 + "%"}}>3.0</div>
                <div className="bar-active category-leadership" style={{width:50 + "%"}}></div>
                </div>
            </div>
            <div className="div-current w-clearfix">
                <div className="h3 current">Huidige Sessie - {propData.firstName} {propData.lastName}</div>
                <div className="div-diagram">
                <div className="h4 current">Op basis van uw eigen gegevens en feedback van anderen in uw team, personaliseert het WeQsysteem uw sessie.</div>
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
                    left:(-100+((propData.cardPickedData[0].maxValue-propData.cardPickedData[0].minValue)*100/6)+((propData.cardPickedData[0].minValue)*200/6)) + "%",
                    width:Number.parseFloat((propData.cardPickedData[0].maxValue-propData.cardPickedData[0].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                    width:Number.parseFloat((propData.cardPickedData[1].maxValue-propData.cardPickedData[1].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                        <strong className={`q-category text-category-${ propData.cardPicked[2].category }`}>{propData.cardPicked[2].subCategory.replace("_", " ")}&nbsp;({propData.cardPicked[2].cardId})</strong></div>
                    <div className={`q-icon badge-${ propData.cardPicked[2].subCategory }`}></div>
                    <div className="bar-wrapper actual w-clearfix">
                    <div className="bar-team actual" style={{
                    left:(-99+((propData.cardPickedData[2].maxValue-propData.cardPickedData[2].minValue)*100/6)+((propData.cardPickedData[2].minValue)*200/6)) + "%",
                    width:Number.parseFloat((propData.cardPickedData[2].maxValue-propData.cardPickedData[2].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                    width:Number.parseFloat((propData.cardPickedData[3].maxValue-propData.cardPickedData[3].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                    width:Number.parseFloat((propData.cardPickedData[4].maxValue-propData.cardPickedData[4].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                    width:Number.parseFloat((propData.cardPickedData[5].maxValue-propData.cardPickedData[5].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                    width:Number.parseFloat((propData.cardPickedData[6].maxValue-propData.cardPickedData[6].minValue)*100/6).toPrecision(3) - 3 + "%"}}>
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
                <div className="h3 next">Onderhoudssessies</div>
                <div className="h4 next">
                    Verlies het momentum niet!
                    <br/>
                    Ga verder met het onderhoudsprogramma van 1 uur om gezonde gewoontes te creëren.
                    <br/>
                    <br/>
                    Stel uw vraag aan {propData.groupCreatorFirstName}  voor meer informatie!
                </div>
                <div className="next-demo nl"></div>
            </div>
            </div>
            <div className="section _3-footer">
            <div className="weq-logo"></div>
            <div className="footer">WeQ - Nothing beats a kick-ass team  |  Copyright 2018 WeQ B.V. | www.WeQ.io</div>
            </div>
        </div>
        </body>
    </html>
);