import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { caytalogueData } from '../mock/catalog'
import Swal from 'sweetalert2'
import './CradInfo.css'
import { FaHeart } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'

const CradInfo = ({ add, favorites = [], toggleFavorite }) => {
  const { id } = useParams()

  const addTocart = (product) => {
    add(product)
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
  }

  const product = caytalogueData.find((item) => item.id === Number(id) || item.id === id)
  const [mainImg, setMainImg] = useState(product?.img || '')

  if (!product) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2>Mahsulot topilmadi</h2>
      </div>
    );
  }

  const isFav = favorites.some((fav) => fav.id === product.id);

  return (
    <div className="product-detail">
      {/* LEFT */}
      <div className="product-gallery">
        <div className="thumbnail-list">
          <img src={product.img} alt="" onClick={() => setMainImg(product.img)} />
          <img src={product.img} alt="" onClick={() => setMainImg(product.img)} />
          <img src={product.img} alt="" onClick={() => setMainImg(product.img)} />
        </div>

        <div className="main-image">
          <img src={mainImg} alt={product.name} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="product-info">
        <h1>{product.name}</h1>
        <h2>${product.price}</h2>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => addTocart(product)} className="cart-btn" style={{ flex: 1 }}>
            Savatga qo'shish
          </button>
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
  )
}

export default CradInfo