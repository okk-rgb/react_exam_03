import { useState, useEffect } from 'react';
import { productApi, cartApi } from '../services/api';
import Swal from 'sweetalert2';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiShoppingBag, FiPlusCircle, FiTrash2 } from 'react-icons/fi';
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

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Mahsulotni o‘chirmoqchimisiz?',
      text: 'Ushbu amalni ortga qaytarib bo‘lmaydi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ha, o‘chirish',
      cancelButtonText: 'Bekor qilish',
      confirmButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await productApi.delete(id);
          if (res.success) {
            Swal.fire('O‘chirildi!', 'Mahsulot muvaffaqiyatli o‘chirildi.', 'success');
            setCards((prev) => prev.filter((item) => item.id !== id));
          } else {
            Swal.fire('Xatolik', res.message || 'O‘chirishda xatolik', 'error');
          }
        } catch (err) {
          Swal.fire('Xatolik', 'Server bilan bog‘lanishda xatolik', 'error');
        }
      }
    });
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

    const { value: location } = await Swal.fire({
      title: 'Yetkazib berish manzilini kiriting',
      input: 'text',
      inputLabel: 'Yetkazib berish manzili',
      inputPlaceholder: 'Masalan: Toshkent sh., Chilonzor t., 10-mavze, 5-uy',
      showCancelButton: true,
      confirmButtonText: 'Sotib olish',
      cancelButtonText: 'Bekor qilish',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Iltimos, yetkazib berish manzilini kiriting!';
        }
      },
    });

    if (location) {
      try {
        await cartApi.addToCart(item.id, 1);
        const res = await cartApi.buy(location);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Xarid muvaffaqiyatli amalga oshirildi!',
            html: `<b>Buyurtma kodi:</b> ${res.receipt.order_id}<br/><b>Yetkazib berish manzili:</b> ${res.receipt.delivery_location}<br/><b>Jami summasi:</b> $${res.receipt.total_price}`,
          });
        }
      } catch (err) {
        Swal.fire('Xatolik', 'Savatga qo‘shish yoki xarid qilishda xatolik', 'error');
      }
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

                {/* Delete Button for Seller / Admin */}
                {isSellerOrAdmin && (
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Mahsulotni o'chirish"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    <FiTrash2 />
                  </button>
                )}

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
