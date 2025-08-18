import express from "express";
import {
  registrarResultado,
  listarResultados,
} from "../controllers/resultadosController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Solo testers pueden registrar resultados
router.post("/", authenticate, authorize(["Tester"]), registrarResultado);

// Devs y Admins pueden ver los resultados
router.get("/", authenticate, authorize(["Dev", "Admin"]), listarResultados);

export default router;
