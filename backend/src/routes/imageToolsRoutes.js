const { Router } = require('express');
const controller = require('../controllers/imageToolsController');
const { imageUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { watermarkBody } = require('../validators/watermarkSchema');

const router = Router();

router.post('/images/inspect', imageUpload().single('file'), controller.inspect);
router.post('/images/strip-metadata', imageUpload().single('file'), controller.stripMetadata);
router.post(
  '/images/watermark',
  imageUpload().single('file'), // urutan penting: upload dulu, baru validasi field teks
  validate(watermarkBody, 'body'),
  controller.watermark
);

module.exports = router;
