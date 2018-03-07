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
            typeformEmbed.makeWidget(el, "https://oh2.typeform.com/to/mrH6fP", {
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
  