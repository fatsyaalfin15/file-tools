const { Router } = require('express');
const controller = require('../controllers/pdfController');
const { imageUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { imagesToPdfBody } = require('../validators/pdfSchema');

const router = Router();

router.post(
  '/pdf/from-images',
  imageUpload({ maxFiles: 10, maxSizeMb: 4 }).array('files', 10),
  validate(imagesToPdfBody, 'body'),
  controller.imagesToPdf
);

module.exports = router;