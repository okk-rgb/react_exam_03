import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { caytalogueData } from '../mock/catalog'
import Swal from 'sweetalert2'
import './CradInfo.css'

const CradInfo = ({ add }) => {
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
  }

  const product = caytalogueData.find((item) => item.id === Number(id))
  const [mainImg, setMainImg] = useState(product.img)

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

        <button onClick={() => addTocart(product)} className="cart-btn">
          Savatga qo'shish
        </button>
      </div>
    </div>
  )
}

export default CradInfo