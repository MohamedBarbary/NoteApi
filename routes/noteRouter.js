const express = require('express');
const noteController = require('../controller/noteController');
const authController = require('./../controller/authController');
const router = express.Router();
router.route('/').post(authController.protectRoutes, noteController.createNote);
router
  .route('/:id')
  .patch(authController.protectRoutes, noteController.updateNote)
  .patch(authController.protectRoutes, noteController.deleteNote);
router.get(
  '/getAllNotes',
  authController.protectRoutes,
  noteController.getAllNotes
);

module.exports = router;
