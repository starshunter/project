import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import { getAllBlog, getBlogByPage } from '../../lib/blogs'
import Link from 'next/link'
import Cookies from "universal-cookie"
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useMyContext } from '../../contexts/MyContext'
import { Heading, Text, LinkBox, LinkOverlay, SimpleGrid, Drawer, Input, FormControl, FormLabel, InputGroup, Box, Flex, Button, InputLeftElement, useToast, useDisclosure, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Textarea} from "@chakra-ui/react"
import {EmailIcon, LockIcon, PlusSquareIcon} from "@chakra-ui/icons";
import styles from "../../styles/blogs.module.css";

const cookies = new Cookies();

export async function getServerSideProps({params}) {
    const {blogs, pages} = await getBlogByPage(0);
    const current = 1;
    return {
        props: {
            blogs,
            pages,
            current
        }
    }
}

const refreshToken = async(logout) => {
    const token = cookies.get("token");
    try {
        const response = await axios.get("https://peter-personal-blog-api-v2.herokuapp.com/admin/v1/refresh_token", {headers: {Authorization: 'Bearer ' + token}, withCredentials: true})
        // const response = await axios.get("http://localhost:8000/admin/v1/refresh_token", {headers: {Authorization: 'Bearer ' + token}, withCredentials: true})
        cookies.set("token", response.data.token);
    } catch(error) {
        logout();
    }
}
export default function Home({blogs, pages, current}) {
    const [inputTitle, setInputTitle] = useState("");
    const [inputBody, setInputBody] = useState("");
    const router = useRouter();
    const {UserName, logout} = useMyContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        refreshToken(logout);
    }, [])

    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <SimpleGrid columns={2} spacingX={10} spacingY={10} width="60%" margin="0px auto">
                { blogs ? 
                    blogs.map(({title, body, _id}) => (
                        <LinkBox key={_id} borderWidth="1px" rounded="md" p="5" minH="10rem" maxH="10rem" >
                            <Link href={`/blog/${_id}`}>
                                <LinkOverlay>
                                    <Heading fontSize="2xl">{title}</Heading>
                                    <Text fontSize="lg" noOfLines={3}>{body}</Text>
                                </LinkOverlay>
                            </Link>
                        </LinkBox>
                    ))
                    :
                    <></>
                }
                {
                    UserName === "Starshunter" ?
                        <Flex p={5} borderWidth="1px" rounded="md" justify="center" align="center" minH="10rem" maxH="10rem">
                            <PlusSquareIcon onClick={onOpen} boxSize={10} color="gray.600"></PlusSquareIcon>
                        </Flex>
                    :
                        <></>
                }
            </SimpleGrid>
            <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>新增文章</DrawerHeader>
                    <DrawerBody>
                        <Flex  align="center" width="60%" justify="center" margin="0px auto">
                            <form className={styles.form}>
                                <Box width="80%" margin="3vh">
                                    <FormControl>
                                        <FormLabel>標題</FormLabel>
                                        <Input value={inputTitle} onChange={(e) => setInputTitle(e.target.value)}></Input>
                                    </FormControl>
                                </Box>
                                <Box width="80%" margin="3vh">
                                    <FormControl>
                                        <FormLabel>內文</FormLabel>
                                            {/* <Input value={inputBody} type="password" onChange={(e) => setInputBody(e.target.value)}></Input> */}
                                            <Textarea value={inputBody} onChange={(e) => setInputBody(e.target.value)}></Textarea>
                                    </FormControl>
                                </Box>
                                
                            </form>
                        </Flex>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button type="button" margin="3vh" bg="green.300" onClick={async() => {
                            const token = cookies.get("token");
                            try {
                                const response = await axios.post("https://peter-personal-blog-api-v2.herokuapp.com/admin/v1/blog", {title: inputTitle, body: inputBody}, {headers: {Authorization: 'Bearer ' + token}, withCredentials: true});
                                toast({
                                    status: "success",
                                    title: "新增文章成功",
                                    description: "正在重新整理...",
                                    duration: 3000,
                                    isClosable: true,
                                    position: "top"
                                })
                                onClose();
                                router.replace(router.asPath);
                            } catch(error) {
                                toast({
                                    status: "error",
                                    title: "新增文章失敗",
                                    description: "請重新登入後再試一次",
                                    duration: 3000,
                                    isClosable: true,
                                    position: "top"
                                })
                                onClose();
                                router.replace("/login");
                            }
                            setInputTitle("");
                            setInputBody("");
                        }}>
                            送出
                        </Button>
                        <Button onClick={onClose} bg="red.300">取消</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Layout>
    )
}