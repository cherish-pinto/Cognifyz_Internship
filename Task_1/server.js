const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit-form', (req, res) => {
  const { name, age, phone, email, message } = req.body;
  
  if (!name || !age || !phone || !email || !message) {
    return res.render('index', { error: 'All fields are required!' });
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    return res.render('index', { error: 'Please enter a valid age between 1 and 120!' });
  }

  const phoneRegex = /^[0-9\-\+\(\)\s]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return res.render('index', { error: 'Please enter a valid phone number!' });
  }

  res.render('result', { name, age, phone, email, message });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
