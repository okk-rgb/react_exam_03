import './MainHeader.css';
import { FiSearch, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi';
import { BsGridFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { staticData } from '../mock/data';

const MainHeader = () => {
  return (
    <header className="main-header">
      <Link to={'/'}><div className="logo-section">
        <div className="orange-bag">
          <div className="bag-handle"></div>
          <div className="bag-body"></div>
        </div>
        <h1 className="logo-text">OPEN <span className="text-orange">SHOP</span></h1>
      </div></Link>
      
      <button popoverTarget='modal'  className="category-btn">
        <BsGridFill className="cat-icon" />

        <div popover='modal' className='modal' id='modal'>
            <div className="catalog-wrapper">
                  {staticData.map((category) => (
                    <div key={category.id} className="category-row group">
                      
                      {/* 1. Chap tomondagi asosiy menyu punkti */}
                      <div className="menu-item">
                        <span className="name">{category.name}</span>
                        <span className="arrow">{'>'}</span>
                      </div>
            
                      {/* 2. O'ng tomonda ochiladigan content (Hover bo'lganda chiqadi) */}
                      <div className="submenu-content">
                        <div className="header-title">
                          {category.name} <span className="count">({category.subItem[0]?.subStatic?.length || 0})</span>
                        </div>
                        
                        <div className="grid-container">
                          {category.subItem.map((sub, idx) => (
                            <div key={idx} className="sub-column">
                              <h3 className="sub-title">{sub.subName}</h3>
                              <ul className="product-list">
                                {(sub.subStatic || sub.subSTatic)?.map((prod) => (
                                  <li key={prod.id}>
                                    <Link to={'/catalog_datas'}>{prod.name} <span className="stock">({prod.stock})</span></Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
            
                    </div>
                  ))}
                </div>



        </div>
      </button>

      <div className="search-bar">
        <input type="text" placeholder="Mahsulotlarni izlash..." />
        <button className="search-btn">
          <FiSearch />
        </button>
      </div>

      <div className="header-actions">
        <div className="action-item">
          <Link to={'/cart'}><FiShoppingCart className="action-icon" /></Link>
          <span>Savat</span>
        </div>
        <div className="action-item">
          <Link to={'/favourites'}><FiHeart className="action-icon" /></Link>
          <span>Sevimililar</span>
        </div>
        <div className="action-item">
          <FiUser className="action-icon" />
          <span>Kirish</span>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
