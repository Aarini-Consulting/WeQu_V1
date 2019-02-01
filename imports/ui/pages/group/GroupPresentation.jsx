import React from 'react';
import ReactDOM from 'react-dom';

export default class GroupPresentation extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        var url;

        switch(this.props.language){
            case "nl":
                url = "https://drive.google.com/file/d/1RdIxRawJ4Rne7xugygutcSzyBgEIQMGV/preview";
                break;
            case "fr":
                url = "https://drive.google.com/file/d/1pyMgL8MADUZJib4_Xb_SmmxIJuQFky9R/preview";
                break;
            default:
                url = "https://drive.google.com/file/d/1cETRcvpSpMJJ_xnthyFltyXJz19ZYA_x/preview";
                break;
        }

        return (
            <div className="tap-content-wrapper presentation">
                {/* <iframe src={url}
                style={{width:100+"%", height:100+"%"}}></iframe> */}

            <iframe 
            ref="presentation"
            src={`https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000`} 
            frameBorder="0" allowFullScreen="true" style={{width:100+"%", height:100+"%"}}>
            </iframe>
            </div>
        );
    }
}
