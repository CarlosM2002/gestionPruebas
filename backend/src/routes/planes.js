import express from "express";
import {
  createPlan,
  addCasoToPlan,
  listPlanes,
  listPlanesForTester,
  listCasosInPlan,
  getPlan,
  updatePlan,
  deletePlan,
  removeCasoFromPlan,
} from "../controllers/planesController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// 1) Rutas estáticas SIEMPRE antes que las paramétricas

// Admin: listar/crear planes
router.get("/", authenticate, authorize(["Admin"]), listPlanes);
router.post("/", authenticate, authorize(["Admin"]), createPlan);

// Tester: ver solo sus planes
router.get("/mios", authenticate, authorize(["Tester"]), listPlanesForTester);

// Casos de un plan (útil para tester y admin)
router.get("/:id/casos", authenticate, listCasosInPlan);

// Admin: agregar y quitar casos de un plan
router.post("/agregar", authenticate, authorize(["Admin"]), addCasoToPlan);
router.delete("/:planId/casos/:casoId", authenticate, authorize(["Admin"]), removeCasoFromPlan);

// 2) Rutas paramétricas GENERALES al final
router.get("/:id", authenticate, authorize(["Admin"]), getPlan);
router.put("/:id", authenticate, authorize(["Admin"]), updatePlan);
router.delete("/:id", authenticate, authorize(["Admin"]), deletePlan);

export default router;
