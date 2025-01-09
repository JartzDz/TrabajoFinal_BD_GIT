const verifyToken = (role) => {
    return (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header
  
      if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Token no válido' });
        }
  
        // Aquí comprobamos el rol del usuario (
        if (role && decoded.role !== role) {
          return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
        }
  
        req.user = decoded; // Agregar el usuario decodificado al request
        next(); // Continuar con la ejecución de la siguiente función (ruta)
      });
    };
  };
  
  module.exports = verifyToken;