import { useState, useEffect } from 'react';
import { productApi, cartApi } from '../services/api';
import Swal from 'sweetalert2';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiShoppingBag, FiPlusCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const CatalogDatas = ({ add, favorites = [], toggleFavorite, onOpenUpload, onOpenAuth, user }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productApi
      .getAll()
      .then((data) => {
        if (data.success) {
          setCards(data.cards || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (e, item) => {
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

  const isFavorite = (item) => favorites.some((fav) => fav.id === item.id);

  const handleFavoriteClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  const isSellerOrAdmin = user && (user.role === 'seller' || user.role === 'admin');

  return (
    <section style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Barcha mahsulotlar katalogi</h2>
        {onOpenUpload && isSellerOrAdmin && (
          <button
            onClick={onOpenUpload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ff6b00',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <FiPlusCircle /> Sotuvga mahsulot joylash
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Katalog yuklanmoqda...</div>
      ) : cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Katalogda mahsulotlar topilmadi</h3>
        </div>
      ) : (
        <div className="deals-grid">
          {cards.map((item) => {
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
                      <button onClick={(e) => addToCart(e, item)} className="add-btn" style={{ flex: 1 }}>
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

export default CatalogDatas;
