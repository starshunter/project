import { Component } from "react";

class FormCaseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {url: null}
        this.loadFile = this.loadFile.bind(this);
    }
    loadFile(event) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            this.setState({url: reader.result});
        }
    }
    render() {
        return (
            <div className="formCaseItem">
                <label>食物</label>
                <input type="text" name="item" id="AC_item" required/>
                <label>數量</label>
                <input type="number" step="1" min="1" name="amount" id="AC_amount" required/>
                <label>單價</label>
                <input type="number" step="1" min="0" name="price" id="AC_price" required/>
                <label>截止時間</label>
                <input type="time" name="due" id="AC_due" required/>
                <div>
                    <label>新增照片</label>
                    <img src={this.state.url} width={this.state.url ? "50%" : "0%"} alt="uploaded"></img>
                    <input type="file" name="pic" id="AC_pic" accept="image/png, image/jpeg" onChange={this.loadFile}/>
                </div>
            </div>
        )
    }
}

export default FormCaseItem;