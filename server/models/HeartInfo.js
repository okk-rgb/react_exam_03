import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HeartInfo = sequelize.define('HeartInfo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  card_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'heart_info',
  timestamps: true,
});

export default HeartInfo;
