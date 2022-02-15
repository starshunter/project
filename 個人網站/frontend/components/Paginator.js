import { Flex, Box, Button, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";

export default function Paginator(props) {
    var pageNum = [];
    const [buttonLoad, setButtonLoad] = useState(false);
    const router = useRouter();
    const {colorMode} = useColorMode();

    if(props.pages > 5) {
        if(props.current < 3) {
            pageNum.push(1, 2, 3, 4, 5);
        }
        else if(props.current > props.pages - 2) {
            pageNum.push(props.pages - 4, props.pages - 3, props.pages - 2, props.pages - 1, props.pages);
        }
        else {
            pageNum.push(props.current - 2, props.current - 1, props.current, props.current + 1, props.current + 2);
        }
    }
    else {
        for(let i=0; i<props.pages; i++) {
            pageNum.push(i + 1);
        }
    }

    useEffect(() => {
        setButtonLoad(false)
    }, [props.current])

    return (
        <Box {...props}>
            <Flex h="100%" justify="space-between" align="center">
                <Button colorScheme="linkedin" isLoading={buttonLoad} w="10%" visibility={props.current === 1 ? "hidden" : "visible"} onClick={() => {
                    setButtonLoad(true);
                    router.push(`/blogs/${props.current - 1}`);
                    }}>
                    前一頁
                </Button>
                <Flex w="60%" h="100%" justify="space-evenly" align="center">
                    {pageNum.map((item, index) => {
                        console.log(item, props.current);
                        if(item === props.current) {
                            return <Button disabled colorScheme="linkedin" isLoading={buttonLoad} key={index} onClick={() => {
                                setButtonLoad(true);
                                router.push(`/blogs/${item}`);
                            }}>
                                {item}
                            </Button>
                        }
                        else {
                            return <Button colorScheme="linkedin" isLoading={buttonLoad} key={index} onClick={() => {
                                setButtonLoad(true);
                                router.push(`/blogs/${item}`);
                            }}>
                                {item}
                            </Button>
                        }
                    })}
                </Flex>
                <Button colorScheme="linkedin" isLoading={buttonLoad} w="10%" visibility={props.current === props.pages ? "hidden" : "visible"} onClick={() => {
                    setButtonLoad(true);
                    router.push(`/blogs/${props.current + 1}`);
                    }}>
                    下一頁
                </Button>
            </Flex>
        </Box>
    );
}