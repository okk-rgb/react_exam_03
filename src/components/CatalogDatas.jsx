import { useState } from 'react';
import { caytalogueData } from '../mock/catalog'
import Swal from 'sweetalert2';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CatalogDatas = ({ add, favorites = [], toggleFavorite }) => {

  const addToCart = (e, item) => {
      e.preventDefault();
      e.stopPropagation();
      add(item)
      // alert
      let timerInterval;
  Swal.fire({
    title: "Savatga Qo`shildi",
    // html: "I will close in <b></b> milliseconds.",
    timer: 400,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        if (timer) timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) console.log("I was closed by the timer");
  });
  
      console.log('ishladi');
    }

  const isFavorite = (item) => favorites.some((fav) => fav.id === item.id);

  const handleFavoriteClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };


  return (
    <section>
      <div className="deals-grid">
              {caytalogueData.map((item) => (
                <Link className="deal-card" key={item.id} to={`/card/${item.id}`}>
                  
                  {/* Favorite Button */}
                  <button
                    className={`favorite-btn ${
                      isFavorite(item) ? 'active' : ''
                    }`}
                    onClick={(e) => handleFavoriteClick(e, item)}
                  >
                    {isFavorite(item) ? <FaHeart /> : <FiHeart />}
                  </button>
      
                  {/* Product Image */}
                  <div className="card-img">
                    <img src={item.img} alt={item.name} />
                  </div>
      
                  {/* Card Info */}
                  <div className="card-info">
                    <h3 className="category">{item.name}</h3>
      
                    <div className="card-footer">
                      <span className="price">${item.price}</span>
                      <button onClick={(e) => addToCart(e, item)} className="add-btn">Savatga qo'shish +</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
    </section>
  )
}


export default CatalogDatas
