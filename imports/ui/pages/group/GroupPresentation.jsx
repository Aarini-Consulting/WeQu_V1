import React from 'react';
import Loading from '/imports/ui/pages/loading/Loading';

import {groupTypeIsShort, groupTypeShortList} from '/imports/helper/groupTypeShort.js';
import {getPresentationUrl} from '/imports/helper/presentationUrlLoader.js';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();


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
        var groupType = this.props.group && this.props.group.groupType;
        var url = getPresentationUrl(groupType,this.props.language);

        var style;
        if(this.state.loading){
            style={width:1+"px", height:1+"px"};
        }else{
            style={width:100+"%", height:100+"%"};
        }

        if(url){
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
        }else{
            return (
                <div className="tap-content-wrapper presentation">
                    <h1><T>weq.GroupPresentation.InvalidPresentationLink</T></h1>
                </div>
            );
        }

        
    }
}
