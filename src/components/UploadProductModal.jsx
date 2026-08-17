import React, { useState, useEffect } from 'react';
import './UploadProductModal.css';
import { productApi, categoryApi } from '../services/api';
import Swal from 'sweetalert2';

const UploadProductModal = ({ isOpen, onClose, onProductUploaded }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      categoryApi.getAll().then((data) => {
        if (data.success) {
          setCategories(data.categories || []);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await productApi.create({
        item_name: itemName,
        price: parseFloat(price),
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        item_desc: itemDesc,
        category_id: categoryId ? parseInt(categoryId) : null,
      });

      if (res.success) {
        Swal.fire('Muvaffaqiyatli!', 'Mahsulotingiz sotuvga joylashtirildi!', 'success');
        if (onProductUploaded) onProductUploaded(res.card);
        onClose();
        setItemName('');
        setPrice('');
        setThumbnail('');
        setItemDesc('');
      } else {
        Swal.fire('Xatolik', res.message || 'Mahsulot joylashda xatolik', 'error');
      }
    } catch (err) {
      Swal.fire('Xatolik', 'Server bilan bog‘lanishda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="upload-title">Sotish uchun mahsulot joylash</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Mahsulot nomi *</label>
            <input
              type="text"
              required
              placeholder="Masalan: Wireless Headphone"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Narxi ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="99.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rasm URL manzili</label>
            <input
              type="text"
              placeholder="https://..."
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Kategoriya</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Kategoriyani tanlang</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tavsif</label>
            <textarea
              rows="3"
              placeholder="Mahsulot haqida batafsil ma'lumot..."
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Joylashtirilmoqda...' : 'Sotuvga chiqarish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProductModal;
