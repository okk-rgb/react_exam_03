import './DealsSection.css';
import { FiChevronRight, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { caytalogueData } from '../mock/catalog';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

const DealsSection = ({ childAdd }) => {
  const featuredDeals = caytalogueData;
  const [favorites, setFavorites] = useState([]);

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
      timer.textContent = `${Swal.getTimerLeft()}`;
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

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
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
                favorites.includes(item.id) ? 'active' : ''
              }`}
              onClick={() => toggleFavorite(item.id)}
            >
              {favorites.includes(item.id) ? <FaHeart /> : <FiHeart />}
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
                <button onClick={() => add(item)} className="add-btn">Savatga qo'shish +</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
