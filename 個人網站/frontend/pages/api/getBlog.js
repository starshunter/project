import { getAllBlog, getBlog } from "../../lib/blogs";
import dbConnect from "../../utils/dbConnect";
import axios from "axios";
import matter from "gray-matter"
 
// export default async(req, res) => {
//     try {
//         const response = await axios.post("https://api.github.com/markdown", {text: "## hello"});
//         res.send(response.data);
//     } catch(error) {
//         res.send("<h1>error has occurred</h1>")
//     }
// }

export default async(req, res) => {
    try {
        const response = matter("# hello world")
        res.send(response);
    } catch(error) {
        res.send("<h1>error has occurred</h1>")
    }
}