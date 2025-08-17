import pool from '../config/db.js';

// TIPOS DE COMPONENTE
export async function listTipos(req, res) {
  try {
    const q = await pool.query('SELECT * FROM "TipoComponente" ORDER BY "IdTipoComponente"');
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function getTipo(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query('SELECT * FROM "TipoComponente" WHERE "IdTipoComponente" = $1', [id]);
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function createTipo(req, res) {
  try {
    const { Nombre, Descripcion } = req.body;
    const q = await pool.query(
      'INSERT INTO "TipoComponente" ("Nombre", "Descripcion") VALUES ($1, $2) RETURNING *',
      [Nombre, Descripcion || null]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function updateTipo(req, res) {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const q = await pool.query(
      'UPDATE "TipoComponente" SET "Nombre"=$1, "Descripcion"=$2 WHERE "IdTipoComponente"=$3 RETURNING *',
      [Nombre, Descripcion || null, id]
    );
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function deleteTipo(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query('DELETE FROM "TipoComponente" WHERE "IdTipoComponente"=$1 RETURNING *', [id]);
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (e) {
    // Error de referencia (violación de clave foránea)
    if (e.code === '23503') {
      return res.status(400).json({ message: 'No se puede eliminar: existen componentes asociados a este tipo.' });
    }
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

// COMPONENTES
export async function listComponentes(req, res) {
  try {
    const q = await pool.query(
      'SELECT c.*, t."Nombre" as "TipoNombre" FROM "Componente" c JOIN "TipoComponente" t ON t."IdTipoComponente"=c."IdTipoComponente" ORDER BY c."IdComponente"'
    );
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function getComponente(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query(
      'SELECT c.*, t."Nombre" as "TipoNombre" FROM "Componente" c JOIN "TipoComponente" t ON t."IdTipoComponente"=c."IdTipoComponente" WHERE c."IdComponente" = $1',
      [id]
    );
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function createComponente(req, res) {
  try {
    const { Nombre, Descripcion, IdTipoComponente } = req.body;
    const q = await pool.query(
      'INSERT INTO "Componente" ("Nombre", "Descripcion", "IdTipoComponente") VALUES ($1, $2, $3) RETURNING *',
      [Nombre, Descripcion || null, IdTipoComponente]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function updateComponente(req, res) {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, IdTipoComponente } = req.body;
    const q = await pool.query(
      'UPDATE "Componente" SET "Nombre"=$1, "Descripcion"=$2, "IdTipoComponente"=$3 WHERE "IdComponente"=$4 RETURNING *',
      [Nombre, Descripcion || null, IdTipoComponente, id]
    );
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}

export async function deleteComponente(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query('DELETE FROM "Componente" WHERE "IdComponente"=$1 RETURNING *', [id]);
    if (q.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (e) {
    // Error de referencia (violación de clave foránea)
    if (e.code === '23503') {
      return res.status(400).json({ message: 'No se puede eliminar: existen pruebas asociadas a este componente.' });
    }
    console.error(e);
    res.status(500).json({ message: 'Error' });
  }
}