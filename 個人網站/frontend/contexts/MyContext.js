import { useRouter } from "next/dist/client/router";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { admin } from "../utils/axios";

const MyContext = createContext();

export function MyWrapper({children}) {
    const [UserName, setUserName] = useState(null);
    const router = useRouter();
    const cookies = new Cookies();

    useEffect(() => {
        const tmp = localStorage.getItem("UserName");
        handleChangeUserName(tmp);
        addEventListener("storage", (e) => {
            if(e.key === "UserName" && e.oldValue && e.newValue === null) {
                logout();
                router.replace("/");
            }
        })
    }, [])

    const logout = () => {
        handleChangeUserName(null);
    }

    const login = (token, UserName) => {
        cookies.set("token", token);
        handleChangeUserName(UserName);
    }

    const handleChangeUserName = (newUserName) => {
        if(newUserName === null) {
            localStorage.removeItem("UserName");
        }
        else {
            localStorage.setItem("UserName", newUserName);

        }
        setUserName(newUserName);
    }

    const updateToken = async(logout) => {
        try {
            await admin.get("/v1/updateToken");
            // await axios.get("http://localhost:8000/admin/v1/refresh_token", {withCredentials: true})
        } catch(error) {
            handleChangeUserName(null);
        }
    }

    return (
        <MyContext.Provider value={{UserName, login, logout, updateToken}}>
            {children}
        </MyContext.Provider>
    )
}

export function useMyContext() {
    return useContext(MyContext);
}