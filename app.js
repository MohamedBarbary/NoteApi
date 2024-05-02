const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const noteRouter = require('./routes/noteRouter');
const AppError = require('./utils/appError');
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(helmet());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));
app.use('/api/v1/notes', noteRouter);
app.use('/api/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
