import React from 'react';
import InlineCss from 'react-inline-css';

// export default class PDFTest extends React.Component {
//     render() {
//       return (
//         <InlineCss stylesheet={`
//             .Document {
//                 font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
//             }

//             @media print {
//                 .Document {
//                 display: block;
//                 border: 1px solid red;
//                 padding: 20px;
//                 }

//                 .btn { display: none; }

//                 hr { display: none; }

//                 h3 {
//                 font-size: 28px;
//                 margin-top: 0px;
//                 margin-bottom: 0px;
//                 }

//                 p {
//                 margin-top: 10px;
//                 margin-bottom: 0px;
//                 font-size: 18px;
//                 }
//             }
//         `}>
//             <div className="Document">
//             <Button>CLickMe</Button>
//             <hr />
//             <h3>{ "document.title" }</h3>
//             <p>{ "document.body" }</p>
//             </div>
//         </InlineCss>
//       );
//     }
//   }

  export const PDFTest = ({propTest}) => (
        <InlineCss stylesheet={`
            .Document {
                font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
            }

            @media print {
                .Document {
                display: block;
                border: 1px solid red;
                padding: 20px;
                }

                .btn { display: none; }

                hr { display: none; }

                h3 {
                font-size: 28px;
                margin-top: 0px;
                margin-bottom: 0px;
                }

                p {
                margin-top: 10px;
                margin-bottom: 0px;
                font-size: 18px;
                }
            }
        `}>
            <div className="Document">
            <button>CLickMe</button>
            <hr />
            <h3>{ "title" }</h3>
            <p>{ propTest.body }</p>
            </div>
        </InlineCss>
  );