import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, rol }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
export function authorize(allowed = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (allowed.length && !allowed.includes(req.user.rol)) return res.status(403).json({ message: 'No autorizado' });
    next();
  };
}
