import React, { Component } from "react";
import "../Styles/StoreNav.css";
import NavItem from "../Component/NavItem";
import { FormattedMessage } from 'react-intl';


/*
This is a fixed navigation bar located at the left of the website.
There links in the navigation bar that allow users to navigate between 
different page.
*/

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {clicked: 0};
    }

    // navSlide() {
    //     const burger = document.querySelector('.burger');
    //     const nav =  document.querySelector('.nav-links');

    // }

    render() {
        return (
            <nav className="navContainer">
                <div className="leftover">
                    <a href="/">
                        <h3>剩杰食堂</h3>
                    </a>
                </div>
                <ul className="nav-links">
                    {/* <NavItem path={"/"} text="看剩食"/> */}
                    <button onClick={() => this.props.handleLanguages('en')}>EN&nbsp;</button>
                    <button onClick={() => this.props.handleLanguages('zh')}>TW</button>
                    {/* <NavItem path={"/logout"} text="Eng" /> */}
                    <FormattedMessage id = "nav.t1" defaultMessage = "登入">
                        {msg => <NavItem path={"/login"} text={msg}/>}
                    </FormattedMessage>
                </ul>
                <div className="burger">
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
            </nav>
        );
    }
}

export default Nav;