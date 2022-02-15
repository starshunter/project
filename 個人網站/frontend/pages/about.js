import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getAllBlog } from '../lib/blogs'
import Cookies from "universal-cookie"
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useMyContext } from '../contexts/MyContext'
import { Box, Image, Text, Flex, UnorderedList, ListItem, Link } from '@chakra-ui/react'
import Slide from '../components/Slide'
import TimeLogo from '../components/TimeLogo'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { LinearProgress } from '@material-ui/core'
import { Document, Page, pdfjs } from 'react-pdf'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const cookies = new Cookies();
const copy = 'Parallax'.split('');
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function About({}) {
    const [height, setHeight] = useState(0);
    const [plBottom, setPlBottom] = useState(1000000000);
    const [fwBottom, setFwBottom] = useState(1000000000);
    const plActivated = useRef(false);
    const fwActivated = useRef(false);
    const plRef = useRef();
    const fwRef = useRef();

    const plHandler = () => {
        if(Math.abs(plRef.current.getBoundingClientRect().bottom - plBottom) > 100 && !plActivated.current) {
            setPlBottom(plRef.current.getBoundingClientRect().bottom);
        }
    }
    const fwHandler = () => {
        if(Math.abs(fwRef.current.getBoundingClientRect().bottom - fwBottom) > 100 && !fwActivated.current) {
            setFwBottom(fwRef.current.getBoundingClientRect().bottom);
        }
    }

    const {UserName, logout} = useMyContext();
    
    var from = new Array(2);
    var to = new Array(2);
    var company = new Array(2);
    var position = new Array(2);
    var intro = new Array(2);

    from[0] = "2017";
    from[1] = "2021";

    to[0] = "2021";
    to[1] = "Now";

    company[0] = "Studant at National Taiwan University";
    company[1] = "Unemployed";

    position[0] = "Major in Information Management";
    position[1] = "Contact me please :(";

    intro[0] = (
    <UnorderedList spacing="5">
        <ListItem><Text>Complete basic Computer Science related courses, such as Data Structure, Algorithms, Operating System, Database Management, Computer Networks and System Design</Text></ListItem>
        <ListItem><Text>Complete several Data Science related courses using Python such as Machine Learning, Information Retrieval, Text Mining and Statistical Learning</Text></ListItem>
        <ListItem><Text>Has project experience in web application development, play different role in different projects, such as database administrator, frontend developer, backend developer, mobile app developer</Text></ListItem>
        <ListItem><Text>Found interest in backend development, eager to become backend developer after graudate</Text></ListItem>
    </UnorderedList>)

    intro[1] = (
    <UnorderedList spacing="5">
        <ListItem><Text>Waiting to server my country, because of COVID-19, it seems that there is a delay...</Text></ListItem>
        <ListItem><Text>I will start searching for my first job after the military service</Text></ListItem>
        <ListItem><Text>If I don&apos;t receive any notification before September, I might have to start my job searching process...</Text></ListItem>
        <ListItem><Text>Please contact me if you&apos;re a HR and are currently finding a junior developer :)</Text></ListItem>
        <ListItem><Text>Whether it&apos;s frontend, backend, QA or data engineer, I would love to give it a try</Text></ListItem>
    </UnorderedList>)

    useEffect(() => {
        window.addEventListener("scroll", plHandler, true);
        window.addEventListener("scroll", fwHandler, true);
        setHeight(window.innerHeight);
        return () => {
            window.removeEventListener("scroll", plHandler, true);
            window.removeEventListener("scroll", fwHandler, true);
        }
    }, []);

    useEffect(() => {
        if(plBottom < height && !plActivated.current) {
            plActivated.current = true;
        }
    }, [plBottom]);

    useEffect(() => {
        if(fwBottom < height && !fwActivated.current) {
            fwActivated.current = true;
        }
    }, [fwBottom]);

    return (
            <Layout>
                <Head>
                    <title>關於我</title>
                </Head>
                {from.map((item, index) => {
                    return (
                        <Slide key={index} from={from[index]} to={to[index]} company={company[index]} position={position[index]} intro={intro[index]}></Slide>
                    )
                })}
                <Flex boxSizing="border-box" borderWidth="3px 0px 0px 0px" height={"calc(100vh - 3rem)"} width="100%" direction="row" justify="center" align="center">
                    <Flex position="relative" h="100%" w="50%" direction="column" justify="center" align="center">
                        <Text position="absolute" top="10%" fontSize="3xl" fontWeight="semibold">Programming Language Proficiency</Text>
                        <Flex w="100%" h="50%" direction="column" justify="center" align="center" ref={plRef}>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">Python</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 70 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">JavaScript</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 60 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">C++</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 50 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">Go</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 30 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">SQL</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 15 : 0} />
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex position="relative" h="100%" w="50%" direction="column" justify="center" align="center">
                        <Text position="absolute" top="10%" fontSize="3xl" fontWeight="semibold">Framework Proficiency</Text>
                        <Flex w="100%" h="50%" direction="column" justify="center" align="center" ref={fwRef}>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">React JS</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 80 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">Node JS</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 70 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">Next JS</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 65 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">Gin</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 40 : 0} />
                            </Flex>
                            <Flex w="50%" h="20%" direction="column" justify="space-evenly">
                                <Text fontSize="xl">React Native</Text>
                                <LinearProgress style={{width: "100%", height: "5%"}} variant="determinate" value={plBottom < height ? 40 : 0} />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex boxSizing="border-box" borderWidth="3px 0px 0px 0px" overflowY="hidden" height={"calc(100vh - 3rem)"} width="100%" direction="row" justify="center" align="center">
                    <Flex h="100%" w="50%" justify="center" align="center" direction="column">
                        <Text fontSize="3xl" fontWeight="semibold">Download My Full Resume</Text>
                        <Link href="https://drive.google.com/file/d/1JaBqdu2LrbaLWFO6-i5Nw0qBqqUo_2D_/view?usp=sharing" isExternal>
                            <Text fontSize="xl">(Google Drive Link)<ExternalLinkIcon mx="2px" /></Text>
                        </Link>
                    </Flex>
                    <Flex h="100%" w="50%" justify="center" align="center">
                        <Document file="./resume.pdf">
                            <Page pageNumber={1}></Page>
                        </Document>
                    </Flex>
                </Flex>
            </Layout>
    )
}