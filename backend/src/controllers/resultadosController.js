import pool from "../config/db.js";

export async function registrarResultado(req, res) {
  try {
    const {
      IdPlandePrueba,
      IdPrueba,
      EstadoPrueba,
      Observaciones,
      FechaEjecucion,
    } = req.body;

    // Verificar que el plan realmente pertenece al tester logueado
    const checkPlan = await pool.query(
      `SELECT * FROM "planDoPrueba" WHERE "IdPlandePrueba"=$1 AND "IdTester"=$2`,
      [IdPlandePrueba, req.user.id]
    );
    if (checkPlan.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para registrar resultados en este plan" });
    }

    const q = await pool.query(
      `INSERT INTO "ResultadoEjecucionPrueba" 
       ("IdPlandePrueba","IdPrueba","EstadoPrueba","Observaciones","FechaEjecucion") 
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        IdPlandePrueba,
        IdPrueba,
        EstadoPrueba,
        Observaciones || null,
        FechaEjecucion,
      ]
    );

    res.status(201).json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error registrando resultado" });
  }
}

export async function listarResultados(req, res) {
  try {
    const q = await pool.query(
      `SELECT 
         r."IdResultado",
         r."EstadoPrueba",
         r."Observaciones",
         r."FechaEjecucion",
         cp."Descripcion" as "CasoDesc",
         p."Descripcion" as "PlanDesc",
         u."Username" as "TesterName"
       FROM "ResultadoEjecucionPrueba" r
       JOIN "casoPrueba" cp ON cp."IdPrueba"=r."IdPrueba"
       JOIN "planDoPrueba" p ON p."IdPlandePrueba"=r."IdPlandePrueba"
       JOIN "Usuario" u ON u."IdUsuario"=p."IdTester"
       ORDER BY r."FechaEjecucion" DESC`
    );

    res.json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error listando resultados" });
  }
}
