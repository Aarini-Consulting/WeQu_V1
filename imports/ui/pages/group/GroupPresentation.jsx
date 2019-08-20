import React from 'react';
import Loading from '/imports/ui/pages/loading/Loading';

import {groupTypeIsShort, groupTypeShortList} from '/imports/helper/groupTypeShort.js';


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
        var groupType = this.props.group && this.props.group.groupType;
        var shortGroup = groupType && groupTypeIsShort(groupType);
        shortGroupUrl = {};
        switch(this.props.language){
            case "nl":
                if(shortGroup){
                    //praise-criticism
                    shortGroupUrl[groupTypeShortList[0]] = "https://docs.google.com/presentation/d/e/2PACX-1vRx9BnajREdaAg9t0ftJOM1YhtwrbcKs-vAGGge-HO4Hx7uSS1T4Qf9fAUKftFzN71fqne4eowr8QvV/embed?start=false&loop=false&delayms=3000";
                    //praise
                    shortGroupUrl[groupTypeShortList[1]] = "https://docs.google.com/presentation/d/e/2PACX-1vQqb-3-uYBXKn3RYJy4L8QtoEIWxVQ7N9h1klSRYUxODaYASpBFhFeZczWBgCTc_ITvI7B-DiMyAfwn/embed?start=false&loop=false&delayms=3000";
                    //criticism
                    shortGroupUrl[groupTypeShortList[2]] = "https://docs.google.com/presentation/d/e/2PACX-1vRXW1IPp6vXkSHdE1g8-Jyy7846sNh9G966aNprXBnNhMsy8-EcgUtpnFks4kdRz_G9-DuxrywGY1Mm/embed?start=false&loop=false&delayms=3000";
                    url = shortGroupUrl[groupType];
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vQspkT7RaUB2ctimmizxRomjyeYuyCNs9iGdDNdq3puBsmq258tLbqe5qlxcYl256Mg7ToB-G1cix6R/embed?start=false&loop=false&delayms=3000";
                }
                break;
            case "fr":
                if(shortGroup){
                    //praise-criticism
                    shortGroupUrl[groupTypeShortList[0]] = "https://docs.google.com/presentation/d/e/2PACX-1vR1AyItUfC3CT2LQB7RzyOerpmsalSUj2Ev7aTa9ahraLDlk1fuAb4Sa4OfCtH32J49b4zd0qdXTHOj/embed?start=false&loop=false&delayms=3000";
                    //praise
                    shortGroupUrl[groupTypeShortList[1]] = "https://docs.google.com/presentation/d/e/2PACX-1vSLqABcfyY_8iGNuLsMoT5zd5l0DYLcdK9EA0WWO4mSKe-f2qEDBqvP0Ri8pJh9wE-kFUH_BYQpi76n/embed?start=false&loop=false&delayms=3000";
                    //criticism
                    shortGroupUrl[groupTypeShortList[2]] = "https://docs.google.com/presentation/d/e/2PACX-1vQ_yEt9_0AM2moSNzbMyslyPI0wNmL01jpjDl8zOj--DUsQQxneflOrvBEbfYjDQxPgaSm_B36iHwC6/embed?start=false&loop=false&delayms=3000";
                    url = shortGroupUrl[groupType];
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vRAOs2duKEHmQ49qg-wha7P6HjjVWfNoZy_ZUVi8Xq9ViUpHvo-rFc5CFDYwbNTLJ3y1F9j0GiJMZdp/embed?start=false&loop=false&delayms=3000";
                }
                break;
            case "de":
                if(shortGroup){
                    //praise-criticism
                    shortGroupUrl[groupTypeShortList[0]] = "https://docs.google.com/presentation/d/e/2PACX-1vTX1NjseqjQ0YEwa3YK2WbVcZB0tAR99pTEfMYZn6HtNhgXxRhp9IpAyjnLIk5-NoO_vlmhaNic1UWq/embed?start=false&loop=false&delayms=3000";
                    //praise
                    shortGroupUrl[groupTypeShortList[1]] = "https://docs.google.com/presentation/d/e/2PACX-1vSOuhvOpmywyHN34TsGKhN-7J0r0Q6pXEF-23bnLoN3ik4TBRa4MzLnj0RYZS_7e6UqGJjlbu5F-RSp/embed?start=false&loop=false&delayms=3000";
                    //criticism
                    shortGroupUrl[groupTypeShortList[2]] = "https://docs.google.com/presentation/d/e/2PACX-1vT_uyWBpKk9kLFee71IV9X1yfRjEDt68doH0xkWZSaypLmUz8NHyQo1HtK94sF-F7BYcyutyapEcrU3/embed?start=false&loop=false&delayms=3000";
                    url = shortGroupUrl[groupType];
                }else{
                    url = "https://docs.google.com/presentation/d/e/2PACX-1vR3das6J8UVMR6Kf2XlDKupJXqAvTR7rK8NGnvGuzeyMjabsu1zGuNhMmmQu_Uv5HIPoc9hjBjSaNRP/embed?start=false&loop=false&delayms=3000";
                }   
                break;
            default:
                if(shortGroup){
                    //praise-criticism
                    shortGroupUrl[groupTypeShortList[0]] = "https://docs.google.com/presentation/d/e/2PACX-1vRS3I0zHq194L-ovan3W_Cfe8eD29_yypYi5VVFWwj89yp3mpgpyDBrcBBUcMn1sorVKFFBH6X2TYWP/embed?start=false&loop=false&delayms=3000";
                    //praise
                    shortGroupUrl[groupTypeShortList[1]] = "https://docs.google.com/presentation/d/e/2PACX-1vSa8BbPmjSvEK9xOb1ze2iwbH06Nl0SqM0cqGkP1JOiZOnrW4LPMO2-7T6CSAIPkTwHHT831OfVvKlH/embed?start=false&loop=false&delayms=3000";
                    //criticism
                    shortGroupUrl[groupTypeShortList[2]] = "https://docs.google.com/presentation/d/e/2PACX-1vQiMa68c0KyzcDzQ_Sx2Ow6ot6xJpICneGlUXP_vJpyUp81YrvBHvSI8XdArLzQJFTByWz7RkqXzfGW/embed?start=false&loop=false&delayms=3000";
                    url = shortGroupUrl[groupType];
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
