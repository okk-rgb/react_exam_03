import './TopBar.css';
import { MdLocationOn, MdStore, MdPhone, MdHeadsetMic } from 'react-icons/md';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <div className="topbar-item">
            <MdLocationOn className="icon" />
            <span>O'zbekiston</span>
          </div>
          <div className="topbar-item">
            <MdStore className="icon" />
            <a href="#">Bizning do'konlar</a>
          </div>
        </div>
        <div className="topbar-right">
          <div className="topbar-item">
            <MdPhone className="icon" />
            <a href="tel:+998937051010">+998 93 705 10 10</a>
          </div>
          <div className="topbar-item">
            <MdHeadsetMic className="icon" />
            <a href="https://t.me/leon101009">Telegram Operator</a>
          </div>
          <div className="topbar-item language-selector">
            <img src="https://flagcdn.com/w20/uz.png" alt="UZ" />
            <span>O'zbekcha</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
