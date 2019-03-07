import React from 'react';
import GroupQuizResult from '/imports/ui/pages/groupQuiz/GroupQuizResult';
import GroupQuizResultGraphVerticalBar from '/imports/ui/pages/groupQuizResult/GroupQuizResultGraphVerticalBar';

export const GroupQuizReportPdf = ({propData}) => (
    <html>
        <head>
            <meta charSet="UTF-8"/>
        </head>
        <body>
            <div className="a4-wrapper">
            <GroupQuizResultGraphVerticalBar data={[
            {amount:50, text:"red"},
            {amount:100, text:"teal"},
            {amount:125, text:"yellow"},
            {amount:75, text:"purple"},
            {amount:25, text:"green"}
        ]} isEmpty={true}/>
            {/* <GroupQuizResult
                selectedQuiz={propData.selectedQuiz}
                selectedQuizResult={propData.selectedGroupQuizDataList}/> */}
            </div>
        </body>
    </html>
);