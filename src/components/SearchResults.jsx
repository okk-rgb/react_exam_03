import { useSearchParams, Link } from 'react-router-dom';
import { caytalogueData } from '../mock/catalog';
import Swal from 'sweetalert2';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import './SearchResults.css';

const SearchResults = ({ add, favorites, toggleFavorite }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Filter items match name or category (case-insensitive)
  const filtered = caytalogueData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

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
    
    let timerInterval;
    Swal.fire({
      title: "Savatga Qo`shildi",
      timer: 400,
      timerProgressBar: true,
      didOpen: () => {
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          if (timer) timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  };

  return (
    <section className="search-results-section">
      <h2 className="search-results-title">
        Qidiruv natijalari: "{query}"
      </h2>

      {filtered.length === 0 ? (
        <div className="no-results">
          <h3>Mahsulotlar topilmadi</h3>
          <p>Kechirasiz, so'rovingizga mos mahsulot topilmadi.</p>
          <Link to="/" className="home-btn">Bosh sahifa</Link>
        </div>
      ) : (
        <div className="deals-grid">
          {filtered.map((item) => (
            <Link className="deal-card" key={item.id} to={`/card/${item.id}`}>
              {/* Favorite Button */}
              <button
                className={`favorite-btn ${isFavorite(item) ? 'active' : ''}`}
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
                  <button onClick={(e) => handleAddToCart(e, item)} className="add-btn">
                    Savatga qo'shish +
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
