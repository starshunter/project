import React, { Component, useRef } from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker, InfoWindow } from '@react-google-maps/api';
import "../../Styles/MainSearchCase.css";
import CaseItem from "../../Component/CaseItem";
import { serverConn } from '../../utils';
import GPS from "../../assets/icon/gps.png";
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';
import { FormattedMessage } from "react-intl";

const libraries = ['places'];

class UserBrowseCase extends Component {
    /*
    This is Store Browse Case Page, user should be able to:
        1. browse a list of issued, on going cases
        2. view detail of a case when click on the case
    */
    constructor(props) {
        super(props);
        this.state = {center_lat: null
                    , center_lng: null
                    , caseList: []
                    , clicked: -1
                    , modalOpen: false
                    , selectedCase: {}
                    , selectedMarker: null
                    , errMsg: ""
                    , redirect: false
                    , loading: false};
        this.onLoad = ref => this.searchBox = ref;
        this.containerStyle = {
            width: '100%',
            height: '100%',
        }
        this.setPosition = this.setPosition.bind(this);
        this.positionError = this.positionError.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.retrieveCases = this.retrieveCases.bind(this);
    }
    componentDidMount() {
        // console.log('try to get location');
        this.retrieveCases();
        navigator.geolocation.getCurrentPosition(this.setPosition, this.positionError, {enableHighAccuracy: true, maximumAge: 0});
    }

    // if user's position is successfully retrieved
    setPosition(pos) {
        // console.log('position', parseFloat(pos.coords.latitude), parseFloat(pos.coords.longitude));
        this.user_lat = parseFloat(pos.coords.latitude);
        this.user_lng = parseFloat(pos.coords.longitude);
        this.setState({center_lat: parseFloat(pos.coords.latitude), center_lng: parseFloat(pos.coords.longitude)});
    }

    // if user's position is failed to retrieve
    positionError(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    // handle styling change when a case is clicked
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

        this.setState({caseList: list, modalOpen: true, selectedCase: selected, center_lat: this.state.caseList[index].LaL.lat, center_lng: this.state.caseList[index].LaL.lng});
    }

    // when a case's marker is click, move the center of the map to the marker
    // and scroll the list on the right to the specific case
    handleClickMarker(index) {
        this.setState({selectedMarker: this.state.caseList[index], center_lng: this.state.caseList[index].LaL.lat, center_lng: this.state.caseList[index].LaL.lng});
    }

    // retrieve all current cases from server
    retrieveCases = async() => {
        let response;
        try {
            response = await serverConn("/api/user/showGoods", {});
        } catch(error) {
            console.log('error has occurred when retriving case form server', error);
        }
        if(response.msg === 'success') {
            this.setState({caseList: response.data}, function() {
                let list = this.state.caseList;
                for(let i=0; i<list.length; i++) {
                    list[i].onClick = () => this.handleClick(i);
                    list[i].class = '';
                    list[i].ref = React.createRef();
                }
                this.setState({caseList: list}, function() {
                    // console.log('caseList', this.state.caseList);
                });
            });
        }
        else {
            console.log('failed to retrieve information')
        }
    }

    retrieveStoreInfo = async() => {
        let response;
        try {
            response = await serverConn("/api/user/checkStore", {apid: this.state.selectedCase.apid});
        } catch(error) {
            console.log('error has occurred when retrieving store info from server', error);
        }
        if(response.msg === 'success') {
            let store = this.state.selectedCase;
            store['comment'] = response.comment;
            this.setState({selectedCase: store});
        }
        else {
            console.log('failed to retrievead store information')
        }
    }
    submitOrderForm = async() => {
        let cookies = new Cookies();
        let amount = document.getElementById('order_amount').value;
        let gid = this.state.selectedCase.id;
        let mail = cookies.get('mail');
        let apid = this.state.selectedCase.apid;
        this.setState({loading: true});
        let response;
        try {
            response = await serverConn("/api/user/order", {amount: amount, gid: gid, mail: mail, apid: apid});
        } catch(error) {
            console.log('error has occurred when sending order to server', error);
        }
        if(response.msg === 'success') {
            // this.setState({errMsg: "送出成功"});
            alert("成功送出");
            window.location.reload();
        }
        else {
            // console.log(response.msg);
            // this.setState({errMsg: "送出失敗"})
            alert("送出失敗");
            window.location.reload();
        }
    }

