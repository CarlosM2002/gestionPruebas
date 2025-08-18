// controllers/planesController.js
import pool from "../config/db.js";

// Listar todos los planes (con nombre del tester)
export async function listPlanes(req, res) {
  try {
    const q = await pool.query(
      'SELECT p.*, u."Username" as "TesterName" FROM "planDoPrueba" p JOIN "Usuario" u ON u."IdUsuario" = p."IdTester" ORDER BY p."FechaEjecucion" DESC'
    );
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error listando planes" });
  }
}

// Obtener un plan por id
export async function getPlan(req, res) {
  const { id } = req.params;
  try {
    const q = await pool.query('SELECT * FROM "planDoPrueba" WHERE "IdPlandePrueba" = $1', [id]);
    if (q.rowCount === 0) return res.status(404).json({ message: "Plan no encontrado" });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al obtener plan" });
  }
}

// Crear plan
export async function createPlan(req, res) {
  try {
    const { IdTester, Descripcion, FechaEjecucion } = req.body;
    const q = await pool.query(
      'INSERT INTO "planDoPrueba" ("IdTester","Descripcion","FechaEjecucion") VALUES ($1,$2,$3) RETURNING *',
      [IdTester, Descripcion, FechaEjecucion]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error creando plan" });
  }
}

// Actualizar plan
export async function updatePlan(req, res) {
  const { id } = req.params;
  const { IdTester, Descripcion, FechaEjecucion } = req.body;
  try {
    const q = await pool.query(
      'UPDATE "planDoPrueba" SET "IdTester"=$1, "Descripcion"=$2, "FechaEjecucion"=$3 WHERE "IdPlandePrueba"=$4 RETURNING *',
      [IdTester, Descripcion, FechaEjecucion, id]
    );
    if (q.rowCount === 0) return res.status(404).json({ message: "Plan no encontrado" });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error actualizando plan" });
  }
}

export async function listarPlanesTester(req, res) {
  try {
    const testerId = req.user.id; // viene del token JWT al autenticarse

    const q = await pool.query(
      `SELECT p."IdPlandePrueba",
       p."Descripcion",
       p."FechaEjecucion",
       u."Username" as "TesterName",
       array_agg(cp."Descripcion") as "Casos"
      FROM public."planDoPrueba" p
      JOIN public."Usuario" u ON u."IdUsuario" = p."IdTester"
      LEFT JOIN public."planDoPruebaCasoPrueba" pc ON pc."IdPlandePrueba" = p."IdPlandePrueba"
      LEFT JOIN public."casoPrueba" cp ON cp."IdPrueba" = pc."IdPrueba"
      WHERE p."IdTester" = 8
      GROUP BY p."IdPlandePrueba", p."Descripcion", p."FechaEjecucion", u."Username"`,
      [testerId]
    );

    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error listando planes del tester" });
  }
}

// Eliminar plan (borramos primero relaciones con casos)
export async function deletePlan(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query('DELETE FROM "planDoPruebaCasoPrueba" WHERE "IdPlandePrueba" = $1', [id]);
    const q = await client.query('DELETE FROM "planDoPrueba" WHERE "IdPlandePrueba" = $1 RETURNING *', [id]);
    if (q.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Plan no encontrado" });
    }
    await client.query("COMMIT");
    res.json({ message: "Plan eliminado" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ message: "Error eliminando plan" });
  } finally {
    client.release();
  }
}

// Agregar caso a plan
export async function addCasoToPlan(req, res) {
  try {
    const { IdPlandePrueba, IdPrueba } = req.body;
    // prevenir duplicados (opcional)
    const exists = await pool.query(
      'SELECT 1 FROM "planDoPruebaCasoPrueba" WHERE "IdPlandePrueba"=$1 AND "IdPrueba"=$2',
      [IdPlandePrueba, IdPrueba]
    );
    if (exists.rowCount > 0) return res.status(409).json({ message: "Caso ya está en el plan" });

    const q = await pool.query(
      'INSERT INTO "planDoPruebaCasoPrueba" ("IdPlandePrueba","IdPrueba") VALUES ($1,$2) RETURNING *',
      [IdPlandePrueba, IdPrueba]
    );
    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error agregando caso al plan" });
  }
}

// Remover caso de plan
export async function removeCasoFromPlan(req, res) {
  try {
    const { planId, casoId } = req.params;
    const q = await pool.query(
      'DELETE FROM "planDoPruebaCasoPrueba" WHERE "IdPlandePrueba"=$1 AND "IdPrueba"=$2 RETURNING *',
      [planId, casoId]
    );
    if (q.rowCount === 0) return res.status(404).json({ message: "Relación no encontrada" });
    res.json({ message: "Caso removido del plan" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error removiendo caso del plan" });
  }
}

// Listar planes del tester autenticado
export async function listPlanesForTester(req, res) {
  try {
    // Soportar ambos nombres según tu middleware
    const testerId = req.user?.IdUsuario ?? req.user?.id;
    if (!testerId) {
      return res.status(401).json({ message: "No se pudo identificar al tester" });
    }

    const q = await pool.query(
      `SELECT p."IdPlandePrueba",
              p."Descripcion",
              p."FechaEjecucion",
              u."Username" AS "TesterName"
       FROM "planDoPrueba" p
       JOIN "Usuario" u ON u."IdUsuario" = p."IdTester"
       WHERE p."IdTester" = $1
       ORDER BY p."FechaEjecucion" DESC`,
      [testerId]
    );

    res.json(q.rows);
  } catch (e) {
    console.error("listPlanesForTester error:", e);
    res.status(500).json({ message: "Error" });
  }
}

// Listar casos dentro de un plan
export async function listCasosInPlan(req, res) {
  try {
    const { id } = req.params;
    const q = await pool.query(
      'SELECT c.* FROM "planDoPruebaCasoPrueba" p JOIN "casoPrueba" c ON c."IdPrueba" = p."IdPrueba" WHERE p."IdPlandePrueba" = $1 ORDER BY c."IdPrueba"',
      [id]
    );
    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error listando casos del plan" });
  }

}

