import React from 'react'
import Head from 'next/head'

interface MainLayoutProps {
  title: string
}

export const MainLayout: FCC<MainLayoutProps> = ({ children, title }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/static/img/tic-icon.svg' type='image/svg+xml' />
      </Head>
      {children}
    </React.Fragment>
  )
}
