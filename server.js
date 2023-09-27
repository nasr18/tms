require('dotenv').config();
const { createServer } = require('http');

const app = require('./app');
const { connectDB, sequelize } = require('./config/db.config');

const port = process.env.PORT ?? 3000;
const server = createServer(app);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
  shutdownProperly(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at promise', reason);
  shutdownProperly(2);
});

process.on('SIGINT', () => {
  console.info('Caught SIGINT');
  shutdownProperly(128 + 2);
});

process.on('SIGTERM', () => {
  console.info('Caught SIGTERM');
  shutdownProperly(128 + 2);
});

process.on('exit', () => {
  console.info('Exiting');
});

function shutdownProperly(exitCode) {
  Promise.resolve()
    .then(() => server.close())
    .then(() => {
      console.info('Shutdown complete');
      process.exit(exitCode);
    })
    .catch((err) => {
      console.error('Error during shutdown', err);
      process.exit(1);
    });
}

server.listen(port, async () => {
  console.log('TMS server running on port ', port);
  await connectDB();
  sequelize
    .sync({ force: false })
    .then(() => console.log('Synced database successfully!'));
});
