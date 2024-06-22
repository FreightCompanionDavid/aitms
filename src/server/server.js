const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');
const formRoutes = require('./routes/formRoutes');

const app = express();

mongoose.connect('mongodb://localhost/freightforms', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(authMiddleware);
app.use('/api/forms', formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));