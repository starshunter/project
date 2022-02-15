import React, { Component } from "react";
import "../Styles/StoreNav.css";
import NavItem from "../Component/NavItem";
import { FormattedMessage } from "react-intl";

/*
This is a fixed navigation bar located at the left of the website.
There links in the navigation bar that allow users to navigate between 
different page.
*/

class UserNav extends Component {
    constructor(props) {
        super(props);
        this.state = {clicked: 0};
    }
    render() {
        return (
            <nav className="navContainer">
                <div className="leftover">
                    <a href="/">
                        <h3>剩杰食堂</h3>
                    </a>
                </div>
                <ul className="nav-links">
                    {/* <button>English|</button> */}
                    <button onClick={() => this.props.handleLanguages('en')}>EN&nbsp;</button>
                    <button onClick={() => this.props.handleLanguages('zh')}>TW</button>
                    {/* <NavItem path={"/logout"} text="Eng" /> */}
                    <FormattedMessage id ="nav.t2" defaultMessage="登出">
                        {msg => <NavItem path={"/logout"} text={msg} handleLogout={this.props.handleLogout} />}
                    </FormattedMessage>
                </ul>
                {/* <button onClick={this.props.handleLogout}>登出</button> */}
                <div className="burger">
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
            </nav>
        );
    }
}

export default UserNav;