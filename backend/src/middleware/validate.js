const AppError = require('../utils/AppError');

module.exports = (schema, source = 'query') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(new AppError(result.error.issues[0].message, 400));
  }
  req.validated = result.data;
  next();
};