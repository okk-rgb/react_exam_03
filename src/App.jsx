import './App.css';
import TopBar from './components/TopBar';
import MainHeader from './components/MainHeader';
import NavBar from './components/NavBar';
import HeroBanner from './components/HeroBanner';
import QuickCategories from './components/QuickCategories';
import DealsSection from './components/DealsSection';
import FloatingActions from './components/FloatingActions';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Carts from './components/Carts';
import Favourite from './components/Favourite'
import { useState } from 'react';
// import { caytalogueData } from './mock/catalog';
import CatalogDatas from './components/CatalogDatas';
import CradInfo from './components/CradInfo';
import SearchResults from './components/SearchResults';

function App() {
  const [addCart, setAddCart] = useState([])
  const [favorites, setFavorites] = useState([])

  const add = (pros) => {
    setAddCart((asad)=> [...asad,pros])
  }

  const cartDelete = (remove) => {
    setAddCart((bobur)=> bobur.filter((asad, index) => index !== remove))
  }

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <div className="app-main">
      <TopBar />
      <div className="container">
        <MainHeader cartCount={addCart.length} favoritesCount={favorites.length} />
        <NavBar />
        <Routes>
          <Route path='/' element={<Home add={add} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path='cart' element={<Carts remove={cartDelete} carts={addCart}/>}/>
          <Route path='/favourites' element={<Favourite favorites={favorites} toggleFavorite={toggleFavorite} add={add} />} />
          <Route path='/catalog_datas' element={<CatalogDatas add={add} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path='/card/:id' element={<CradInfo add={add} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path='/search' element={<SearchResults add={add} favorites={favorites} toggleFavorite={toggleFavorite} />} />
        </Routes>
        {/* <HeroBanner />
        <QuickCategories />
        <DealsSection/> */}
      </div>
      <FloatingActions />
    </div>
  )
}


export default App;
