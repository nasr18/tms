const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const createHttpError = require('http-errors');

const taskRouter = require('./task/task.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to TMS by inFeedo!' });
});

app.use('/api/tasks', taskRouter);

// catch 404 & forward to error handler
app.use((req, res, next) => {
  console.log('handle 404');
  next(createHttpError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log('handle 500:', err);
  res.status(err.status || 500);
  res.json({ msg: err.message, data: null });
});

module.exports = app;
