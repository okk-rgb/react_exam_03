import './QuickCategories.css';
import { FiChevronRight } from 'react-icons/fi';

const QuickCategories = () => {
  const categories = [
    { label: "Xorijdan buyurtmalar", emoji: "🇰🇷" },
    { label: "Telefonlar va planshetlar", emoji: "📱" },
    { label: "B/U smartfonlar", emoji: "🔄" },
    { label: "Trade-in", emoji: "🔁" },
    { label: "Aksessuarlar va gadjetlar", emoji: "🎧" },
    { label: "Foto va video texnika", emoji: "📸" }
  ];

  return (
    <div className="quick-categories-container">
      <div className="quick-categories">
        {categories.map((cat, idx) => (
          <div key={idx} className="qc-item">
            <div className="qc-icon">{cat.emoji}</div>
            <span className="qc-label">{cat.label}</span>
          </div>
        ))}
      </div>
      <button className="qc-next-btn">
        <FiChevronRight />
      </button>
    </div>
  );
};

export default QuickCategories;
