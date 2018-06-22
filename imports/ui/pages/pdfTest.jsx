import React from 'react';
import InlineCss from 'react-inline-css';
import style from './pdfTestStyle.css';

export const PDFTest = ({propTest}) => (
    <InlineCss stylesheet={style}>
        <div className="Document">
        <button>CLickMe</button>
        <hr />
        <h3>{ "title" }</h3>
        <p>{ propTest.body }</p>
        </div>
    </InlineCss>
);