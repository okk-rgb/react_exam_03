import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Carts.css';
import { CiTrash } from 'react-icons/ci';
import { cartApi } from '../services/api';
import Swal from 'sweetalert2';

const Carts = ({ carts = [], remove, onOpenAuth }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchCartData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await cartApi.getCart();
      if (res.success) {
        setCartItems(res.cart || []);
        setTotalPrice(res.total_price || 0);
        setTotalItems(res.total_items || 0);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [token]);

  const handleUpdateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await cartApi.updateQuantity(cartItemId, newQty);
      if (res.success) {
        fetchCartData();
      }
    } catch (err) {
      Swal.fire('Xatolik', 'Miqdorni o‘zgartirishda xatolik', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId, index) => {
    if (token) {
      try {
        const res = await cartApi.removeFromCart(cartItemId);
        if (res.success) {
          fetchCartData();
        }
      } catch (err) {
        Swal.fire('Xatolik', 'Mahsulotni o‘chirishda xatolik', 'error');
      }
    } else if (remove) {
      remove(index);
    }
  };

  const handleBuy = async () => {
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

    if (cartItems.length === 0) {
      Swal.fire('Diqqat', 'Savatingiz bo‘sh!', 'warning');
      return;
    }

    Swal.fire({
      title: 'Xaridni tasdiqlaysizmi?',
      text: `Jami to'lov: ${totalPrice.toLocaleString()} $`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sotib olish',
      cancelButtonText: 'Bekor qilish',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cartApi.buy();
          if (res.success) {
            Swal.fire('Xarid amalga oshirildi!', `Buyurtma kodi: ${res.receipt.order_id}`, 'success');
            setCartItems([]);
            setTotalPrice(0);
            setTotalItems(0);
          } else {
            Swal.fire('Xatolik', res.message || 'Xarid jarayonida xatolik', 'error');
          }
        } catch (err) {
          Swal.fire('Xatolik', 'Server bilan bog‘lanishda xatolik', 'error');
        }
      }
    });
  };

  // Render combined or fallback local items if logged out
  const displayItems = token ? cartItems : carts;

  return (
    <div className="carts-container">
      <h2 className="carts-title">Mening savatim ({displayItems.length})</h2>

      {displayItems.length === 0 ? (
        <div className="empty-cart-view">
          <div className="div">
            <h3 className="empty-cart-title">Savatingiz hozircha bo'sh</h3>
            {!token && (
              <p style={{ margin: '10px 0', color: '#64748b' }}>
                Xaridlaringizni saqlash va ko'rish uchun{' '}
                <button
                  onClick={onOpenAuth}
                  style={{ color: '#ff6b00', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  tizimga kiring
                </button>
              </p>
            )}
            <Link to="/" className="home-btn">
              Bosh sahifa
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-content-layout">
          <div className="added_items">
            {displayItems.map((item, index) => {
              const cardData = item.card || item;
              const itemId = item.id;
              const imgUrl = cardData.thumbnail || cardData.img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
              const name = cardData.item_name || cardData.name || 'Mahsulot';
              const price = parseFloat(cardData.price) || 0;
              const qty = item.quantity || 1;

              return (
                <div key={itemId || index} className="items_card">
                  <img src={imgUrl} alt={name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div className="item-info">
                    <h2>{name}</h2>
                    <p className="item-price">{price} $</p>
                  </div>

                  {token && (
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(itemId, qty - 1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => handleUpdateQuantity(itemId, qty + 1)}>+</button>
                    </div>
                  )}

                  <button className="remove-btn" onClick={() => handleRemoveItem(itemId, index)}>
                    <CiTrash /> Olib Tashlash
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary-box">
            <h3>Buyurtma xulosasi</h3>
            <div className="summary-row">
              <span>Mahsulotlar soni:</span>
              <span>{token ? totalItems : displayItems.length} ta</span>
            </div>
            <div className="summary-row total">
              <span>Jami narxi:</span>
              <span className="total-price-text">
                {token
                  ? totalPrice.toLocaleString()
                  : displayItems.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0).toLocaleString()}{' '}
                $
              </span>
            </div>

            <button className="buy-now-btn" onClick={handleBuy}>
              Sotib olish (Buy Now)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;
