const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/temperatureDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model for Temperature
const temperatureSchema = new mongoose.Schema({
  value: Number,
  date: { type: Date, default: Date.now }
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

// Home page to enter temperature
app.get('/', (req, res) => {
  res.render('index');
});

// Handle temperature submission
app.post('/add-temperature', async (req, res) => {
  const temperatureValue = parseFloat(req.body.temperature);
  if (!isNaN(temperatureValue)) {
    const newTemperature = new Temperature({ value: temperatureValue });
    try {
      await newTemperature.save();
      res.redirect('/graph');
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});

// Graph page to display temperatures
app.get('/graph', async (req, res) => {
    try {
      const temperatures = await Temperature.find({});
      res.render('graph', { temperatures: JSON.stringify(temperatures) });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});