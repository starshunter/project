import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class UserMatchCase extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
    }
    render() {
        return (
            <div>
                <FormattedMessage id="uMatch.title" defaultMessage="this is matching page with case id"/>  {this.id}
            </div>
        );
    }
}

export default UserMatchCase;