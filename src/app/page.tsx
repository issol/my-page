'use client'

import { NextPage } from 'next'

import dynamic from 'next/dynamic'

const Home = dynamic(() => import('./components/home'), {
  ssr: false,
})

const HomePage: NextPage = () => {
  return <Home></Home>
}

export default HomePage
