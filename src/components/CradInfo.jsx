import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '../services/api';
import Swal from 'sweetalert2';
import './CradInfo.css';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';

const CradInfo = ({ add, favorites = [], toggleFavorite, onOpenAuth, user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productApi
      .getById(id)
      .then((res) => {
        if (res.success && res.card) {
          setProduct(res.card);
          setMainImg(res.card.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
        }
      })
      .catch((err) => console.error('Fetch card detail error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
        <h2>Mahsulot ma'lumotlari yuklanmoqda...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Mahsulot topilmadi</h2>
      </div>
    );
  }

  const isFav = favorites.some((fav) => fav.id === product.id);
  const isSellerOrAdmin = user && (user.role === 'seller' || user.role === 'admin');

  const handleDelete = async () => {
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
          const res = await productApi.delete(product.id);
          if (res.success) {
            Swal.fire('O‘chirildi!', 'Mahsulot muvaffaqiyatli o‘chirildi.', 'success');
            navigate('/');
          } else {
            Swal.fire('Xatolik', res.message || 'O‘chirishda xatolik', 'error');
          }
        } catch (err) {
          Swal.fire('Xatolik', 'Server bilan bog‘lanishda xatolik', 'error');
        }
      }
    });
  };

  const handleBuyNow = async () => {
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
        await cartApi.addToCart(product.id, 1);
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

  return (
    <div className="product-detail">
      {/* LEFT */}
      <div className="product-gallery">
        <div className="thumbnail-list">
          <img src={mainImg} alt="" onClick={() => setMainImg(mainImg)} />
          <img src={mainImg} alt="" onClick={() => setMainImg(mainImg)} />
          <img src={mainImg} alt="" onClick={() => setMainImg(mainImg)} />
        </div>

        <div className="main-image">
          <img src={mainImg} alt={product.item_name} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="product-info">
        <h1>{product.item_name}</h1>
        <h2 style={{ color: '#ff6b00', fontSize: '32px', margin: '15px 0' }}>${product.price}</h2>

        {product.item_desc && (
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            {product.item_desc}
          </p>
        )}

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => add(product)} className="cart-btn" style={{ flex: 1 }}>
            Savatga qo'shish
          </button>

          <button
            onClick={handleBuyNow}
            style={{
              flex: 1,
              height: '56px',
              borderRadius: '12px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.3)',
            }}
          >
            <FiShoppingBag /> Sotib olish (Buy Now)
          </button>

          {isSellerOrAdmin && (
            <button
              onClick={handleDelete}
              style={{
                height: '56px',
                padding: '0 20px',
                borderRadius: '12px',
                border: 'none',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              }}
            >
              <FiTrash2 /> O'chirish
            </button>
          )}

          <button
            onClick={() => toggleFavorite(product)}
            className={`fav-btn-detail ${isFav ? 'active' : ''}`}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              background: 'white',
              cursor: 'pointer',
              color: isFav ? 'crimson' : '#999',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              transition: '0.2s',
            }}
          >
            {isFav ? <FaHeart /> : <FiHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CradInfo;