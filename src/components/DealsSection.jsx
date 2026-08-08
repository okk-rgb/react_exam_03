import './DealsSection.css';
import { FiChevronRight, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { caytalogueData } from '../mock/catalog';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const DealsSection = ({ childAdd, favorites = [], toggleFavorite }) => {
  const featuredDeals = caytalogueData;

  const add = (item) => {
    childAdd(item)
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

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    add(item);
  };

  return (
    <section className="deals-section">
      <div className="section-header">
        <h2 className="section-title">Aksiya va Chegirmalar</h2>
        <button className="view-all-btn">
          Barchasini ko'rish <FiChevronRight />
        </button>
      </div>

      <div className="deals-grid">
        {featuredDeals.map((item) => (
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
                <button onClick={(e) => handleAddToCart(e, item)} className="add-btn">Savatga qo'shish +</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};


export default DealsSection;
