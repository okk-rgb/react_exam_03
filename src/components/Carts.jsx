  import React from 'react'
  import { Link } from 'react-router-dom'
  import './Carts.css'
  import { CiTrash } from 'react-icons/ci'

  const Carts = ({ carts, remove }) => {
    return (
      <div className="carts-container">
        <h2 className="carts-title">Mening savatim</h2>
        
        <div className="empty-cart-view">
          {carts.length === 0 ? (<div className="div"><h3 className="empty-cart-title">Savatingiz hozircha bo'sh</h3>
          <Link to="/" className="home-btn">
            Bosh sahifa
          </Link></div>) 
          :
          ( <div className="added_items">
            {carts.map((item, index) => (
  <div key={index} className="items_card">
    <img src={item.img} alt={item.name} style={{ width: '100px' }} />
    <h2>{item.name}</h2>
    <p>{item.price} $</p>
    <button onClick={() => remove(index)}><CiTrash /> Olib Tashlash</button>
  </div>
))}
          </div>
          ) }
        </div>
      </div>
    )
  }

  export default Carts