    render() {
        return (
            <div className="Container searchCase">
                <div className="View map-View">
                    <LoadScript
                        googleMapsApiKey="AIzaSyCpvN91mgQHeKaaQHjfKw1prGDzzdA7cO0"
                        libraries={libraries}
                    >
                        <GoogleMap
                        mapContainerStyle={this.containerStyle}
                        center={this.state.center_lat ? {lat: this.state.center_lat, lng: this.state.center_lng} : {lat: 25.0329694, lng: 121.5654177}}
                        zoom={this.state.center_lat ? 18 : 13}
                        >
                            <></>
                            <Modal
                                isOpen={this.state.modalOpen}
                                onAfterOpen={this.retrieveStoreInfo}
                                ariaHideApp={false}
                                onRequestClose={() => this.setState({modalOpen: false})}
                                style={{content: {height: '80%', width: '80%', margin: 'auto'}}}
                            >
                                <div className="modal-paragragh">
                                    <p><FormattedMessage id="uSearch.name" defaultMessage="店家 ： "/>{this.state.selectedCase.store}</p>
                                    <p><FormattedMessage id="uSearch.addr" defaultMessage="地址 ： "/>{this.state.selectedCase.address}</p>
                                    <p><FormattedMessage id="uSearch.food" defaultMessage="食品 ： "/>{this.state.selectedCase.item}</p>
                                    <p><FormattedMessage id="uSearch.qty" defaultMessage="數量 ： "/>{this.state.selectedCase.amount}</p>
                                    <p><FormattedMessage id="uSearch.price" defaultMessage="單位價格 ： "/>{this.state.selectedCase.price}</p>
                                    <p><FormattedMessage id="uSearch.deadline" defaultMessage="截止時間 ： "/>{this.state.selectedCase.due}</p>
                                </div>
                                {/* <div>店家評價 ： {(this.state.selectedCase.comment && this.state.selectedCase.comment.length) ? this.state.selectedCase.comment.map((item, index) => {
                                    return <p key={index}>{item.stars}{item.text}</p>
                                }) : <p>no comment</p>}</div> */}
                                <form>
                                    <label>
                                        <FormattedMessage id="uSearch.qty2" defaultMessage="數量"/>
                                    </label>
                                    <input type="number" min="1" max={this.state.selectedCase.amount} id="order_amount"></input>
                                    <p>{this.state.errMsg}</p>
                                    <button type="button" onClick={this.submitOrderForm} disabled={this.state.loading}>
                                        <FormattedMessage id="uSearch.submit" defaultMessage="送出"/>
                                    </button>
                                </form>
                                <button onClick={() => this.setState({modalOpen: false, errMsg: ""})} disabled={this.state.loading}>
                                    <FormattedMessage id="uSearch.close" defaultMessage="關閉"/>
                                </button>
                            </Modal>
                            {
                                this.state.center_lat ?
                                <Marker position={{lat: this.user_lat, lng: this.user_lng}} icon={{url: GPS, scaledSize: {height: 40, width: 40}, fillColor: '#FF0000'}}/>
                                :
                                <></>
                            }
                            {
                                this.state.caseList.length ?
                                this.state.caseList.map((item, index) => {
                                    // console.log(item.LaL);
                                    return <Marker position={{lat: item.LaL.lat, lng: item.LaL.lng}} onClick={() => this.handleClickMarker(index)} key={index}/>
                                })
                                :
                                <></>
                            }
                            {this.state.selectedMarker ?
                            <InfoWindow 
                                position={{lat: this.state.selectedMarker.LaL.lat, lng: this.state.selectedMarker.LaL.lng}}
                                onCloseClick={() => this.setState({selectedMarker: null})}
                            >
                                <>
                                    <p>{this.state.selectedMarker.store}</p>
                                    <p><FormattedMessage id = "uSearch.phone" defaultMessage="電話："/>{this.state.selectedMarker.phone}</p>
                                    <p><FormattedMessage id = "uSearch.addr2" defaultMessage="地址："/>{this.state.selectedMarker.address}</p>
                                </>
                            </InfoWindow>
                            :
                            <></>}
                        </GoogleMap>
                    </LoadScript>
                </div>
                   
                <div className="View cases-View-MainSearch">
                    <ul>
                        {this.state.caseList.map((item, index) => {
                            return <CaseItem caseInfo={item} onClick={item.onClick} class={item.class} key={index} index={index}/>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}


export default UserBrowseCase;
