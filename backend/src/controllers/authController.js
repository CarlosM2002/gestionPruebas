import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function register(req, res) {
  try {
    const { username, password, rol } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username y password requeridos' });
    const exists = await pool.query('SELECT 1 FROM "Usuario" WHERE "Username"=$1', [username]);
    if (exists.rowCount) return res.status(409).json({ message: 'Usuario ya existe' });
    const hashed = await bcrypt.hash(password, 10);
    const q = await pool.query('INSERT INTO "Usuario" ("Username","Contrasena","Rol") VALUES ($1,$2,$3) RETURNING "IdUsuario","Username","Rol"', [username, hashed, rol || 'Tester']);
    const user = q.rows[0];
    return res.status(201).json({ user });
  } catch (e) {
    console.error(e); res.status(500).json({ message: 'Error en registro' });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username y password requeridos' });
    const q = await pool.query('SELECT * FROM "Usuario" WHERE "Username"=$1', [username]);
    if (q.rowCount === 0) return res.status(401).json({ message: 'Credenciales inválidas' });
    const user = q.rows[0];
    const valid = await bcrypt.compare(password, user.Contrasena || user.contrasena);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
    const payload = { id: user.IdUsuario || user.idusuario, username: user.Username || user.username, rol: user.Rol || user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: payload.id, username: payload.username, rol: payload.rol } });
  } catch (e) {
    console.error(e); res.status(500).json({ message: 'Error en login' });
  }
}
