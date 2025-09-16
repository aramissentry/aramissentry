const express = require('express');
const { formHandler } = require('../controllers/formController');

const router = express.Router();

router.post('/contact-us', formHandler)

export { router };
