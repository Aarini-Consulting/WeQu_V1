import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class NotFound extends React.Component {
    render() {
      return (
        <div className="fillHeight weq-bg">
            <div className="w-block noselect">
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    404
                </div>
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    We can't find what you are looking for.
                </div>
                <div className="font-rate loading-font loading-text-top padding-wrapper">
                    Would you like to go <Link to="/">Home</Link> instead?
                </div>
            </div>
        </div>
      );
    }
  }
  