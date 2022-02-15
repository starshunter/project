import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "../../Styles/StoreHome.css";
import Plate from "../Picture/plate.png";
// import Store from "../Picture/store.png";
import Product from "../Picture/product.png";
import Order from "../Picture/order.png";
import Person from "../Picture/person.png";
import Main from "../Picture/main.jpg";
import { FormattedMessage } from 'react-intl';


class Home extends Component {
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
        console.log('at home', this.cookies.getAll());
    }
    render() {
        return (
            <div className="Container home">
                
                <img class="main" src={Main} alt="main"></img>
                {/* <h1>主畫面</h1> */}
                
                <div class="square_container">
                    <div class="square">
                        <a class="square_link" href="/user-browse-case">
                            <img class="plate" src={Plate} alt="plate"></img>
                            <h3>
                                查詢即期品
                            </h3>
                        </a>
                    </div>

                    <div class="square">
                        <a class="square_link" href="/user-search-case"> 
                        {/* href to be modified  */}
                            <img class="product" src={Product} alt="product"></img>
                            <h3>預定/追蹤的即期品</h3>
                        </a>
                    </div>

                    <div class="square">
                        <a class="square_link" href="/user-history"> 
                            <img class="order" src={Order} alt="order"></img>
                            <h3>歷史訂單紀錄</h3>
                        </a>
                    </div>

                    <div class="square">
                        <a class="square_link" href="/user-setting">
                            <img class="person" src={Person} alt="person"></img>
                            <h3>{this.store ? this.store : this.name} 資料設定</h3>
                        </a>
                    </div>
                </div>
                
            </div>

        );
    }
}




export default Home;