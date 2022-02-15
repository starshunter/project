import { Flex, useColorMode, Text, Box } from "@chakra-ui/react";
import Image from "next/image";

export default function Footer() {
    const {colorMode} = useColorMode();
    return (
        <Flex w="100%" h="10%" justify="space-around" align="center">
            <Text>(C) 2021 Starshunter</Text>
            <Box h="100%" position="relative" w="4%">
                {
                    colorMode !== "light" ?
                        <Image src="/logo/SH_logo_opaque_low.png" layout="fill" objectFit="contain" position="relative"></Image>
                    :
                        <Image src="/logo/SH_logo_reverse_opaque_low.png" layout="fill" objectFit="contain" w="unset" position="relative"></Image>
                }
            </Box>
        </Flex>
    )
}