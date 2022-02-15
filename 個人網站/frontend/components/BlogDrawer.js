import { Flex } from "@chakra-ui/layout";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, DrawerFooter, FormControl, FormLabel, Input, Button, Box, Textarea} from "@chakra-ui/react";
import { useState } from "react";
import { postBlog } from "../lib/blogs";

export default function BlogDrawer({isOpen, onClose, toast, router}) {
    const [inputTitle, setInputTitle] = useState("");
    const [inputBody, setInputBody] = useState("");

    return (
        <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>新增文章</DrawerHeader>
                <DrawerBody>
                    <Flex align="center" width="60%" justify="center" margin="0px auto">
                        <form style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
                            <Box width="80%" margin="3vh">
                                <FormControl>
                                    <FormLabel>標題</FormLabel>
                                    <Input value={inputTitle} onChange={e => setInputTitle(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Box width="80%" margin="3vh">
                                <FormControl>
                                    <FormLabel>內文</FormLabel>
                                    <Textarea rows={10} value={inputBody} onChange={e => setInputBody(e.target.value)} />
                                </FormControl>
                            </Box>
                        </form>
                    </Flex>
                </DrawerBody>
                <DrawerFooter>
                    <Button type="button" margin="3vh" bg="green.300" onClick={async() => {
                        try {
                            await postBlog(inputTitle, inputBody);
                            toast({
                                status: "success",
                                title: "新增文章成功",
                                description: "正在重新整理...",
                                duration: 3000,
                                isClosable: true,
                                position: "top"
                            });
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
                            });
                            onClose();
                            router.replace("/login");
                        }
                        setInputTitle("");
                        setInputBody("");
                    }}>送出</Button>
                    <Button onClick={onClose} bg="red.300">取消</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}