import React, { useEffect, useState } from "react";
import * as api from "../services/api"; // usa las funciones exportadas en services/api.js

export default function AdminPruebas() {
  const [tipos, setTipos] = useState([]);
  const [comps, setComps] = useState([]);
  const [casos, setCasos] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [casoForm, setCasoForm] = useState({
    IdComponente: "",
    Descripcion: "",
    CriteriosPrueba: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [viewCaso, setViewCaso] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      // llamamos a las funciones del servicio; algunos endpoints los obtienes con API.get directamente
      const [tResp, cResp, caResp, pResp, uResp] = await Promise.all([
        api.listTipos(),
        api.listComponentes(),
        api.listCasos(),
        api.API.get("/planes"),
        api.API.get("/usuarios"),
      ]);
      setTipos(tResp.data);
      setComps(cResp.data);
      setCasos(caResp.data);
      setPlanes(pResp.data);
      setUsuarios(uResp.data);
    } catch (e) {
      console.error("fetchAll error:", e);
      alert("Error al cargar datos. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCaso(editingId, casoForm);
        alert("Caso actualizado");
      } else {
        await api.createCaso(casoForm);
        alert("Caso creado");
      }
      setCasoForm({ IdComponente: "", Descripcion: "", CriteriosPrueba: "" });
      setEditingId(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error al guardar caso");
    }
  }

  function startEdit(caso) {
    setEditingId(caso.IdPrueba || caso.id); // compatibilidad de nombres
    setCasoForm({
      IdComponente: caso.IdComponente || caso.Id_componente || "",
      Descripcion: caso.Descripcion || caso.descripcion || "",
      CriteriosPrueba: caso.CriteriosPrueba || caso.CriteriosPrueba || caso.criterios || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este caso? Esta acción no se puede deshacer.")) return;
    try {
      await api.deleteCaso(id);
      alert("Caso eliminado");
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar caso");
    }
  }

  async function handleView(id) {
    try {
      // usamos la función getCaso (GET /casos/:id)
      const resp = await api.getCaso(id);
      setViewCaso(resp.data);
      // si la API retorna objeto con propiedades distintas, viewCaso contendrá lo que venga del backend
    } catch (err) {
      console.error(err);
      alert("Error al obtener caso");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setCasoForm({ IdComponente: "", Descripcion: "", CriteriosPrueba: "" });
  }

  return (
    <div style={{ maxWidth: 1000, margin: "12px auto", padding: 12 }}>
      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <h3>Bienvenido Admin</h3>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 18 }}>
        <h4>{editingId ? "Editar Caso de Prueba" : "Crear Caso de Prueba"}</h4>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label>Componente</label>
            <select
              required
              value={casoForm.IdComponente}
              onChange={(e) => setCasoForm({ ...casoForm, IdComponente: e.target.value })}
            >
              <option value="">--Componente--</option>
              {comps.map((c) => (
                <option key={c.IdComponente ?? c.id} value={c.IdComponente ?? c.id}>
                  {c.Nombre ?? c.nombre ?? c.ComponenteNombre ?? c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Nombre</label>
            <textarea
              required
              placeholder="Nombre"
              value={casoForm.Descripcion}
              onChange={(e) => setCasoForm({ ...casoForm, Descripcion: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Criterios de Prueba</label>
            <textarea
              required
              placeholder="Criterios"
              value={casoForm.CriteriosPrueba}
              onChange={(e) => setCasoForm({ ...casoForm, CriteriosPrueba: e.target.value })}
            />
          </div>

          <div>
            <button type="submit">{editingId ? "Guardar cambios" : "Crear Caso"}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <h4>Lista de Casos de Prueba {loading ? "(cargando...)" : ""}</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Componente</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casos.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                  No hay casos
                </td>
              </tr>
            )}
            {casos.map((c) => {
              const id = c.IdPrueba ?? c.id ?? c.Id;
              const componenteNombre = c.ComponenteNombre ?? c.Nombre ?? c.componenteNombre ?? c.componente;
              return (
                <tr key={id}>
                  <td style={{ padding: 8 }}>{id}</td>
                  <td style={{ padding: 8 }}>{componenteNombre}</td>
                  <td style={{ padding: 8 }}>{(c.Descripcion ?? c.descripcion ?? "").slice(0, 120)}{(c.Descripcion ?? c.descripcion ?? "").length > 120 ? "..." : ""}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleView(id)}>Ver</button>
                    <button onClick={() => startEdit(c)} style={{ marginLeft: 6 }}>Editar</button>
                    <button onClick={() => handleDelete(id)} style={{ marginLeft: 6 }}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal / Panel Ver Caso */}
      {viewCaso && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setViewCaso(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", padding: 20, borderRadius: 6, width: "90%", maxWidth: 700 }}
          >
            <h3>Detalle Caso #{viewCaso.IdPrueba ?? viewCaso.id}</h3>
            <p><strong>Componente:</strong> {viewCaso.ComponenteNombre ?? viewCaso.Nombre ?? viewCaso.componente}</p>
            <p><strong>Nombre:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{viewCaso.Descripcion ?? viewCaso.descripcion}</p>
            <p><strong>Criterios de Prueba:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{viewCaso.CriteriosPrueba ?? viewCaso.criterios}</p>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => { startEdit(viewCaso); setViewCaso(null); }}>Editar</button>
              <button onClick={() => { setViewCaso(null); }} style={{ marginLeft: 8 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
