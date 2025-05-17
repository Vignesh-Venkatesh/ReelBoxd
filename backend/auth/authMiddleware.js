const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // if user is logged in, we allow request
  }
  return res.status(401).json({ error: "Unauthorized. Please log in." });
};

export default requireAuth;
