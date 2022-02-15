import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import Layout from "../components/layout";
import styles from "../styles/login.module.css";
import { useMyContext } from "../contexts/MyContext";
import { Textarea, Input, FormControl, FormLabel, InputGroup, Box, Flex, Button, InputLeftElement, useToast} from "@chakra-ui/react"
import {EmailIcon, LockIcon, PhoneIcon} from "@chakra-ui/icons";

export default function Login({}) {
    const [inputUserName, setInputUserName] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {login} = useMyContext();
    const toast = useToast();

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <>
            <Layout>
                <Flex borderWidth="1px" borderRadius="20px" align="center" width="60%" justify="center" margin="5vh auto">
                    <form className={styles.form}>
                        <Box width="80%" margin="3vh">
                            <FormControl>
                                <FormLabel>帳號</FormLabel>
                                <InputGroup>
                                <InputLeftElement pointerEvents="none"><EmailIcon color="gray.300"/></InputLeftElement>
                                    <Input value={inputUserName} onChange={(e) => setInputUserName(e.target.value)}></Input>
                                </InputGroup>
                            </FormControl>
                        </Box>
                        <Box width="80%" margin="3vh">
                            <FormControl>
                                <FormLabel>密碼</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none"><LockIcon color="gray.300"/></InputLeftElement>
                                    <Input value={inputPassword} type="password" onChange={(e) => setInputPassword(e.target.value)}></Input>
                                </InputGroup>
                            </FormControl>
                        </Box>
                        <Button isLoading={loading} colorScheme="linkedin" type="button" margin="3vh" onClick={async() => {
                            setLoading(true);
                            try {
                                const response = await axios.post("https://peter-personal-blog-api-v2.herokuapp.com/auth/v1/login", {username: inputUserName, password: inputPassword}, {withCredentials: true});
                                // const response = await axios.post("http://localhost:8000/auth/v1/login", {username: inputUserName, password: inputPassword}, {withCredentials: true});
                                toast({
                                    status: "success",
                                    title: "登入成功",
                                    description: "正在返回主畫面...",
                                    duration: 3000,
                                    isClosable: true,
                                    position: "top"
                                })
                                login(response.data.token, response.data.username);
                                router.replace("/");
                            } catch(error) {
                                toast({
                                    status: "error",
                                    title: "登入失敗",
                                    description: "帳號或密碼錯誤",
                                    duration: 3000,
                                    isClosable: true,
                                    position: "top"
                                });
                                setLoading(false);
                            }
                            setInputUserName("");
                            setInputPassword("");
                        }}>登入</Button>
                    </form>
                </Flex>
            </Layout>
        </>
    )
}