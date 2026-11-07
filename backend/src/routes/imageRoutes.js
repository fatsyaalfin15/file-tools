const { Router } = require('express');
const controller = require('../controllers/imageController');
const { imageUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { compressBody } = require('../validators/imageSchema');

const router = Router();

router.post(
  '/images/compress',
  imageUpload().single('file'), // urutan penting: upload dulu, baru validasi field teks
  validate(compressBody, 'body'),
  controller.compress
);

module.exports = router;