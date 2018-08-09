import React,{ Component } from 'react';

// Terms component - show term of use of the app
export default class Loading extends Component {
    constructor(props){
        super(props);

        this.state={
            elapsed:0
        }
    }

    componentDidMount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:

        this.timer = setInterval(this.tick.bind(this), 50);
    }

    componentWillUnmount(){
        // componentDidMount is called by react when the component 
        // has been rendered on the page. We can set the interval here:

        clearInterval(this.timer);
    }

    tick(){
        // This function is called every 50 ms. It updates the 
        // elapsed counter. Calling setState causes the component to be re-rendered
        if(this.state.elapsed < Number(this.props.wait)){
             this.setState({elapsed: new Date() - this.props.start});
        }
        else{
            clearInterval(this.timer);
        }
    }

    render() {
      if(this.state.elapsed >= Number(this.props.wait)){
          return (
            <div className="fillHeight weq-bg">
              <div className="w-block noselect">
                  <div className="font-rate padding-wrapper">
                      Please wait...
                  </div>
              </div>
            </div>
          );
      }else{
          return false; 
      }
    }
}

Loading.defaultProps = {
    start:new Date(),
    wait:2500,
};
