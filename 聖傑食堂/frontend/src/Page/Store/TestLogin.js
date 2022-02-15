import React, { Component } from 'react';

class TestLogin extends Component {
    /*
    This is Home Page, should implement:
        1. Purpose (text)
        2. Guiadance (text)
        3. Developer intro (text)
        4. Sing in (feature)
            mail, password
        5. Sign up (feature)
            5.1 Store sign up
            5.2 Customer sign up
    */
   constructor(props) {
       super(props);
   }
    render() {
        return (
            <div>
                <h1>Home Page</h1>
                <button onClick={this.props.handleLogin}>login</button>
            </div>
        );
    }
}

export default TestLogin;