import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import * as typeformEmbed from '@typeform/embed';

import Menu from '/imports/ui/pages/menu/Menu';

export default class NotFound extends React.Component {
    componentDidMount(){
        var el = ReactDOM.findDOMNode(this.refs.typeform);

        if(el){
            //   When instantiating a widget embed, you must provide the DOM element
            //   that will contain your typeform, the URL of your typeform, and your
            //   desired embed settings
            var typeformUrl;
            if(window.location.hostname == "app.weq.io"){
              //production
              typeformUrl="https://oh2.typeform.com/to/oLBtn6";
            }else{
              //test
              typeformUrl="https://oh2.typeform.com/to/xPDY7T"
            }
            typeformEmbed.makeWidget(el, typeformUrl, {
                hideFooter: true,
                hideHeaders: true,
                opacity: 0,
                onSubmit:this.props.onSubmitCallback
            });
        }
    }
    
    render() {
      return (
        <div className="fillHeight">
          <section style={{height:100+"%"}}ref="typeform">
          </section>
        </div>
      );
    }
  }
  