import './App.css';
import TopBar from './components/TopBar';
import MainHeader from './components/MainHeader';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Carts from './components/Carts';
import Favourite from './components/Favourite';
import CatalogDatas from './components/CatalogDatas';
import CradInfo from './components/CradInfo';
import SearchResults from './components/SearchResults';
import AuthModal from './components/AuthModal';
import UploadProductModal from './components/UploadProductModal';
import { useState, useEffect } from 'react';
import { cartApi, favoriteApi } from './services/api';
import Swal from 'sweetalert2';

function App() {
  const [addCart, setAddCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Check auth user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch Cart and Favorites from API if authenticated
  const syncCartAndFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [cartRes, favRes] = await Promise.all([
        cartApi.getCart(),
        favoriteApi.getFavorites(),
      ]);

      if (cartRes.success) {
        setAddCart(cartRes.cart || []);
      }
      if (favRes.success) {
        setFavorites((favRes.favorites || []).map((f) => f.card || f));
      }
    } catch (err) {
      console.error('Error syncing cart/favorites:', err);
    }
  };

  useEffect(() => {
    if (user) {
      syncCartAndFavorites();
    }
  }, [user]);

  // Add to cart with Auth Guard
  const add = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Tizimga kiring',
        text: 'Savatga mahsulot qo‘shish uchun iltimos avval tizimga kiring!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Kirish',
        cancelButtonText: 'Bekor qilish',
      }).then((result) => {
        if (result.isConfirmed) {
          setIsAuthOpen(true);
        }
      });
      return;
    }

    try {
      const cardId = product.id;
      const res = await cartApi.addToCart(cardId, 1);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Savatga qo‘shildi!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
        syncCartAndFavorites();
      } else {
        Swal.fire('Xatolik', res.message || 'Savatga qo‘shishda xatolik', 'error');
      }
    } catch (err) {
      setAddCart((prev) => [...prev, product]);
    }
  };

  // Cart Delete
  const cartDelete = async (removeIndex) => {
    const token = localStorage.getItem('token');
    const itemToRemove = addCart[removeIndex];
    if (token && itemToRemove && itemToRemove.id) {
      try {
        await cartApi.removeFromCart(itemToRemove.id);
        syncCartAndFavorites();
      } catch (err) {
        setAddCart((prev) => prev.filter((_, index) => index !== removeIndex));
      }
    } else {
      setAddCart((prev) => prev.filter((_, index) => index !== removeIndex));
    }
  };

  // Toggle Favorite with Auth Guard
  const toggleFavorite = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Tizimga kiring',
        text: 'Sevimli mahsulotlarga qo‘shish uchun iltimos avval tizimga kiring!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Kirish',
        cancelButtonText: 'Bekor qilish',
      }).then((result) => {
        if (result.isConfirmed) {
          setIsAuthOpen(true);
        }
      });
      return;
    }

    try {
      const isFav = favorites.some((fav) => fav.id === item.id);
      if (isFav) {
        await favoriteApi.removeFavorite(item.id);
      } else {
        await favoriteApi.addFavorite(item.id);
      }
      syncCartAndFavorites();
    } catch (err) {
      setFavorites((prev) => {
        const exists = prev.some((fav) => fav.id === item.id);
        return exists ? prev.filter((fav) => fav.id !== item.id) : [...prev, item];
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAddCart([]);
    setFavorites([]);
    Swal.fire('Chiqildi', 'Tizimdan muvaffaqiyatli chiqdingiz', 'info');
  };

  return (
    <div className="app-main">
      <TopBar />
      <div className="container">
        <MainHeader
          cartCount={addCart.length}
          favoritesCount={favorites.length}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onLogout={handleLogout}
        />
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                add={add}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                user={user}
              />
            }
          />
          <Route
            path="cart"
            element={<Carts remove={cartDelete} carts={addCart} onOpenAuth={() => setIsAuthOpen(true)} />}
          />
          <Route
            path="/favourites"
            element={<Favourite favorites={favorites} toggleFavorite={toggleFavorite} add={add} />}
          />
          <Route
            path="/catalog_datas"
            element={
              <CatalogDatas
                add={add}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                user={user}
              />
            }
          />
          <Route
            path="/card/:id"
            element={
              <CradInfo
                add={add}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchResults
                add={add}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
        </Routes>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          syncCartAndFavorites();
        }}
      />

      <UploadProductModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onProductUploaded={() => {
          syncCartAndFavorites();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default App;
