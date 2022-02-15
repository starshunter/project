import React, { Component } from 'react';
import "../../Styles/StoreBrowseCase.css";
import CaseItem from "../../Component/CaseItem";
import { serverConn } from '../../utils';
import Cookies from 'universal-cookie';
import { FormattedMessage } from "react-intl";

class StoreBrowseGood extends Component {
    /*
    This is Store Browse Case Page, user should be able to:
        1. browse a list of issued, on going cases
        2. view detail of a case when click on the case
    */
    constructor(props) {
        super(props);
        this.state = {caseList: [], clicked: -1, detail: {}};
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.retrieveGoods();
    }
    handleClick(index) {
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

    retrieveGoods = async() => {
        let cookies = new Cookies();
        let apid = cookies.get('apid');
        let response;
        try {
            response = await serverConn('/api/store/showGoods', {apid: apid});
        } catch(error) {
            console.log('error has occurred when retrieving good from server', error);
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
                    <div className="title">
                        <h2>
                            <FormattedMessage id="sBrowseGood.cur" defaultMessage="目前剩食"/>
                        </h2>
                    </div>
                    <ul>
                        {this.state.caseList.map((item, index) => {
                            return <CaseItem caseInfo={item} onClick={item.onClick} key={index} index={index}/>;
                        })}
                    </ul>
                    {/* <div>
                        {this.state.caseList.map((item, index) => {
                            return <CaseItem store={item.store} item={item.item} time={item.time} onClick={item.onClick} class={item.class} key={index} index={index}/>;
                        })}
                    </div> */}
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


export default StoreBrowseGood;