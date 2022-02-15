import Head from 'next/head'
import Layout, { blogsOverviewTitle } from '../../components/layout'
import { getBlogByPage } from '../../lib/blogs'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useMyContext } from '../../contexts/MyContext'
import { Heading, Text, LinkBox, LinkOverlay, SimpleGrid, Flex, useToast, useDisclosure} from "@chakra-ui/react"
import {PlusSquareIcon} from "@chakra-ui/icons";
import Paginator from '../../components/Paginator'
import IsAdmin from '../../lib/IsAdmin'
import BlogDrawer from '../../components/BlogDrawer'


export async function getServerSideProps({params}) {
    const {blogs, pages} = await getBlogByPage(params.id);
    const current = params.id
    return {
        props: {
            blogs,
            pages,
            current
        }
    }
}

export default function Home({blogs, pages, current}) {
    const router = useRouter();
    const {updateToken} = useMyContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        updateToken();
    }, [])

    return (
        <Layout>
            <Head>
                <title>{blogsOverviewTitle}</title>
            </Head>
            <SimpleGrid padding="5vh 0px" columns={2} spacingX={10} spacingY={10} width="60%" margin="0px auto">
                { 
                    blogs ? 
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
                <Flex p={5} borderWidth="1px" rounded="md" justify="center" align="center" minH="10rem" maxH="10rem" hidden={!IsAdmin()}>
                    <PlusSquareIcon onClick={onOpen} boxSize={10} color="gray.600"></PlusSquareIcon>
                </Flex>
            </SimpleGrid>
            <Paginator w="60%" h="3rem" m="3rem auto 0px auto" current={Number(current)} pages={Number(pages)}/>
            <BlogDrawer isOpen={isOpen} onClose={onClose} toast={toast} router={router}/>
        </Layout>
    )
}