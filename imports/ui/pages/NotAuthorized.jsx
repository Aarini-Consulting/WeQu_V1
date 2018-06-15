import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class NotAuthorized extends React.Component {
    render() {
      return (
        <div className="fillHeight weq-bg">
            <div className="w-block noselect">
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    401
                </div>
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                   Authentication failure
                </div>
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    Would you like to go <Link to="/">Home</Link> instead?
                </div>
            </div>
        </div>
      );
    }
  }
  