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
    highlight: 'Maxsus sovg‘a bilan!',
    badge: '+ sovg‘a Aqlli soat',
    desc: 'Eng so‘nggi avlod texnologiyalarini 30% chegirma bilan xarid qiling.',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80',
    card_id: 1,
  },
  {
    id: 2,
    title: 'Simsiz Quloqchinlar',
    highlight: 'Aksiya va Chegirmalar!',
    badge: 'Super Narx - 40% OFF',
    desc: 'Shovqinni bosuvchi va tiniq ovozli professional quloqchinlar.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
    card_id: 2,
  },
  {
    id: 3,
    title: 'Aqlli Soatlar va Gadjetlar',
    highlight: 'Yangilangan Kolleksiya',
    badge: 'Bepul Yetkazish',
    desc: 'Salomatlik va sport rejimlari uchun eng ideal aqlli soat.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
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

    try {
      if (slide.card_id) {
        await cartApi.addToCart(slide.card_id, 1);
      }
      navigate('/cart');
    } catch (err) {
      navigate('/cart');
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
