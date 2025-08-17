import React, { useEffect, useState } from "react";
import { API } from "../services/api";
export default function AdminPlanPruebas() {
  const [tipos, setTipos] = useState([]);
  const [comps, setComps] = useState([]);
  const [casos, setCasos] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipoForm, setTipoForm] = useState("");
  const [compForm, setCompForm] = useState({
    Nombre: "",
    Descripcion: "",
    IdTipoComponente: "",
  });
  const [casoForm, setCasoForm] = useState({
    IdComponente: "",
    Descripcion: "",
    CriteriosPrueba: "",
  });
  const [planForm, setPlanForm] = useState({
    IdTester: "",
    Descripcion: "",
    FechaEjecucion: "",
  });
  const [assignForm, setAssignForm] = useState({
    IdPlandePrueba: "",
    IdPrueba: "",
  });
  useEffect(() => {
    fetchAll();
  }, []);
  async function fetchAll() {
    try {
      const [t, c, ca, p, u] = await Promise.all([
        API.get("/componentes/tipos"),
        API.get("/componentes"),
        API.get("/casos"),
        API.get("/planes"),
        API.get("/usuarios"),
      ]);
      setTipos(t.data);
      setComps(c.data);
      setCasos(ca.data);
      setPlanes(p.data);
      setUsuarios(u.data);
    } catch (e) {
      console.error(e);
    }
  }
  async function createTipo(e) {
    e.preventDefault();
    await API.post("/componentes/tipos", { Nombre: tipoForm });
    setTipoForm("");
    fetchAll();
  }
  async function createComponente(e) {
    e.preventDefault();
    await API.post("/componentes", compForm);
    setCompForm({ Nombre: "", Descripcion: "", IdTipoComponente: "" });
    fetchAll();
  }
  async function createCaso(e) {
    e.preventDefault();
    await API.post("/casos", casoForm);
    setCasoForm({ IdComponente: "", Descripcion: "", CriteriosPrueba: "" });
    fetchAll();
  }
  async function createPlan(e) {
    e.preventDefault();
    await API.post("/planes", planForm);
    setPlanForm({ IdTester: "", Descripcion: "", FechaEjecucion: "" });
    fetchAll();
  }
  async function assignCaso(e) {
    e.preventDefault();
    await API.post("/planes/agregar", assignForm);
    setAssignForm({ IdPlandePrueba: "", IdPrueba: "" });
    fetchAll();
  }
  return (
    <div style={{ maxWidth: 1000, margin: "12px auto" }}>
      <div className="card">
        <h3>Bienvenido Admin</h3>
      </div>
      <div className="card">
        <h4>Crear Plan de Prueba</h4>
        <form onSubmit={createPlan}>
          <select
            value={planForm.IdTester}
            onChange={(e) =>
              setPlanForm({ ...planForm, IdTester: e.target.value })
            }
          >
            <option value="">--Tester--</option>
            {usuarios
              .filter((u) => u.Rol === "Tester")
              .map((t) => (
                <option key={t.IdUsuario} value={t.IdUsuario}>
                  {t.Username}
                </option>
              ))}
          </select>
          <input
            type="date"
            value={planForm.FechaEjecucion}
            onChange={(e) =>
              setPlanForm({ ...planForm, FechaEjecucion: e.target.value })
            }
          />
          <textarea
            placeholder="Descripcion"
            value={planForm.Descripcion}
            onChange={(e) =>
              setPlanForm({ ...planForm, Descripcion: e.target.value })
            }
          />
          <button>Crear Plan</button>
        </form>
      </div>
      <div className="card">
        <h4>Asignar Caso a Plan</h4>
        <form onSubmit={assignCaso}>
          <select
            value={assignForm.IdPlandePrueba}
            onChange={(e) =>
              setAssignForm({ ...assignForm, IdPlandePrueba: e.target.value })
            }
          >
            <option value="">--Plan--</option>
            {planes.map((p) => (
              <option key={p.IdPlandePrueba} value={p.IdPlandePrueba}>
                {p.Descripcion} ({p.TesterName})
              </option>
            ))}
          </select>
          <select
            value={assignForm.IdPrueba}
            onChange={(e) =>
              setAssignForm({ ...assignForm, IdPrueba: e.target.value })
            }
          >
            <option value="">--Caso--</option>
            {casos.map((c) => (
              <option key={c.IdPrueba} value={c.IdPrueba}>
                {c.Descripcion}
              </option>
            ))}
          </select>
          <button>Agregar</button>
        </form>
      </div>
    </div>
  );
}
