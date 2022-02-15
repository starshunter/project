import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function handler(req, res) {
    console.log(cookies.getAll())
    res.status(200).json({msg: "ok"})
}
