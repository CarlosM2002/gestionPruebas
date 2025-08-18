import React, { useEffect, useState } from "react";
import * as api from "../services/api";

export default function AdminPlanPruebas() {
  const [planes, setPlanes] = useState([]);
  const [casos, setCasos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ IdTester: "", Descripcion: "", FechaEjecucion: "" });
  const [editingId, setEditingId] = useState(null);
  const [viewPlan, setViewPlan] = useState(null);
  const [planCasos, setPlanCasos] = useState([]);
  const [selectedCasoToAdd, setSelectedCasoToAdd] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [pResp, cResp, uResp] = await Promise.all([
        api.listPlanes(),
        api.listCasos(),
        api.API.get("/usuarios"),
      ]);
      setPlanes(pResp.data);
      setCasos(cResp.data);
      setUsuarios(uResp.data);
    } catch (e) {
      console.error(e);
      alert("Error cargando datos");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updatePlan(editingId, form);
        alert("Plan actualizado");
      } else {
        await api.createPlan(form);
        alert("Plan creado");
      }
      setForm({ IdTester: "", Descripcion: "", FechaEjecucion: "" });
      setEditingId(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error guardando plan");
    }
  }

  function startEdit(plan) {
    setEditingId(plan.IdPlandePrueba ?? plan.id);
    setForm({
      IdTester: plan.IdTester ?? "",
      Descripcion: plan.Descripcion ?? "",
      FechaEjecucion: plan.FechaEjecucion ? plan.FechaEjecucion.split("T")[0] : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(planId) {
    if (!window.confirm("¿Eliminar este plan?")) return;
    try {
      await api.deletePlan(planId);
      alert("Plan eliminado");
      await fetchAll();
    } catch (e) {
      console.error(e);
      alert("Error eliminando plan");
    }
  }

  async function handleView(plan) {
    setViewPlan(plan);
    try {
      const resp = await api.listCasosInPlan(plan.IdPlandePrueba ?? plan.id);
      setPlanCasos(resp.data);
    } catch (e) {
      console.error(e);
      alert("Error cargando casos del plan");
    }
  }

  async function handleAddCaso(e) {
    e.preventDefault();
    const planId = viewPlan?.IdPlandePrueba ?? viewPlan?.id;
    if (!planId || !selectedCasoToAdd) {
      alert("Selecciona un caso y un plan");
      return;
    }
    try {
      await api.addCasoToPlan({ IdPlandePrueba: planId, IdPrueba: selectedCasoToAdd });
      alert("Caso agregado al plan");
      const resp = await api.listCasosInPlan(planId);
      setPlanCasos(resp.data);
      setSelectedCasoToAdd("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message ?? "Error agregando caso");
    }
  }

  async function handleRemoveCaso(casoId) {
    if (!viewPlan) return;
    const planId = viewPlan?.IdPlandePrueba ?? viewPlan?.id;
    if (!window.confirm("Remover este caso del plan?")) return;
    try {
      await api.removeCasoFromPlan(planId, casoId);
      const resp = await api.listCasosInPlan(planId);
      setPlanCasos(resp.data);
      alert("Caso removido");
    } catch (err) {
      console.error(err);
      alert("Error removiendo caso");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ IdTester: "", Descripcion: "", FechaEjecucion: "" });
  }

  return (
    <div style={{ maxWidth: 1100, margin: "12px auto", padding: 12 }}>
      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <h3>Administrar Planes de Prueba</h3>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 18 }}>
        <h4>{editingId ? "Editar Plan" : "Crear Plan"}</h4>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label>Tester asignado</label>
            <select
              required
              value={form.IdTester}
              onChange={(e) => setForm({ ...form, IdTester: e.target.value })}
            >
              <option value="">--Selecciona tester--</option>
              {usuarios.map((u) => (
                <option key={u.IdUsuario ?? u.id} value={u.IdUsuario ?? u.id}>
                  {u.Username ?? u.username ?? u.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Descripción</label>
            <textarea
              required
              value={form.Descripcion}
              onChange={(e) => setForm({ ...form, Descripcion: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Fecha de ejecución</label>
            <input
              required
              type="date"
              value={form.FechaEjecucion}
              onChange={(e) => setForm({ ...form, FechaEjecucion: e.target.value })}
            />
          </div>

          <div>
            <button type="submit">{editingId ? "Guardar" : "Crear Plan"}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h4>Lista de Planes</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tester</th>
              <th>Descripcion</th>
              <th>Fecha Ejecucion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 12 }}>No hay planes</td></tr>
            )}
            {planes.map((p) => {
              const id = p.IdPlandePrueba ?? p.id;
              return (
                <tr key={id}>
                  <td style={{ padding: 8 }}>{id}</td>
                  <td style={{ padding: 8 }}>{p.TesterName ?? p.Username ?? p.IdTester}</td>
                  <td style={{ padding: 8 }}>{(p.Descripcion ?? "").slice(0, 100)}</td>
                  <td style={{ padding: 8 }}>{(p.FechaEjecucion ?? "").split("T")[0]}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleView(p)}>Ver</button>
                    <button onClick={() => startEdit(p)} style={{ marginLeft: 6 }}>Editar</button>
                    <button onClick={() => handleDelete(id)} style={{ marginLeft: 6 }}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Panel ver plan y gestionar casos */}
      {viewPlan && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ccc", borderRadius: 6 }}>
          <h4>Detalle Plan #{viewPlan.IdPlandePrueba ?? viewPlan.id}</h4>
          <p><strong>Tester:</strong> {viewPlan.TesterName ?? viewPlan.Username}</p>
          <p><strong>Descripción:</strong> {viewPlan.Descripcion}</p>
          <p><strong>Fecha Ejecución:</strong> {(viewPlan.FechaEjecucion ?? "").split("T")[0]}</p>

          <hr />

          <h5>Casos en este plan</h5>
          {planCasos.length === 0 && <p>No hay casos asignados.</p>}
          <ul>
            {planCasos.map((c) => (
              <li key={c.IdPrueba ?? c.id} style={{ marginBottom: 6 }}>
                <strong>{c.IdPrueba ?? c.id}</strong> - {c.Descripcion ?? c.descripcion}
                <button onClick={() => handleRemoveCaso(c.IdPrueba ?? c.id)} style={{ marginLeft: 8 }}>Quitar</button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddCaso} style={{ marginTop: 12 }}>
            <label>Agregar caso al plan</label><br />
            <select value={selectedCasoToAdd} onChange={(e) => setSelectedCasoToAdd(e.target.value)}>
              <option value="">--Selecciona caso--</option>
              {casos.map((c) => (
                <option key={c.IdPrueba ?? c.id} value={c.IdPrueba ?? c.id}>
                  {c.IdPrueba ?? c.id} - {(c.Descripcion ?? "").slice(0, 60)}
                </option>
              ))}
            </select>
            <button type="submit" style={{ marginLeft: 8 }}>Agregar</button>
            <button type="button" onClick={() => { setViewPlan(null); setPlanCasos([]); }} style={{ marginLeft: 8 }}>Cerrar</button>
          </form>
        </div>
      )}
    </div>
  );
}
