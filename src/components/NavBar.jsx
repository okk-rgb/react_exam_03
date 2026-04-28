import './NavBar.css';
import { FiChevronRight } from 'react-icons/fi';

const NavBar = () => {
  const links = [
    "Telefonlar va planshetlar",
    "B/U smartfonlar",
    "Trade-in",
    "Aksessuarlar va gadjetlar",
    "Foto va video texnika",
    "Dyson",
    "Radarlar",
    "Kompyuterlar va noutbuklar",
    "Sport va hordiq",
    "Bolalar tovarlari",
    "Uy va ofis"
  ];

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {links.map((link, idx) => (
          <li key={idx} className="nav-item">
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>
      <button className="nav-more-btn">
        <FiChevronRight />
      </button>
    </nav>
  );
};

export default NavBar;
