import pool from "../config/db.js";

// Listar todos los casos (con nombre del componente)
export async function listCasos(req, res) {
  try {
    const q = await pool.query(
      'SELECT cp.*, c."Nombre" as "ComponenteNombre" FROM "casoPrueba" cp JOIN "Componente" c ON c."IdComponente" = cp."IdComponente" ORDER BY cp."IdPrueba"'
    );
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error listando casos" });
  }
}

// Obtener un caso por id
export async function getCaso(req, res) {
  const { id } = req.params;
  try {
    const q = await pool.query('SELECT * FROM "casoPrueba" WHERE "IdPrueba" = $1', [id]);
    if (q.rowCount === 0) return res.status(404).json({ message: "No encontrado" });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al obtener caso" });
  }
}

// Crear caso
export async function createCaso(req, res) {
  const { IdComponente, Descripcion, CriteriosPrueba } = req.body;
  try {
    const q = await pool.query(
      'INSERT INTO "casoPrueba" ("IdComponente","Descripcion","CriteriosPrueba") VALUES ($1,$2,$3) RETURNING *',
      [IdComponente, Descripcion, CriteriosPrueba]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al crear caso" });
  }
}

// Actualizar caso
export async function updateCaso(req, res) {
  const { id } = req.params;
  const { IdComponente, Descripcion, CriteriosPrueba } = req.body;
  try {
    const q = await pool.query(
      'UPDATE "casoPrueba" SET "IdComponente"=$1,"Descripcion"=$2,"CriteriosPrueba"=$3 WHERE "IdPrueba"=$4 RETURNING *',
      [IdComponente, Descripcion, CriteriosPrueba, id]
    );
    if (q.rowCount === 0) return res.status(404).json({ message: "No encontrado" });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al actualizar caso" });
  }
}

// Eliminar caso
export async function deleteCaso(req, res) {
  const { id } = req.params;
  try {
    const q = await pool.query('DELETE FROM "casoPrueba" WHERE "IdPrueba" = $1 RETURNING *', [id]);
    if (q.rowCount === 0) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Caso eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al eliminar caso" });
  }
}
