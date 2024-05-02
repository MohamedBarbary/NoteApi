const Note = require('./../models/noteModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appError');
exports.createNote = catchAsyncError(async (req, res, next) => {
  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
  });
  const user = await User.findById(req.user._id);
  user.notes.push(note.id);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    note,
  });
});

exports.getAllNotes = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const notesPromises = user.notes.map(async (id) => await Note.findById(id));
  const notes = await Promise.all(notesPromises);
  res.status(200).json({
    status: 'success',
    notes,
  });
});

exports.updateNote = catchAsyncError(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
  });
});

exports.deleteNote = catchAsyncError(async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
  });
});
