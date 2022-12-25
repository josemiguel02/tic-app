import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import AuthProvider from '@/context/auth/AuthProvider'
import AdminProvider from '@/context/admin/AdminProvider'
import QuizProvider from '@/context/quiz/QuizProvider'
import UIProvider from '@/context/ui/UIProvider'
import { theme } from '@/theme'
import { Fonts } from '@/components'

const handleExitComplete = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AdminProvider>
        <QuizProvider>
          <UIProvider>
            <ChakraProvider theme={theme} portalZIndex={30}>
              <Fonts />
              <AnimatePresence
                initial={false}
                exitBeforeEnter
                onExitComplete={handleExitComplete}
              >
                <Component {...pageProps} />
              </AnimatePresence>
            </ChakraProvider>
          </UIProvider>
        </QuizProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default MyApp
