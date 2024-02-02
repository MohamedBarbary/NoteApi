// check success codes
// check failed codes
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const emailSender = require('./../utils/email');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // const cookieOptions = {
  //  expires: new Date(
  //      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //    ),
  //    httpOnly: true,
  //      sameSite: 'None',
  //  };
  //  cookieOptions.secure = true;

  res.cookie('jwt', token {
  path: "/",
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
});

  // Remove password from output
  user.password = undefined;
   res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
///////////////////////////
exports.signUp = catchAsyncError(async (req, res, next) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const verificationToken = user.generateVerificationToken();
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/verify/${verificationToken}`;
  // const url = 'how are you ';
  const html = `click <a href=${url}>here</a> to confirm your email.`;
  await emailSender.sendMail(user.email, html, 'verify mail');
  createSendToken(user, 201, res);
});
//////////////////////////////////////////////////////
exports.verify = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;
  // Check we have an id
  if (!token) {
    return res.status(400).send({
      message: 'Missing Token',
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  if (!payload) {
    next(new AppError('link is not valid', 400));
  }
  // Step 2 - Find user with matching ID
  const user = await User.findOne({ _id: payload.ID });

  if (!user) {
    next(new AppError('user not found', 404));
  }
  user.verified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).render('verify');
});
//////////////////////////////////////////
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('please enter email and password', 400));
  }
  const currentUser = await User.findOne({ email }).select('+password');
  if (
    !currentUser ||
    !(await currentUser.compareBcryptHashedCodes(
      password,
      currentUser.password
    ))
  ) {
    next(new AppError('invalid email or password', 400));
  }
  if (!currentUser.verified) {
    next(new AppError('please verify your email', 400));
  }
  createSendToken(currentUser, 200, res);
});
////////////////////////////
exports.protectRoutes = catchAsyncError(async (req, res, next) => {
  // 1)getting token if there is token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('your are not logged in! please login '), 401);
  }
  //2) Validation for token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  //3) get and check user
  const currentUser = await User.findById(decodedData.id);
  if (!currentUser) {
    return next(new AppError('user not exist please try again ', 404));
  }
  //4) Check if user change password after token was issued
  // if (currentUser.changePasswordAfter(decodedData.iat)) {
  //   return new AppError('user changed password , login with new one ', 401);
  // }
  req.user = currentUser;
  next();
});
///////////////////////////
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};
//////////////////////////
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  //1- find user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('no user found invalid mail', 404));
  }
  //2-
  if (!user.verified) {
    next(new AppError('please verify your email', 400));
  }
  // 3- send token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(user.passwordResetToken);
  console.log('===========================');
  // 4- send an email
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/editPassword/${resetToken}`;
  console.log(resetToken);
  const html = `click <a href=${url}>here</a> to reset your password.`;
  await emailSender.sendMail(user.email, html, 'reset password');
  res.status(200).json({
    status: 'success',
    message: 'we send mail for you to verify you mail',
  });
});

exports.editPassword = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // 1)Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //2)

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    res.status(404).render('404');
  }
  //3) update user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //4) send res
  res.status(200).json({
    status: 'success',
  });
});
