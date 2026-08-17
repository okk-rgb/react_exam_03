import React, { useState } from 'react';
import './AuthModal.css';
import { authApi } from '../services/api';
import Swal from 'sweetalert2';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authApi.register({
          user_name: username,
          user_password: password,
          user_number: phone,
          role,
        });

        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          Swal.fire('Muvaffaqiyatli!', 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!', 'success');
          onLoginSuccess(res.user);
          onClose();
        } else {
          Swal.fire('Xatolik', res.message || (res.errors && res.errors.join(', ')), 'error');
        }
      } else {
        const res = await authApi.login({
          user_name: username,
          user_password: password,
        });

        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          Swal.fire('Muvaffaqiyatli!', 'Tizimga kirdingiz!', 'success');
          onLoginSuccess(res.user);
          onClose();
        } else {
          Swal.fire('Xatolik', res.message || 'Foydalanuvchi nomi yoki parol noto‘g‘ri', 'error');
        }
      }
    } catch (err) {
      Swal.fire('Xatolik', 'Server bilan bog‘lanishda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="auth-title">{isRegister ? 'Ro‘yxatdan o‘tish' : 'Tizimga kirish'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Foydalanuvchi nomi</label>
            <input
              type="text"
              required
              placeholder="Username kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              required
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>Telefon raqam</label>
                <input
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Rol (Sotuvchi yoki Xaridor)</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Xaridor (User)</option>
                  <option value="seller">Sotuvchi (Seller - yuklash ruxsati bilan)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Kutmoqda...' : isRegister ? 'Ro‘yxatdan o‘tish' : 'Kirish'}
          </button>
        </form>

        <p className="toggle-mode" onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? 'Hisobingiz bormi? Kirish'
            : 'Hisobingiz yo‘qmi? Ro‘yxatdan o‘tish'}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
