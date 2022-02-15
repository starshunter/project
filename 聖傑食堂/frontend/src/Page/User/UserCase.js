import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";

class UserCase extends Component {
    /*
    This is User Case Page, should implement:
        1. User Case Browse Page
            1.1 User Case Details Page
        2. User Case Search Page
            2.1 User Search Result Page
            2.2 User Result Page
            2.3 User Pay Page
    */
    render() {
        return (
            <div>
                <h1><FormattedMessage id="uCase.case" defaultMessage="User Case"/></h1>
            </div>
        );
    }
}

export default UserCase;