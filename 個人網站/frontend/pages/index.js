import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getBlogByPage } from '../lib/blogs'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useMyContext } from '../contexts/MyContext'
import { Flex, Heading, LinkBox, LinkOverlay, Text, Button } from '@chakra-ui/react'
import { useEmblaCarousel } from 'embla-carousel/react'
import Footer from '../components/Footer'

export async function getServerSideProps() {
    const {blogs} = await getBlogByPage(1);
    return {
        props: {
            blogs
        }
    }
}

export default function Home({blogs}) {
    const {updateToken} = useMyContext();

    const [emblaRef, emblaApi] = useEmblaCarousel();

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
    
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    useEffect(() => {
        updateToken();
    }, [])

    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <Flex backgroundSize="cover" backgroundImage="/images/background.jpeg" w="100%" h="100%" boxSizing="border-box" direction="column" justify="space-evenly" align="center">
                <Flex height="50%" minH="200" width="50%" minW="250" className="blur_flex" direction="column" align="center" justify="space-around">
                    <Heading color="white" mixBlendMode="difference" fontSize={["xl", "2xl", "4xl", "5xl", "6xl"]}>Starshunter的部落格</Heading>
                    <Heading color="white" mixBlendMode="difference" fontStyle="italic" fontSize={["lg", "xl", "3xl", "3xl", "3xl"]}>技術與日常心得</Heading>
                </Flex>
            </Flex>
            <Flex position="relative" w="100%" h="100%" boxSizing="border-box" borderWidth="3px 0px 0px 0px" justify="center" align="center" direction="column">
                <Heading position="absolute" top="10%"><Link href="/blogs/1"><a style={{textDecoration: "none"}}>文章</a></Link></Heading>
                <div className="embla">
                    <div className="embla__viewport" ref={emblaRef}>
                        <div className="embla__container">
                            { 
                                blogs ? 
                                    blogs.map(({title, body, _id}) => (
                                        <div className="embla__slide" key={_id}>
                                            <LinkBox margin="0px auto"borderWidth="1px" rounded="md" p="5" minW="20rem" w="20rem" h="15rem" >
                                                <Link href={`/blog/${_id}`}>
                                                    <LinkOverlay>
                                                        <Heading fontSize="2xl">{title}</Heading>
                                                        <Text fontSize="lg" noOfLines={5}>{body}</Text>
                                                    </LinkOverlay>
                                                </Link>
                                            </LinkBox>
                                        </div>
                                    ))
                                :
                                    <></>
                            }
                            <div className="embla__slide">
                                <Flex margin="0px auto" borderWidth="1px" rounded="md" p="5" minW="20rem" w="20rem" h="15rem" justify="center" align="center">
                                    <Link href={`/blogs/1`}>
                                        <LinkOverlay>
                                            <Heading fontSize="2xl">查看更多</Heading>
                                        </LinkOverlay>
                                    </Link>
                                </Flex>
                            </div>
                        </div>
                        <Flex w="100%" justify="space-evenly">
                            <Button className="embla__prev" onClick={scrollPrev}>Prev</Button>
                            <Button className="embla__next" onClick={scrollNext}>Next</Button>
                        </Flex>
                    </div>
                </div>
            </Flex>
            <Footer />
        </Layout>
    )
}