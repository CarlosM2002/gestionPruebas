import express from 'express';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.get('/', authenticate, authorize(['Admin']), async (req,res)=>{
  try{ const q=await pool.query('SELECT "IdUsuario","Username","Rol" FROM "Usuario" ORDER BY "IdUsuario"'); res.json(q.rows);}catch(e){console.error(e);res.status(500).json({message:'Error'})}
});
router.put('/:id/rol', authenticate, authorize(['Admin']), async (req,res)=>{
  try{ const {rol}=req.body; const {id}=req.params; const q=await pool.query('UPDATE "Usuario" SET "Rol"=$1 WHERE "IdUsuario"=$2 RETURNING "IdUsuario","Username","Rol",[rol,id]'); res.json(q.rows[0]);}catch(e){console.error(e);res.status(500).json({message:'Error'})}
});
export default router;
