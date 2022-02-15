import Link from "next/link";
import CustomLink from "./CustomLink";
import Image from "next/image";
import { useMyContext } from "../contexts/MyContext";
import { Flex, Box, useColorMode, Icon, Menu, MenuButton, MenuList, MenuItem, IconButton, MenuDivider} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useRouter } from "next/dist/client/router";

export default function Navbar({styles }) {  
    const {UserName, logout} = useMyContext();
    const {colorMode, toggleColorMode} = useColorMode();
    const router = useRouter();

    return (
        <Flex className={"navbar"} justify="space-between" height="3rem" width="100%" borderWidth="0px 0px 1px 0px" position="sticky" top="0">
            <Flex width="10%">
                <Link href="/">
                    <a className={styles.logoLink}>
                        {
                            colorMode !== "light" ?
                                <Image src="/logo/SH_logo_opaque_low.png" layout="fill" className={styles.logo}></Image>
                            :
                                <Image src="/logo/SH_logo_reverse_opaque_low.png" layout="fill" className={styles.logo}></Image>
                        }
                    </a>
                </Link>
            </Flex>
            <Flex width="40%">
                <Flex width="32%" justify="center" align="center" _hover={colorMode === "light" ? {color: "blue.400"}: {color: "teal"}}>
                    <Link href="/">
                        <a className={styles.link} style={{textDecoration: "none"}}>
                            首頁
                        </a>
                    </Link>
                </Flex>
                <Flex width="32%" justify="center" align="center" _hover={colorMode === "light" ? {color: "blue.400"}: {color: "teal"}}>
                    <Link href="/about">
                        <a className={styles.link} style={{textDecoration: "none"}}>
                            關於
                        </a>
                    </Link>
                </Flex>
                <Flex width="32%" justify="center" align="center" _hover={colorMode === "light" ? {color: "blue.400"}: {color: "teal"}}>
                    <Link href="/blogs/1">
                        <a className={styles.link} style={{textDecoration: "none"}}>
                            文章
                        </a>
                    </Link>
                </Flex>
                {
                    router.pathname !== '/about' ?
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<HamburgerIcon />}
                            variant="outline"
                            w="4%"
                            h="100%"
                            borderWidth="0px 0px"
                        />
                        <MenuList>
                            <MenuItem>
                                {UserName ?
                                    <Link href="/">
                                        <a className={styles.link} style={{textDecoration: "none"}} onClick={() => logout()}>
                                            登出
                                        </a>
                                    </Link>
                                    :
                                    <Link href="/login">
                                        <a className={styles.link} style={{textDecoration: "none"}}>
                                            登入(管理員限定)
                                        </a>
                                    </Link>
                                }
                            </MenuItem>
                            <MenuDivider/>
                            <MenuItem onClick={toggleColorMode}>
                                {colorMode === "dark" ?
                                    <SunIcon margin="0px auto" role="img" alt="light mode" />
                                    :
                                    <MoonIcon margin="0px auto" role="img" alt="dark mode" />
                                }
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    :
                    <></>
                }
                {/* {
                    UserName ?
                        <Flex width="4%" justify="center" align="center" borderWidth="0px 0px 0px 2px" _hover={{boxShadow: "2xl"}}>
                            <Link href="/">
                                <a className={styles.link} style={{textDecoration: "none"}} onClick={() => logout()}>
                                    <Icon as={BiLogOut} />
                                </a>
                            </Link>
                        </Flex>
                    :
                        <Flex width="4%" justify="center" align="center" borderWidth="0px 0px 0px 2px" _hover={{boxShadow: "2xl"}}>
                            <Link href="/login">
                                <a className={styles.link} style={{textDecoration: "none"}}>
                                <Icon as={BiLogIn} />
                                </a>
                            </Link>
                        </Flex>
                }
                <Flex onClick={toggleColorMode} width="4%" justify="center" align="center" borderWidth="0px 0px 0px 2px" _hover={{boxShadow: "2xl"}}>
                    {colorMode === "dark" ?
                        <SunIcon margin="5vh" role="img" alt="light mode" />
                        :
                        <MoonIcon margin="5vh" role="img" alt="dark mode" />
                    }
                </Flex> */}
            </Flex>
        </Flex>
    )
}