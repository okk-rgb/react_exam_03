import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="banner-content banner-left">
        <h2 className="banner-title">Planshet<br/> xarid qiling</h2>
        <div className="banner-badge">
          + sovg'a <span>Aqlli soat</span>
        </div>
      </div>
      
      <div className="banner-center">
        <Link to={'/cart'}><button className="buy-btn">Xarid qilish</button></Link>
      </div>

      <div className="banner-content banner-right">
        <h2 className="banner-title right-title">Quloqchinlar<br/> <span className="highlight-red">aksiyada!</span></h2>
      </div>
    </div>
  );
};

export default HeroBanner;
