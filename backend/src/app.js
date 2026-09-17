require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const initDB = require('./db/init');

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});

module.exports = app;
