import '../styles/globals.css'
import { MyWrapper } from '../contexts/MyContext';
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
import theme, {customTheme} from "../theme";
import { ParallaxProvider } from 'react-scroll-parallax';

function MyApp({ Component, pageProps }) {
    return (
        <MyWrapper>
            <ChakraProvider theme={customTheme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Component {...pageProps}/>
            </ChakraProvider>
        </MyWrapper>
    )
}

export default MyApp
