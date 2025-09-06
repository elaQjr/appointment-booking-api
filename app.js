const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');

// Internal files of the project
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Application
const app = express();

// Security
app.use(helmet());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "تعداد درخواست بیش از حد مجاز است! لطفاً بعداً تلاش کنید."
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "تلاش‌های بیش از حد برای ورود. لطفاً چند دقیقه صبر کنید."
});

// JSON Parser
app.use(express.json());

// CROS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ENV + DB
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}
connectDB();

// Cookie Parser
app.use(cookieParser());

// Logse
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static files
app.use('/uploads', express.static('uploads'))

// API ROUTES
app.use('/api/auth', authRoutes, authLimiter);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/services', serviceRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to Appointment API');
});

// Error Handller
app.use(errorHandler);

module.exports = app;
