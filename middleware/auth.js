

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Please log in to access this resource' });
  };
  
  exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Admin rights required.' });
  };