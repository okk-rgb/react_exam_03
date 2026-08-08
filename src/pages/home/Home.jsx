import React from 'react'
import HeroBanner from '../../components/HeroBanner'
import QuickCategories from '../../components/QuickCategories'
import DealsSection from '../../components/DealsSection'

const Home = ({ add, favorites, toggleFavorite }) => {
  return (
    <div>
      <HeroBanner />
      <QuickCategories />
      <DealsSection childAdd={add} favorites={favorites} toggleFavorite={toggleFavorite} />
    </div>
  )
}


export default Home
