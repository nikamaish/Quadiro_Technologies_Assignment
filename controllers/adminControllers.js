const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Car =  require('../models/Car')

exports.register = async (req, res) => {
    try {
      const { email, password, isAdmin } = req.body;
      // console.log('Request body:', req.body);
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const newUser = new User({ email, password: hashedPassword, isAdmin });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  };



exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user || !user.isAdmin) { return res.status(401).json({ message: 'Authentication failed' }); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({ message: 'Admin logged in successfully' });
    });
  })(req, res, next);
};

exports.getDashboard = async (req, res) => {
  try {
    const cars = await Car.find();
    const totalCars = cars.length;
    res.json({ cars, totalCars });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

exports.createCar = async (req, res) => {
  try {
    const { carName, manufacturingYear, price } = req.body;
    console.log('Received data:', { carName, manufacturingYear, price });

    // Validate the data
    if (!carName || !manufacturingYear || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure manufacturingYear and price are numbers
    const year = Number(manufacturingYear);
    const carPrice = Number(price);
    if (isNaN(year) || isNaN(carPrice)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const newCar = new Car({ carName, manufacturingYear: year, price: carPrice });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(400).json({ message: 'Error creating car' });
  }
};


exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { carName, manufacturingYear, price } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { carName, manufacturingYear, price },
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Error updating car' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car' });
  }
};