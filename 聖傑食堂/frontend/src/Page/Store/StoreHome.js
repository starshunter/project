import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "../../Styles/StoreHome.css";
import Food from "../Picture/food.png";
// import Store from "../Picture/store.png";
import Product from "../Picture/product.png";
import Order from "../Picture/order.png";
import Order_now from "../Picture/order_now.png";
import Person from "../Picture/store.png";
import Main from "../Picture/store.jpg";
import { FormattedMessage } from 'react-intl';
import {NavLink} from "react-router-dom";


class StoreHome extends Component {
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
        this.cookies = new Cookies();
        this.store = this.cookies.get('store');
        this.name = this.cookies.get('name');
        // console.log('at home', this.cookies.getAll());
    }
    render() {
        return (
            <div className="Container home">
                <img className="main-store" src={Main} alt="main"></img>
                {/* <h1>主畫面</h1> */}
                
                <div className="square_container-store">
                    <div className="square-store">
                        <NavLink to="/store-add-case" className="square_link" exact strict>
                            <img className="food" src={Food} alt="food"></img>
                            <h3><FormattedMessage id="sHome.add-case" defaultMessage="新增即期品"/></h3>
                        </NavLink>
                    </div>

                    <div className="square-store">
                        <NavLink to="/store-browse-good" className="square_link" exact strict>
                            <img className="product" src={Product} alt="product"></img>
                            <h3><FormattedMessage id="sHome.browse-good" defaultMessage="現有即期品"/></h3>
                        </NavLink>
                    </div>

                    <div className="square-store">
                        <NavLink to="/store-browse-case" className="square_link" exact strict>
                            <img className="order" src={Order_now} alt="order"></img>
                            <h3><FormattedMessage id="sHome.browse-case" defaultMessage="現有媒合資訊"/></h3>
                        </NavLink>
                    </div>

                    <div className="square-store">
                        <NavLink to="/store-history" className="square_link" exact strict>
                            <img className="order" src={Order} alt="order"></img>
                            <h3><FormattedMessage id="sHome.history" defaultMessage="歷史媒合紀錄"/></h3>
                        </NavLink>
                    </div>

                    <div className="square-store">
                        <NavLink to="/store-setting" className="square_link" exact strict>
                            <img className="person" src={Person} alt="person"></img>
                            <h3>{this.store ? this.store : this.name}<FormattedMessage id="sHome.setting" defaultMessage="資料設定"/></h3>
                        </NavLink>
                    </div>
                </div>
                {/* <h1>店家主畫面</h1>
                <h2>歡迎回來 {this.store ? this.store : this.name}</h2> */}
            </div>
        );
    }
}

export default StoreHome;