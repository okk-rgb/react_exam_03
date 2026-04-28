import React from 'react'
import { Link } from 'react-router-dom'
import './Favourite.css'

const Carts = () => {
  return (
    <div className="fav-container">
      <h2 className="fav-title">Mening sevimlilarim</h2>
      
      <div className="empty-fav-view">
        <h3 className="empty-fav-title">Sevimlilar hozircha bo'sh</h3>
        <Link to="/" className="home-btn">
          Bosh sahifa
        </Link>
      </div>
    </div>
  )
}

export default Carts

