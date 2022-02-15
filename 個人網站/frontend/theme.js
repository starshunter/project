// theme.js

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme

export const customTheme = extendTheme({
    styles: {
        global: (props) => ({
            "body": {
                fontFamily: "body",
                // color: mode("gray.800", "whiteAlpha.900")(props),
                // bg: mode("white", "gray.800")(props),
                colorScheme: "linkedin",
                lineHeight: "base",
            },
            "*::placeholder": {
                color: mode("gray.400", "whiteAlpha.400")(props),
            },
            "*, *::before, &::after": {
                borderColor: mode("gray.200", "whiteAlpha.300")(props),
                wordWrap: "break-word",
                colorScheme: "linkedin"
            },
            ".navbar": {
                bg: mode("white", "gray.800")(props)
            },
            ".blur_flex": {
                
                position: "relative",

            },
            ".blur_flex::before": {
                bg: mode("white", "gray.800")(props),
                opacity: mode(0.6, 0.8)(props),
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
                content: '""'
            }
        }),
    },
})