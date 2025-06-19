function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  next();
}

module.exports = adminMiddleware;
