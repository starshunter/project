import React, { Component } from 'react';
import "../../Styles/StoreAddCase.css";
import FormCaseItem from "../../Component/FormCaseItem";
import { FormattedMessage } from "react-intl";

class UserAddCase extends Component {
    /*
    This is StoreAddCase Page, user should be able to:
        1. add new item and amout of item
    */
    constructor(props) {
        super(props);
        this.state = {formCaseItems: []};
        this.handleAdd = this.handleAdd.bind(this);
    }
    componentDidMount() {
        var list = this.state.formCaseItems;
        list.push(<FormCaseItem />);
        this.setState({formCaseItems: list});
    }
    handleAdd() {
        var list = this.state.formCaseItems;
        list.push(<FormCaseItem />);
        this.setState({formCaseItems: list});
    }
    render() {
        return (
            <div className="Container addCase">
                <h1><FormattedMessage id="uAdd.add-case" defaultMessage="新增一筆媒合資訊"/></h1>
                <div className="formContainer">
                    <form>
                        {this.state.formCaseItems.map((item, index) => {
                            return item;
                        })}
                        <button type="button" onClick={this.handleAdd}>
                            <FormattedMessage id="uAdd.add-food" defaultMessage="新增食物"/>
                        </button>
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default UserAddCase;