import React, { Component } from 'react';
import CaseItem from "../../Component/CaseItem";
import "../../Styles/StoreBrowseCase.css";
import Cookies from 'universal-cookie';
import { serverConn } from '../../utils';
import { FormattedMessage } from "react-intl";

class UserHistory extends Component {
    /*
    This is StoryHistory Page, should implement:
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
        this.state = {caseList: [], clicked: -1, detail: {}};
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.retrieveHistory();
    }
    handleClick(index) {
        // console.log('trigger on click', index);
        var list = this.state.caseList;
        var selected;
        for(let i=0; i<list.length; i++) {
            if(i !== index) {
                list[i].class = "";
            }
            else {
                list[i].class = "clicked";
                selected = list[i];
            }
        }
        this.setState({caseList: list, detail: selected});
    }
    retrieveHistory = async() => {
        var cookies = new Cookies();
        let mail = cookies.get('mail');
        let response;
        try {
            response = await serverConn('/api/user/showHistoryCase', {mail: mail});
        } catch(error) {
            console.log('error has occurred when retrieving history from server', error);
        }
        if(response.msg === 'success') {
            this.setState({caseList: response.data}, function() {
                let list = this.state.caseList;
                for(let i=0; i<list.length; i++) {
                    list.onClick = this.handleClick();
                }
                this.setState({caseList: list})
            })
        }
    }
    render() {
        return (
            <div className="Container browseCase">
                <div className="View cases-View-browse">
                    <div>
                        <h2><FormattedMessage id="uHist.history" default_message="歷史訂單記錄"/></h2> 
                    </div>
                    <ul>
                        {this.state.caseList.map((item, index) => {
                            return <CaseItem caseInfo={item} onClick={item.onClick} class={item.class} key={index} index={index}/>;
                        })}
                    </ul>
                </div>
                {/* <div className="View detail-View">
                    <h2>媒合資訊詳細資料</h2>
                    <div>
                        <h3>{this.state.detail.store}</h3>
                        <p>{this.state.detail.item}</p>
                        <p>{this.state.detail.time}</p>
                    </div>
                </div> */}
            </div>
        );
    }
}

export default UserHistory;