import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default async(req, res) => {
    const response = await axios.post("https://peter-personal-blog-api.herokuapp.com/login", {username: "starshunter", password: "aaaa"});
    cookies.set("token", response.data.token, {
        path: "/",
        domain: "localhost:3000"
    });
    console.log(cookies.getAll())
    res.status(200).json({msg: "ok"})
}