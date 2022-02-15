import Layout from '../../components/layout'
import { deleteBlog, getAllBlogIds, getBlog, getMarkdownHTML} from '../../lib/blogs'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'
import { Box, Button, Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
import hljs from 'highlight.js/lib/common';
import Link from "next/link";
import { useEffect } from 'react'
import dateFormat from 'dateformat'
import IsAdmin from '../../lib/IsAdmin'

export async function getStaticProps({ params }) {
    const blogData = await getBlog(params.id);
    const htmlString = await getMarkdownHTML(blogData.body)
    return {
        props: {
            blogData,
            htmlString,
        },
        revalidate: 60
    }
}

export async function getStaticPaths() {
    const paths = await getAllBlogIds();
    return {
        paths,
        fallback: 'blocking'
    }
}

export default function Blog({ blogData, htmlString }) {
    const router = useRouter();
    const {colorMode} = useColorMode();

    useEffect(() => {
        hljs.highlightAll();
    }, [])

    return (
        <Layout>
            <Head>
                <title>{blogData.title}</title>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/atom-one-dark.min.css"></link>
            </Head>
            <Flex width="50%" direction="column" borderWidth="0px 1px" padding="0px 5%" margin="5vh auto 0vh auto">
                <Heading size="2xl" margin="0.5em 0px">{blogData.title}</Heading>
                <Heading size="md" margin="1em 0px">{dateFormat(blogData.time, "dd/mm/yyyy")}</Heading>
                <div className={`markdown-body ${colorMode === "light" ? '' : "dark"}`} dangerouslySetInnerHTML={{__html: htmlString}}></div>
                <Button m="5vh 0px" onClick={() => deleteBlog(blogData._id, router)} hidden={!IsAdmin()}>
                    刪除
                </Button>
                <Box margin="10vh auto">
                    <Link href="/blogs/1"><a>←回到文章</a></Link>
                </Box>
            </Flex>
            <Box h="5vh" w="100%" m="0px auto"></Box>
        </Layout>
    )
}