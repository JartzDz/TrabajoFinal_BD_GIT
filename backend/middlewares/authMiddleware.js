const jwt = require('jsonwebtoken');

const verifyToken = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    
    if (!token) {
      if (!role) {
        return next();
      }
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token no válido' });
      }

      if (role && decoded.role !== role) {
        return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
      }

      req.user = decoded; 
      next(); 
    });
  };
};

module.exports = verifyToken;
