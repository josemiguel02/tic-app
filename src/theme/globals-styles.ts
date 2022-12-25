import type { Styles } from '@chakra-ui/theme-tools'

export const styles: Styles = {
  global: () => ({
    'html::-webkit-scrollbar': {
      w: '10px'
    },
    'html::-webkit-scrollbar-thumb': {
      bgColor: 'gray.50',
      borderRadius: '10px'
    },
    'html&::-webkit-scrollbar-thumb:hover': {
      bgColor: '#bebebe',
      boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.2);'
    },
    html: {
      scrollBehavior: 'smooth'
    },
    body: {
      overflowX: 'hidden',
      color: 'gray.600',
      bgColor: 'bg'
    },
    '#__next': {
      minH: '100vh',
      display: 'flex',
      flexDir: 'column'
    }
  })
}
