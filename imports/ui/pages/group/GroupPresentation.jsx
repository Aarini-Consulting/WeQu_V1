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
        }else if(this.props.language != nextProps.language){
            return true;
        }
        else{
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
                url = "https://docs.google.com/presentation/d/e/2PACX-1vQspkT7RaUB2ctimmizxRomjyeYuyCNs9iGdDNdq3puBsmq258tLbqe5qlxcYl256Mg7ToB-G1cix6R/embed?start=false&loop=false&delayms=3000";
                break;
            case "fr":
                url = "https://docs.google.com/presentation/d/e/2PACX-1vRAOs2duKEHmQ49qg-wha7P6HjjVWfNoZy_ZUVi8Xq9ViUpHvo-rFc5CFDYwbNTLJ3y1F9j0GiJMZdp/embed?start=false&loop=false&delayms=3000";
                break;
            default:
                url = "https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000";
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
                {this.state.loading &&
                    <Loading/>
                }
                <iframe 
                ref="presentation"
                src={url} 
                frameBorder="0" allowFullScreen="true" style={style}
                onLoad={this.frameIsLoaded.bind(this)}>
                </iframe>
            </div>
        );
    }
}
