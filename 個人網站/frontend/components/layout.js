import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link';
import Navbar from './Navbar';
import { Center, useColorMode, Button, Flex, Box, useShortcut } from '@chakra-ui/react';
import {SunIcon} from "@chakra-ui/icons";
import { ParallaxProvider } from 'react-scroll-parallax';
import { useEffect, useRef, useState } from 'react';
import Footer from './Footer';

export const siteTitle = "Starshunter's Blog";
export const blogsOverviewTitle = "Blogs | Starshunter's Blog"

export default function Layout({ children, home }) {
    const {colorMode, toggleColorMode} = useColorMode();
    const [scrollContainer, setScrollContainer] = useState(null);
    const container = useRef();

    useEffect(() => {
        setScrollContainer(container.current);
    }, [])

    return (
        <>
            <Navbar styles={styles}></Navbar>
            <div className={styles.container} ref={container}>
                <Head>
                    <link rel="icon" href="/logo/SH_color.png" />
                    <meta
                    name="Starshunter"
                    content="Starshunter's website"
                    />
                    <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                    />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <ParallaxProvider scrollContainer={scrollContainer}>
                    <Box height="100%" width="100%" overflowX="hide">{children}</Box>
                </ParallaxProvider>
            </div>
        </>
    )
}