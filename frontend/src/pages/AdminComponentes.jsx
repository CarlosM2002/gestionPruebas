import React, { useEffect, useState } from "react";
import {
  listComponentes,
  createComponente,
  updateComponente,
  deleteComponente,
  listTipos,
  createTipo,
  updateTipo,
  deleteTipo,
  getComponente,
} from "../services/api";

export default function AdminComponentes() {
  const [componentes, setComponentes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [componenteForm, setComponenteForm] = useState({
    Nombre: "",
    Descripcion: "",
    IdTipoComponente: "",
  });
  const [tipoForm, setTipoForm] = useState({ 
    Nombre: "", 
    Descripcion: "" 
  });
  
  const [editingId, setEditingId] = useState(null);
  const [editingTipoId, setEditingTipoId] = useState(null);
  const [viewComponente, setViewComponente] = useState(null);
  const [viewTipo, setViewTipo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    componente: "",
    tipo: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [cResp, tResp] = await Promise.all([
        listComponentes(),
        listTipos()
      ]);
      setComponentes(cResp.data);
      setTipos(tResp.data);
    } catch (e) {
      console.error("fetchAll error:", e);
      alert("Error al cargar datos. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }

  // Componente CRUD
  async function handleSubmitComponente(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateComponente(editingId, componenteForm);
        alert("Componente actualizado");
      } else {
        await createComponente(componenteForm);
        alert("Componente creado");
      }
      setComponenteForm({ Nombre: "", Descripcion: "", IdTipoComponente: "" });
      setEditingId(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrors({...errors, componente: err.response.data.message});
      } else {
        alert("Error al guardar componente");
      }
    }
  }

  function startEditComponente(comp) {
    setEditingId(comp.IdComponente);
    setComponenteForm({
      Nombre: comp.Nombre,
      Descripcion: comp.Descripcion,
      IdTipoComponente: comp.IdTipoComponente,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteComponente(id) {
    if (!window.confirm("¿Eliminar este componente? Esta acción no se puede deshacer.")) return;
    try {
      await deleteComponente(id);
      alert("Componente eliminado");
      await fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrors({...errors, componente: err.response.data.message});
      } else {
        alert("Error al eliminar componente");
      }
    }
  }

  async function handleViewComponente(id) {
    try {
      const resp = await getComponente(id);
      setViewComponente(resp.data);
    } catch (err) {
      console.error(err);
      alert("Error al obtener componente");
    }
  }

  function cancelEditComponente() {
    setEditingId(null);
    setComponenteForm({ Nombre: "", Descripcion: "", IdTipoComponente: "" });
  }

  // Tipo CRUD
  async function handleSubmitTipo(e) {
    e.preventDefault();
    try {
      if (editingTipoId) {
        await updateTipo(editingTipoId, tipoForm);
        alert("Tipo actualizado");
      } else {
        await createTipo(tipoForm);
        alert("Tipo creado");
      }
      setTipoForm({ Nombre: "", Descripcion: "" });
      setEditingTipoId(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrors({...errors, tipo: err.response.data.message});
      } else {
        alert("Error al guardar tipo");
      }
    }
  }

  function startEditTipo(tipo) {
    setEditingTipoId(tipo.IdTipoComponente);
    setTipoForm({
      Nombre: tipo.Nombre,
      Descripcion: tipo.Descripcion,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteTipo(id) {
    if (!window.confirm("¿Eliminar este tipo? Esta acción no se puede deshacer.")) return;
    try {
      await deleteTipo(id);
      alert("Tipo eliminado");
      await fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setErrors({...errors, tipo: err.response.data.message});
      } else {
        alert("Error al eliminar tipo");
      }
    }
  }

  function cancelEditTipo() {
    setEditingTipoId(null);
    setTipoForm({ Nombre: "", Descripcion: "" });
  }

  return (
    <div style={{ maxWidth: 1000, margin: "12px auto", padding: 12 }}>
      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <h3>Bienvenido Admin</h3>
      </div>

      {/* Formulario Tipos */}
      <div className="card" style={{ padding: 12, marginBottom: 18 }}>
        <h4>{editingTipoId ? "Editar Tipo de Componente" : "Crear Tipo de Componente"}</h4>
        {errors.tipo && (
          <div style={{ color: "red", marginBottom: 8 }}>{errors.tipo}</div>
        )}
        <form onSubmit={handleSubmitTipo}>
          <div style={{ marginBottom: 8 }}>
            <label>Nombre</label>
            <input
              required
              placeholder="Nombre"
              value={tipoForm.Nombre}
              onChange={(e) => setTipoForm({ ...tipoForm, Nombre: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Descripción</label>
            <textarea
              placeholder="Descripción"
              value={tipoForm.Descripcion}
              onChange={(e) => setTipoForm({ ...tipoForm, Descripcion: e.target.value })}
            />
          </div>

          <div>
            <button type="submit">{editingTipoId ? "Guardar cambios" : "Crear Tipo"}</button>
            {editingTipoId && <button type="button" onClick={cancelEditTipo} style={{ marginLeft: 8 }}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Lista Tipos */}
      <div className="card" style={{ padding: 12, marginBottom: 18 }}>
        <h4>Lista de Tipos de Componente {loading ? "(cargando...)" : ""}</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 12 }}>
                  No hay tipos
                </td>
              </tr>
            )}
            {tipos.map((t) => (
              <tr key={t.IdTipoComponente}>
                <td style={{ padding: 8 }}>{t.IdTipoComponente}</td>
                <td style={{ padding: 8 }}>{t.Nombre}</td>
                <td style={{ padding: 8 }}>{(t.Descripcion || "").slice(0, 120)}{(t.Descripcion || "").length > 120 ? "..." : ""}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => setViewTipo(t)}>Ver</button>
                  <button onClick={() => startEditTipo(t)} style={{ marginLeft: 6 }}>Editar</button>
                  <button onClick={() => handleDeleteTipo(t.IdTipoComponente)} style={{ marginLeft: 6 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario Componentes */}
      <div className="card" style={{ padding: 12, marginBottom: 18 }}>
        <h4>{editingId ? "Editar Componente" : "Crear Componente"}</h4>
        {errors.componente && (
          <div style={{ color: "red", marginBottom: 8 }}>{errors.componente}</div>
        )}
        <form onSubmit={handleSubmitComponente}>
          <div style={{ marginBottom: 8 }}>
            <label>Nombre</label>
            <input
              required
              placeholder="Nombre"
              value={componenteForm.Nombre}
              onChange={(e) => setComponenteForm({ ...componenteForm, Nombre: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Descripción</label>
            <textarea
              required
              placeholder="Descripción"
              value={componenteForm.Descripcion}
              onChange={(e) => setComponenteForm({ ...componenteForm, Descripcion: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Tipo de Componente</label>
            <select
              required
              value={componenteForm.IdTipoComponente}
              onChange={(e) => setComponenteForm({ ...componenteForm, IdTipoComponente: e.target.value })}
            >
              <option value="">--Seleccione--</option>
              {tipos.map((t) => (
                <option key={t.IdTipoComponente} value={t.IdTipoComponente}>
                  {t.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit">{editingId ? "Guardar cambios" : "Crear Componente"}</button>
            {editingId && <button type="button" onClick={cancelEditComponente} style={{ marginLeft: 8 }}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Lista Componentes */}
      <div className="card" style={{ padding: 12 }}>
        <h4>Lista de Componentes {loading ? "(cargando...)" : ""}</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {componentes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                  No hay componentes
                </td>
              </tr>
            )}
            {componentes.map((c) => (
              <tr key={c.IdComponente}>
                <td style={{ padding: 8 }}>{c.IdComponente}</td>
                <td style={{ padding: 8 }}>{c.Nombre}</td>
                <td style={{ padding: 8 }}>{(c.Descripcion || "").slice(0, 120)}{(c.Descripcion || "").length > 120 ? "..." : ""}</td>
                <td style={{ padding: 8 }}>{c.TipoNombre}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleViewComponente(c.IdComponente)}>Ver</button>
                  <button onClick={() => startEditComponente(c)} style={{ marginLeft: 6 }}>Editar</button>
                  <button onClick={() => handleDeleteComponente(c.IdComponente)} style={{ marginLeft: 6 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ver Componente */}
      {viewComponente && (
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
          onClick={() => setViewComponente(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", padding: 20, borderRadius: 6, width: "90%", maxWidth: 700 }}
          >
            <h3>Detalle Componente #{viewComponente.IdComponente}</h3>
            <p><strong>Nombre:</strong> {viewComponente.Nombre}</p>
            <p><strong>Tipo:</strong> {viewComponente.TipoNombre}</p>
            <p><strong>Descripción:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{viewComponente.Descripcion}</p>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => { startEditComponente(viewComponente); setViewComponente(null); }}>Editar</button>
              <button onClick={() => { setViewComponente(null); }} style={{ marginLeft: 8 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Tipo */}
      {viewTipo && (
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
          onClick={() => setViewTipo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", padding: 20, borderRadius: 6, width: "90%", maxWidth: 700 }}
          >
            <h3>Detalle Tipo #{viewTipo.IdTipoComponente}</h3>
            <p><strong>Nombre:</strong> {viewTipo.Nombre}</p>
            <p><strong>Descripción:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{viewTipo.Descripcion}</p>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => { startEditTipo(viewTipo); setViewTipo(null); }}>Editar</button>
              <button onClick={() => { setViewTipo(null); }} style={{ marginLeft: 8 }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}