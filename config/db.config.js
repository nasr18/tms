const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('connection established successfully!');
  } catch (err) {
    console.error('error while establishing db connection:', err);
  }
}

module.exports = {
  sequelize,
  connectDB,
};
