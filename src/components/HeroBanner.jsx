import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeroBanner.css';
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { cartApi } from '../services/api';
import Swal from 'sweetalert2';

const defaultSlides = [
  {
    id: 1,
    title: 'Planshet va Noutbuklar',
    item_name: 'Planshet va Noutbuklar',
    highlight: 'Maxsus sovg‘a bilan!',
    badge: '+ sovg‘a Aqlli soat',
    desc: 'Eng so‘nggi avlod texnologiyalarini 30% chegirma bilan xarid qiling.',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80',
    price: 299.99,
    card_id: 1,
  },
  {
    id: 2,
    title: 'Simsiz Quloqchinlar',
    item_name: 'Simsiz Quloqchinlar',
    highlight: 'Aksiya va Chegirmalar!',
    badge: 'Super Narx - 40% OFF',
    desc: 'Shovqinni bosuvchi va tiniq ovozli professional quloqchinlar.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
    price: 199.99,
    card_id: 2,
  },
  {
    id: 3,
    title: 'Aqlli Soatlar va Gadjetlar',
    item_name: 'Aqlli Soatlar va Gadjetlar',
    highlight: 'Yangilangan Kolleksiya',
    badge: 'Bepul Yetkazish',
    desc: 'Salomatlik va sport rejimlari uchun eng ideal aqlli soat.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
    price: 249.50,
    card_id: 3,
  },
];

const HeroBanner = ({ add, onOpenAuth }) => {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-play swiper every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleAddToCart = async (slide) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (add) {
        add({
          id: slide.card_id || slide.id,
          item_name: slide.title || slide.item_name,
          thumbnail: slide.img || slide.thumbnail,
          price: slide.price || 199.99,
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Savatga qo‘shildi!',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (slide.card_id) {
        await cartApi.addToCart(slide.card_id, 1);
      }
      Swal.fire({
        icon: 'success',
        title: 'Savatga qo‘shildi!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire('Xatolik', 'Savatga qo‘shishda xatolik', 'error');
    }
  };

  const handleBuySlide = async (slide) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Tizimga kiring',
        text: 'Sotib olish uchun iltimos avval tizimga kiring!',
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
        if (slide.card_id) {
          await cartApi.addToCart(slide.card_id, 1);
        }
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

  const activeSlide = slides[currentIndex] || defaultSlides[0];

  return (
    <div className="hero-swiper-container">
      <div
        className="swiper-slide-item"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 100%), url(${activeSlide.img})` }}
      >
        <div className="slide-content">
          <div className="banner-badge">{activeSlide.badge}</div>
          <h2 className="banner-title">
            {activeSlide.title} <br />
            <span className="highlight-orange">{activeSlide.highlight}</span>
          </h2>
          <p className="slide-desc">{activeSlide.desc}</p>

          <div className="slide-actions">
            <button className="buy-btn" onClick={() => handleBuySlide(activeSlide)}>
              <FiShoppingBag /> Xarid qilish (Buy Now)
            </button>
            <button
              onClick={() => handleAddToCart(activeSlide)}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
            >
              Savatga +
            </button>
            <Link to="/catalog_datas" className="catalog-link-btn">
              Katalogni ko'rish
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="swiper-nav-btn prev" onClick={handlePrev}>
        <FiChevronLeft />
      </button>
      <button className="swiper-nav-btn next" onClick={handleNext}>
        <FiChevronRight />
      </button>

      {/* Pagination Dots */}
      <div className="swiper-pagination-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
