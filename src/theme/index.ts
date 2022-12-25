import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { styles } from './globals-styles'
import { fonts } from './fonts.config'
import { colors } from './colors.config'
import { components } from './components.config'

const config: ThemeConfig = {
  initialColorMode: 'light'
}

export const theme = extendTheme({
  config,
  styles,
  fonts,
  colors,
  components
})
