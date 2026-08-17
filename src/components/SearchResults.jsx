import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '../services/api';
import Swal from 'sweetalert2';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import './SearchResults.css';

const SearchResults = ({ add, favorites, toggleFavorite, onOpenAuth }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    productApi
      .getAll({ search: query })
      .then((data) => {
        if (data.success) {
          setFilteredCards(data.cards || []);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

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

  const handleBuyNow = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Tizimga kiring',
        text: 'Mahsulot sotib olish uchun iltimos avval tizimga kiring!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Kirish',
        cancelButtonText: 'Bekor qilish',
      }).then((result) => {
        if (result.isConfirmed && onOpenAuth) {
          onOpenAuth();
        }
      });
      return;
    }

    try {
      await cartApi.addToCart(item.id, 1);
      navigate('/cart');
    } catch (err) {
      Swal.fire('Xatolik', 'Savatga qo‘shishda xatolik', 'error');
    }
  };

  return (
    <section className="search-results-section">
      <h2 className="search-results-title">Qidiruv natijalari: "{query}"</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Qidirilmoqda...</div>
      ) : filteredCards.length === 0 ? (
        <div className="no-results">
          <h3>Mahsulotlar topilmadi</h3>
          <p>Kechirasiz, so'rovingizga mos mahsulot topilmadi.</p>
          <Link to="/" className="home-btn">
            Bosh sahifa
          </Link>
        </div>
      ) : (
        <div className="deals-grid">
          {filteredCards.map((item) => {
            const imgUrl = item.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
            const price = parseFloat(item.price) || 0;

            return (
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
                  <img src={imgUrl} alt={item.item_name} />
                </div>

                {/* Card Info */}
                <div className="card-info">
                  <h3 className="category">{item.item_name}</h3>
                  <div className="card-footer" style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
                    <span className="price">${price}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => handleAddToCart(e, item)} className="add-btn" style={{ flex: 1 }}>
                        Savatga +
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(e, item)}
                        style={{
                          background: '#0f172a',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FiShoppingBag /> Sotib olish
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
