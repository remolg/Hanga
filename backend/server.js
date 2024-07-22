const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


// MySQL Bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Remolg3426**!!',
  database: 'Hanga'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log("object");
});


// Kullanıcı Kaydı Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Lütfen tüm alanları doldurun' });
  }

  try {
    // Check if email already exists
    const emailQuery = 'SELECT email FROM users WHERE email = ?';
    db.query(emailQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ msg: 'Veritabanı hatası', error: err });
      }
      if (results.length > 0) {
        return res.status(400).json({ msg: 'Bu email zaten kayıtlı' });
      }

      // Email does not exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ msg: 'Veritabanı hatası', error: err });
        }
        res.status(201).json({ msg: 'Kullanıcı kaydedildi' });
      });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası', error: err });
  }
});

// Kullanıcı Girişi Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Lütfen tüm alanları doldurun' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ msg: 'Kullanıcı bulunamadı' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz şifre' });
    }

    const payload = {
      userid: user.userid,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
