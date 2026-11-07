const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const apiLimiter = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const imageRoutes = require('./routes/imageRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const imageToolsRoutes = require('./routes/imageToolsRoutes');
// ...


const app = express();

// di balik proxy (Render/Railway) supaya rate limit membaca IP asli pengguna
if (env.nodeEnv === 'production') app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.frontendUrls,
    exposedHeaders: ['Content-Disposition'],
  })
);
app.use(express.json({ limit: '10kb' })); // untuk form sertifikat

app.use('/api', apiLimiter, imageRoutes, pdfRoutes, certificateRoutes, imageToolsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', apiLimiter, imageRoutes, pdfRoutes, certificateRoutes);

app.use(notFound);
app.use(errorHandler); // harus paling akhir

module.exports = app;