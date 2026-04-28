import React from 'react'
import HeroBanner from '../../components/HeroBanner'
import QuickCategories from '../../components/QuickCategories'
import DealsSection from '../../components/DealsSection'

const Home = ({ add }) => {
  return (
    <div>
      <HeroBanner />
        <QuickCategories />
        <DealsSection childAdd={add}/>
    </div>
  )
}

export default Home
