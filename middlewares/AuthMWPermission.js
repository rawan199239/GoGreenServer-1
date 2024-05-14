module.exports = (req, res, next) => {
    //check session
    if (!req.session.user || !req.session.isAuthenticated) {
      return res.status(401).send("Access Denied");
    }
  
    //check user role (admin or not)
    if (!req.session.user.isAdmin) {
      return res.status(401).send("Access Denied");
    }
  
    next();
  };


