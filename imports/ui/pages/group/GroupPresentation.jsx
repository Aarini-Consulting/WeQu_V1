import React from 'react';
import Loading from '/imports/ui/pages/loading/Loading';

import {groupTypeIsShort} from '/imports/helper/groupTypeShort.js';

export default class GroupPresentation extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.presentationRef = React.createRef();
        this.state={
          loading:true,
          loadedOnce:false
        }
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentDidUpdate(){
        if(this.props.display){
            if(this.presentationRef && this.presentationRef.current){
                var presentationDOM = this.presentationRef.current;
                var activeElement = document.activeElement;

                var isFocused = (activeElement === presentationDOM);

                if(!isFocused){
                    presentationDOM.focus();
                }
            }
        }
    }

    componentDidMount(){
        //if frame is still not loaded after 5 secs, show it on the screen anyway so that user can see what the problem is
        setTimeout(() => {
            this.frameIsLoaded();
        },10000); 
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
        var shortGroup = this.props.group && groupTypeIsShort(this.props.group.groupType);
        switch(this.props.language){
            case "nl":
                if(shortGroup){
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vRx9BnajREdaAg9t0ftJOM1YhtwrbcKs-vAGGge-HO4Hx7uSS1T4Qf9fAUKftFzN71fqne4eowr8QvV/embed?start=false&loop=false&delayms=3000";
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vQspkT7RaUB2ctimmizxRomjyeYuyCNs9iGdDNdq3puBsmq258tLbqe5qlxcYl256Mg7ToB-G1cix6R/embed?start=false&loop=false&delayms=3000";
                }
                break;
            case "fr":
                if(shortGroup){
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vR1AyItUfC3CT2LQB7RzyOerpmsalSUj2Ev7aTa9ahraLDlk1fuAb4Sa4OfCtH32J49b4zd0qdXTHOj/embed?start=false&loop=false&delayms=3000";
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vRAOs2duKEHmQ49qg-wha7P6HjjVWfNoZy_ZUVi8Xq9ViUpHvo-rFc5CFDYwbNTLJ3y1F9j0GiJMZdp/embed?start=false&loop=false&delayms=3000";
                }
                break;
            case "de":
                if(shortGroup){
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vTX1NjseqjQ0YEwa3YK2WbVcZB0tAR99pTEfMYZn6HtNhgXxRhp9IpAyjnLIk5-NoO_vlmhaNic1UWq/embed?start=false&loop=false&delayms=3000";
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vR3das6J8UVMR6Kf2XlDKupJXqAvTR7rK8NGnvGuzeyMjabsu1zGuNhMmmQu_Uv5HIPoc9hjBjSaNRP/embed?start=false&loop=false&delayms=3000";
                }   
                break;
            default:
                if(shortGroup){
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vRS3I0zHq194L-ovan3W_Cfe8eD29_yypYi5VVFWwj89yp3mpgpyDBrcBBUcMn1sorVKFFBH6X2TYWP/embed?start=false&loop=false&delayms=3000";
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000";
                }
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
                ref={this.presentationRef}
                src={url} 
                frameBorder="0" allowFullScreen="true" style={style}
                onLoad={this.frameIsLoaded.bind(this)}>
                </iframe>
            </div>
        );
    }
}
