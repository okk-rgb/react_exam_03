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

function App() {
  const [addCart, setAddCart] = useState([])

  const add = (pros) => {
    setAddCart((asad)=> [...asad,pros])
  }

  const cartDelete = (remove) => {
    setAddCart((bobur)=> bobur.filter((asad, index) => index !== remove))
    
  }
    return (
    <div className="app-main">
      <TopBar />
      <div className="container">
        <MainHeader />
        <NavBar />
        <Routes>
          <Route path='/' element={<Home add={add}/>}/>
          <Route path='cart' element={<Carts remove={cartDelete} carts={addCart}/>}/>
          <Route path='/favourites' element={<Favourite/>}/>
          <Route path='/catalog_datas' element={<CatalogDatas add={add}/>}/>
          <Route path='/card/:id' element={<CradInfo add={add}/>}/>

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
