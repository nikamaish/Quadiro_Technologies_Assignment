const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.use(ensureAuthenticated, ensureAdmin);
router.get('/dashboard', adminController.getDashboard);
router.post('/cars', ensureAuthenticated, ensureAdmin, adminController.createCar);
router.get('/cars', adminController.getAllCars);
router.get('/cars/:id', adminController.getCar);
router.put('/cars/:id', adminController.updateCar);
router.delete('/cars/:id', adminController.deleteCar);

module.exports = router;
