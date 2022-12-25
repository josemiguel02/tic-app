import { defineStyleConfig, ThemeComponents } from '@chakra-ui/react'

export const components: ThemeComponents = {
  Heading: defineStyleConfig({
    baseStyle: {
      color: 'gray.700'
    }
  }),
  Button: {
    baseStyle: {
      _hover: { bg: 'none' },
      // _active: { bg: 'none' },
      _focusVisible: { boxShadow: 'none' },
      fontWeight: 'medium'
    },
    variants: {
      solid: {
        color: 'white',
        bgColor: 'primary',
        border: '2px solid transparent',
        transition: 'all .5s ease-in-out',
        '&:hover': {
          color: 'primary',
          bgColor: 'transparent',
          borderColor: 'primary'
        }
      },
      success: {
        color: 'white',
        bgColor: 'green.400',
        '&:hover': {
          bgColor: 'green.500'
        },
        _active: {
          bgColor: 'green.600'
        }
      },
      warning: {
        color: 'white',
        bgColor: 'orange.400',
        _hover: {
          bgColor: 'orange.500'
        },
        _active: {
          bgColor: 'orange.600'
        }
      },
      secondary: {
        color: 'red',
        '&:hover': {
          bgColor: 'blackAlpha.200'
        }
      },
      navLink: {
        color: 'white',
        bgColor: 'transparent',
        border: '2px solid transparent',
        transition: 'background-color .5s ease-in-out',
        fontWeight: 'normal'
      },
      danger: {
        color: 'white',
        bgColor: 'red.500',
        _hover: {
          bgColor: 'red.600'
        },
        _active: {
          bgColor: 'red.700'
        }
      }
    }
  },
  Link: defineStyleConfig({
    baseStyle: {
      _hover: { textDecoration: 'none' },
      _focusVisible: { boxShadow: 'none' }
    }
  }),
  Text: {
    variants: {
      textError: {
        color: 'crimson',
        fontWeight: 'medium'
      }
    }
  }
}
