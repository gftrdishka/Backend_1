module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transportDateTime: { type: DataTypes.DATE, allowNull: false },
    cargoWeight: { type: DataTypes.FLOAT, allowNull: false },
    cargoDimensions: { type: DataTypes.STRING, allowNull: false }, // например: "100x50x40"
    fromAddress: { type: DataTypes.STRING, allowNull: false },
    toAddress: { type: DataTypes.STRING, allowNull: false },
    cargoType: { type: DataTypes.ENUM('хрупкое', 'скоропортящееся', 'требуется рефрижератор', 'животные', 'жидкость', 'мебель', 'мусор'), allowNull: false },
    status: { type: DataTypes.ENUM('Новая', 'В работе', 'Отменена', 'Выполнено'), defaultValue: 'Новая' },
    feedback: { type: DataTypes.TEXT, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'requests',
    timestamps: true,
  });
  return Request;
};
