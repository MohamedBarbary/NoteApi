const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const noteRouter = require('./routes/noteRouter');
const AppError = require('./utils/appError');
const app = express();

app.use(cors({
  credentials: true,
  origin: '*', // Replace with your allowed origin
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: 'Content-Type',
}));

// app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));

// Parse cookies
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  },
}));

app.use('/api/v1/notes', noteRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
