const express = require('express');
const app = express();


const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
const cors = require('cors');


app.use(cors());

// Import routes
const usersRouter = require('./routes/auth');

// Routes
app.use('/auth', usersRouter);

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  console.log('Connected to MongoDB');

}).catch((error) => console.log(error.message));