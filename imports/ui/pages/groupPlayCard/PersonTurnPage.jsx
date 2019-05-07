import React from 'react';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

export default class PersonTurnPage extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let groupType = this.props.groupType;
        let personName = this.props.personName;
        if(groupType == "praise"){
            return (
            <div>
                <ul>
                    <li>{personName}: read cards 3 and 4 out loud</li>
                    <li>everyone in group will choose which card is more applicable to {personName}</li>
                </ul>
                <img src={'/img/playCard/instruction-praise.jpg'}/>
            </div>
            );
        }else if(groupType == "criticism"){
            return(
                <div>
                    <ul>
                        <li>{personName}: read cards 5, 6, and 7 out loud</li>
                        <li>everyone in group will choose which card is more applicable to {personName}</li>
                    </ul>
                    <img src={'/img/playCard/instruction-criticism.jpg'}/>
                </div>
            );
        }
    }
}
