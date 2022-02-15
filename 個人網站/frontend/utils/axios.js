import axios from "axios";

export const api = axios.create({
    baseURL: "https://peter-personal-blog-api-v2.herokuapp.com/api",
    // baseURL: "http://localhost:8000/api",
    timeout: 10000,
    withCredentials: true,
})

export const auth = axios.create({
    baseURL: "https://peter-personal-blog-api-v2.herokuapp.com/auth",
    // baseURL: "http://localhost:8000/auth",
    timeout: 10000,
    withCredentials: true,
})

export const admin = axios.create({
    baseURL: "https://peter-personal-blog-api-v2.herokuapp.com/admin",
    // baseURL: "http://localhost:8000/admin",
    timeout: 10000,
    withCredentials: true,
})