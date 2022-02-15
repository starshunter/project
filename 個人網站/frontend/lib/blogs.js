import axios from "axios";

const api = axios.create({
    baseURL: "https://peter-personal-blog-api-v2.herokuapp.com/api",
    // baseURL: "http://localhost:8000/api",
    timeout: 10000
})

const admin = axios.create({
    baseURL: "https://peter-personal-blog-api-v2.herokuapp.com/admin",
    // baseURL: "http://localhost:8000/admin",
    timeout: 10000,
    withCredentials: true,
})

export const getAllBlog = async() => {
    try {
        const {data: {allBlog}} = await api.get('/v1/allBlog');
        return allBlog;
    } catch(error) {
        return [];
    }
}

export const getAllBlogIds = async() => {
    try {
        const {data: {result}} = await api.get('/v1/allBlogIds');
        const ids = result.map((doc) => {
            return {params: {id: doc._id}};
        })
        return ids;
    } catch(error) {
        return [];
    }
}

export const getBlog = async(id) => {
    try {
        const {data: {blog}} = await api.get("/v1/blog", {params: {id: id}})
        return blog;
    } catch(error) {
        return {title: "error", body: "error"}
    }
}

export const getBlogByPage = async(page) => {
    try {
        const {data: {blogs, pages}} = await api.get("/v1/blogByPage", {params: {page: page}})
        return {blogs, pages};
    } catch(error) {
        return {title: "error", body: "error"}
    }
}

export const deleteBlog = async(id, router) => {
    try {
        await admin.delete("/v1/blog", {params: {id: id}});
        router.replace("/");
    } catch(error) {
        alert(error);
    }
}

export const postBlog = async(title, body) => {
    try {
        await admin.post("/v1/blog", {title: title, body: body});
    } catch(error) {
        throw(error);
    }
}

export const getMarkdownHTML = async(body) => {
    try {
        const {data} = await axios.post("https://api.github.com/markdown", {text: body});
        return data;
    } catch(error) {
        return "<h1>error has occurred</h1>"
    }
}