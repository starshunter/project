import './App.css';
import Home from './Page/Common/Home';
import Login from './Page/Common/Login';
import SearchCase from './Page/Common/SearchCase';

import StoreHistory from './Page/Store/StoreHistory';
import StoreSetting from './Page/Store/StoreSetting';
import StoreAddCase from './Page/Store/StoreAddCase';
import StoreBrowseCase from './Page/Store/StoreBrowseCase';
import StoreBrowseGood from './Page/Store/StoreBrowseGood';
import StoreHome from './Page/Store/StoreHome';

import StoreNav from './Container/StoreNav';
import UserNav from './Container/UserNav';
import Nav from './Container/Nav';

import UserHistory from './Page/User/UserHistory';
import UserSetting from './Page/User/UserSetting';
import UserBrowseCase from './Page/User/UserBrowseCase';
import UserSearchCase from './Page/User/UserSearchCase';
import UserMatchCase from './Page/User/UserMatchCase';
import UserHome from './Page/User/UserHome';

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { Component } from 'react';
import Cookies from 'universal-cookie';

import { IntlProvider } from "react-intl";
import zh_tw from './i18n/zh_tw.js';
import en_us from './i18n/en_us.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.authenticated = 0;
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLanguages = this.handleLanguages.bind(this);
        this.cookies = new Cookies();
        // console.log('inside APP', this.cookies.get('mail'));
        if(this.cookies.get('mail') !== undefined) {
            if(this.cookies.get('type') === 'store') {
                this.authenticated = 1
            }
            else {
                this.authenticated = 2;
            }
        }
        this.state = {
            authenticated: this.authenticated,
            locale: JSON.parse(localStorage.getItem('locale')) || navigator.language
        };
    }

    handleLogin(type) {
        let cookies = new Cookies();
        if(type === 'store') {
            cookies.set('type', 'store');
            this.setState({authenticated: 1}, function() {
                // console.log('authenticated now is ', this.state.authenticated);
            });
        }
        else {
            cookies.set('type', 'user');
            this.setState({authenticated: 2}, function() {
                // console.log('authenticated now is ', this.state.authenticated);
            });
        }
    }

    handleLogout() {
        // var cookies = new Cookies();
        // var allCookies = cookies.getAll();
        this.clearCookies();
        this.setState({authenticated: 0});
    }

    setCookies(obj) {
        var cookies = new Cookies();
        for(let prop in obj) {
            // console.log(prop, obj[prop]);
            if(prop !== 'msg') {
                cookies.set(String(prop), obj[prop]);
            }
        }
    }

    clearCookies() {
        var cookies = new Cookies();
        var obj = cookies.getAll();
        for(let prop in obj) {
            cookies.remove(String(prop), obj[prop]);
        }
    }

    handleLanguages(lang){
        this.setState({locale: lang},() => {
            localStorage.setItem('locale', JSON.stringify(this.state.locale))
        });
    }


    render() {
        // console.log(this.state.locale);
        let messages;
        if (this.state.locale.includes('zh')) {
            messages = zh_tw;
        } 
        else {
            messages = en_us;
        }
        return (
            <IntlProvider locale={this.state.locale} key={this.state.locale} messages={messages}>
                <Router>
                    <div className="App">
                        {!this.state.authenticated ? 
                        <>
                            <Nav handleLanguages={this.handleLanguages}/>
                            <Switch>
                                <Route path="/" exact>
                                    <SearchCase />
                                </Route>
                                <Route path="/login">
                                    <Login handleLogin={this.handleLogin} setCookies={this.setCookies} handleLanguages={this.handleLanguages}/>
                                </Route>
                            </Switch>
                            <Redirect from="/logout" to="/"/>
                        </>
                        :
                        <>
                            {this.state.authenticated === 1 ?
                                <>
                                    <StoreNav handleLogout={this.handleLogout} handleLanguages={this.handleLanguages}/>
                                    <Switch>
                                        {/* <Route path="/" exact foo={this.handleLogout} component={Home}/> */}
                                        <Route path="/" exact>
                                            <StoreHome/>
                                        </Route>
                                        <Route path="/store-history" component={StoreHistory}/>
                                        <Route path="/store-setting">
                                            <StoreSetting setCookies={this.setCookies}/>
                                        </Route>
                                        <Route path="/store-add-case" component={StoreAddCase}/>
                                        <Route path="/store-browse-case" component={StoreBrowseCase}/>
                                        <Route path="/store-browse-good" component={StoreBrowseGood} />
                                        <Redirect from="/logout" to="/"/>
                                        <Redirect from="/login" to="/" />
                                    </Switch>
                                </>
                                :
                                <>
                                    <UserNav handleLogout={this.handleLogout} handleLanguages={this.handleLanguages}/>
                                    <Switch>
                                        <Route path="/" exact>
                                            <UserHome />
                                        </Route>
                                        <Route path="/user-history" component={UserHistory}/>
                                        <Route path="/user-setting">
                                            <UserSetting setCookies={this.setCookies}/>
                                        </Route>
                                        <Route path="/user-browse-case" component={UserBrowseCase}/>
                                        <Route path="/user-search-case" component={UserSearchCase} exact/>
                                        <Route path="/user-search-case/:id?" component={UserMatchCase}/>
                                        <Redirect from="/logout" to="/"/>
                                        <Redirect from="/login" to="/" />
                                    </Switch>
                                </>
                            }
                        </>
                        }
                        {
                            this.authenticated ?
                            <></>
                            :
                            <Redirect to="/" />
                        }
                    </div>
                </Router>
            </IntlProvider>
        );
    }
}

export default App;

// import React from 'react';
// import './App.css';
// import { Todopage } from './Page/Todopage';

// function App(){
//     return (
//         <div className="App">
//             <Todopage />
//         </div>
//     );
// }

// export default App;