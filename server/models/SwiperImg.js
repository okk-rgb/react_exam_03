import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SwiperImg = sequelize.define('SwiperImg', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'swiper_img',
  timestamps: true,
});

export default SwiperImg;
