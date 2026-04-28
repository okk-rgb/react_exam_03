import './FloatingActions.css';
import { FaTelegramPlane } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FloatingActions = () => {
  return (
    <div className="floating-actions">
      <button className="float-btn telegram">
        <a href="https://t.me/leon101009"><FaTelegramPlane /> </a> 
      </button>
      <button className="float-btn phone">
        <FiPhoneCall />
      </button>
    </div>
  );
};

export default FloatingActions;
