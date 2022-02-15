import { Flex, Box, Text } from "@chakra-ui/react";
import { Parallax } from "react-scroll-parallax";
import TimeLogo from "./TimeLogo";

export default function Slide({from, to, company, position, intro}) {
    return (
        <Flex height={"calc(100vh - 3rem)"} width="100%">
            <Box w="40%" h="100%">
                <TimeLogo from={from} to={to}/>
            </Box>
            <Flex w="60%" h="100%" justify="center" align="center" direction="column">
                <Parallax x={[-70, 70]} styleOuter={{width: "100%", height: "100%"}} styleInner={{width: "100%", height: "100%", display: "flex", "justifyContent": "space-evenly", "alignItems": "center", "flexDirection": "column"}}>
                    <Flex align="center" justify="center" direction="column">
                        <Text fontSize="3xl" fontWeight="medium">{company}</Text>
                        <Text fontSize="2xl" fontWeight="normal" fontStyle="italic">{position}</Text>
                    </Flex>
                    <Flex overflowX="hidden" fontFamily="monospace" fontSize="sm" w="50%" h="50%" borderWidth="3px" padding="2%" justify="center" align="center">
                        {intro}
                    </Flex>
                </Parallax>
            </Flex>
        </Flex>
    )
}