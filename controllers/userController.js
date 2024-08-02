const passport = require('passport');
const bcrypt = require('bcrypt')
const Car = require('../models/Car');
const User = require('../models/User');


exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'User registered and logged in successfully' });
    });
  } catch (err) {
    next(err);
  }
};


exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: 'Authentication failed' }); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({ message: 'User logged in successfully' });
    });
  })(req, res, next);
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};