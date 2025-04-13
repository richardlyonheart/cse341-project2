const isAuthenticated = (req, res, next) => {
  console.log('Session:', req.session); // Log the entire session object
  console.log('User:', req.session.user); // Log the user for debugging purposes

  if (req.session.user === undefined) {
      return res.status(401).json({ message: "You do not have access" });
  }
  next(); 
};

module.exports = {
  isAuthenticated
}