function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ status: 401, msg: "unauthorized" });
  }
}

export default authMiddleware;
