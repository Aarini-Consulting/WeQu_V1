import React from 'react';
import Loading from '/imports/ui/pages/loading/Loading';

export default class GroupPresentation extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state={
          loading:true,
          loadedOnce:false
        }
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentDidMount(){
        //if frame is still not loaded after 5 secs, show it on the screen anyway so that user can see what the problem is
        setTimeout(() => {
            this.frameIsLoaded();
        },10000); 
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.loading && nextState.loading == false){
            return true;
        }else{
            return false;
        }
    }

    frameIsLoaded(){
        if(this.mounted && this.state.loading && !this.state.loadedOnce){
            this.setState({
                loading:false,
                loadedOnce:true
            });
            this.props.frameIsLoaded()
        }
    }

    componentWillUnmount() {
        this.mounted = false;
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

        var style;
        if(this.state.loading){
            style={width:1+"px", height:1+"px"};
        }else{
            style={width:100+"%", height:100+"%"};
        }

        return (
            <div className="tap-content-wrapper presentation">
                {/* <iframe src={url}
                style={{width:100+"%", height:100+"%"}}></iframe> */}
            {this.state.loading &&
                <Loading/>
            }
            <iframe 
            ref="presentation"
            src={`https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000`} 
            frameBorder="0" allowFullScreen="true" style={style}
            onLoad={this.frameIsLoaded.bind(this)}>
            </iframe>
            </div>
        );
    }
}
