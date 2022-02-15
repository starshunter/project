import { Box, Flex, Text } from "@chakra-ui/react";

export default function TimeLogo({from, to}) {
    return (
        <Flex w="100%" h="100%" direction="column">
            <Flex position="relative" w="100%" h="50%" justify="center" align="center" direction="column">
                <Text fontStyle="italic" position="absolute" top="15%" left="20%" fontSize="2xl">from</Text>
                <Text fontSize="8xl" fontWeight="bold">
                    {from}
                </Text>
            </Flex>
            <Flex position="relative" w="100%" h="50%" justify="center" align="center" direction="column">
                <Text fontStyle="italic" position="absolute" top="15%" left="20%" fontSize="2xl">to</Text>
                <Text fontSize="8xl" fontWeight="bold">
                    {to}
                </Text>
            </Flex>
        </Flex>
    )
}