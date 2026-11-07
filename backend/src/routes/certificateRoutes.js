const { Router } = require('express');
const controller = require('../controllers/certificateController');
const validate = require('../middleware/validate');
const { certificateBody } = require('../validators/certificateSchema');

const router = Router();

router.post('/certificates', validate(certificateBody, 'body'), controller.create);

module.exports = router;