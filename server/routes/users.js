const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kayıt rotası
router.post('/register', async (req, res) => {
  try {
    console.log('Gelen kayıt isteği:', req.body);
    const { firstName, lastName, email, password } = req.body;
    
    // Kullanıcının zaten var olup olmadığını kontrol et
    let user = await User.findOne({ email });
    if (user) {
      console.log('Kullanıcı zaten var:', email);
      return res.status(400).json({ msg: 'Bu e-posta adresi zaten kullanılıyor' });
    }
    
    // Yeni kullanıcı oluştur
    user = new User({
      firstName,
      lastName,
      email,
      password
    });
    
    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log('Yeni kullanıcı kaydedildi:', user.email);
    
    // JWT oluştur ve gönder
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT oluşturma hatası:', err);
          throw err;
        }
        res.json({ token, msg: 'Kayıt başarılı' });
      }
    );
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ msg: 'Sunucu hatası', error: err.message });
  }
});

// Giriş rotası
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcının var olup olmadığını kontrol et
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
    }

    // JWT oluştur ve gönder
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT oluşturma hatası:', err);
          throw err;
        }
        res.json({
          token,
          msg: 'Giriş başarılı',
          redirectUrl: '/dashboard',
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
        });
      }
    );
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(500).json({ msg: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router;