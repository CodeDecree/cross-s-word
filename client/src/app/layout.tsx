import type { Metadata } from 'next'
import './globals.css'
import { GlobalContextProvider } from './context/store'
import Navbar from './components/Navbar'
import { Suspense } from 'react'
import Loading from './Loading'

export const metadata: Metadata = {
  title: 'Cross-s-Word',
  description: 'Play fun crossword puzzles and enhance your knowledge of the language. Invite your friends to play with you or solve the puzzles with random strangers. Time to socialize.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body> 
          <GlobalContextProvider>
            <Suspense fallback={<Loading />}>
              <Navbar />
              {children}
            </Suspense>
          </GlobalContextProvider>
      </body>
    </html>
  )
}
