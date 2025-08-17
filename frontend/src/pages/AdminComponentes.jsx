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
} from "../services/api";

export default function AdminComponentes() {
  const [componentes, setComponentes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [componenteForm, setComponenteForm] = useState({
    Nombre: "",
    Descripcion: "",
    IdTipoComponente: "",
  });
  const [editId, setEditId] = useState(null);
  const [tipoForm, setTipoForm] = useState({ Nombre: "", Descripcion: "" });
  const [editTipoId, setEditTipoId] = useState(null);
  const [tipoError, setTipoError] = useState("");
  const [ComponenteError, setComponenteError] = useState("");

  useEffect(() => {
    listComponentes().then((res) => setComponentes(res.data));
    listTipos().then((res) => setTipos(res.data));
  }, []);

  // CRUD Componente
  const handleCreateComponente = async (e) => {
    e.preventDefault();
    await createComponente(componenteForm);
    const res = await listComponentes();
    setComponentes(res.data);
    setComponenteForm({ Nombre: "", Descripcion: "", IdTipoComponente: "" });
  };

  const handleEditComponente = (comp) => {
    setEditId(comp.IdComponente);
    setComponenteForm({
      Nombre: comp.Nombre,
      Descripcion: comp.Descripcion,
      IdTipoComponente: comp.IdTipoComponente,
    });
  };

  const handleUpdateComponente = async (e) => {
    e.preventDefault();
    await updateComponente(editId, componenteForm);
    const res = await listComponentes();
    setComponentes(res.data);
    setEditId(null);
    setComponenteForm({ Nombre: "", Descripcion: "", IdTipoComponente: "" });
  };

  const handleDeleteComponente = async (id) => {
    setComponenteError("");
    try {
      await deleteComponente(id);
      const res = await listComponentes();
      setComponentes(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setComponenteError(err.response.data.message);
      } else {
        setComponenteError("Error al eliminar tipo.");
      }
    }
  };

  // CRUD Tipo
  const handleCreateTipo = async (e) => {
    e.preventDefault();
    await createTipo(tipoForm);
    const res = await listTipos();
    setTipos(res.data);
    setTipoForm({ Nombre: "", Descripcion: "" });
  };

  const handleEditTipo = (tipo) => {
    setEditTipoId(tipo.IdTipoComponente);
    setTipoForm({ Nombre: tipo.Nombre, Descripcion: tipo.Descripcion });
  };

  const handleUpdateTipo = async (e) => {
    e.preventDefault();
    await updateTipo(editTipoId, tipoForm);
    const res = await listTipos();
    setTipos(res.data);
    setEditTipoId(null);
    setTipoForm({ Nombre: "", Descripcion: "" });
  };

  const handleDeleteTipo = async (id) => {
    setTipoError("");
    try {
      await deleteTipo(id);
      const res = await listTipos();
      setTipos(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setTipoError(err.response.data.message);
      } else {
        setTipoError("Error al eliminar tipo.");
      }
    }
  };

  return (
    <div className="card">
      <h4>Tipos de Componente</h4>
      {tipoError && (
        <div style={{ color: "red", margin: "8px 0", fontWeight: "bold" }}>
          {tipoError}
        </div>
      )}
      <form onSubmit={editTipoId ? handleUpdateTipo : handleCreateTipo}>
        <input
          placeholder="Nombre"
          value={tipoForm.Nombre}
          onChange={(e) =>
            setTipoForm((f) => ({ ...f, Nombre: e.target.value }))
          }
          required
        />
        <input
          placeholder="Descripción"
          value={tipoForm.Descripcion}
          onChange={(e) =>
            setTipoForm((f) => ({ ...f, Descripcion: e.target.value }))
          }
        />
        <button type="submit">
          {editTipoId ? "Actualizar" : "Crear Tipo"}
        </button>
        {editTipoId && (
          <button
            type="button"
            onClick={() => {
              setEditTipoId(null);
              setTipoForm({ Nombre: "", Descripcion: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {tipos.map((t) => (
          <li key={t.IdTipoComponente}>
            {t.Nombre} - {t.Descripcion}
            <button onClick={() => handleEditTipo(t)}>Editar</button>
            <button onClick={() => handleDeleteTipo(t.IdTipoComponente)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h3>Componentes</h3>
      {ComponenteError && <div style={{ color: 'red', margin: '8px 0' }}>{ComponenteError}</div>}
      <form onSubmit={editId ? handleUpdateComponente : handleCreateComponente}>
        <input
          placeholder="Nombre"
          value={componenteForm.Nombre}
          onChange={(e) =>
            setComponenteForm((f) => ({ ...f, Nombre: e.target.value }))
          }
          required
        />
        <input
          placeholder="Descripción"
          value={componenteForm.Descripcion}
          onChange={(e) =>
            setComponenteForm((f) => ({ ...f, Descripcion: e.target.value }))
          }
          required
        />
        <select
          value={componenteForm.IdTipoComponente}
          onChange={(e) =>
            setComponenteForm((f) => ({
              ...f,
              IdTipoComponente: e.target.value,
            }))
          }
          required
        >
          <option value="">Tipo de componente</option>
          {tipos.map((t) => (
            <option key={t.IdTipoComponente} value={t.IdTipoComponente}>
              {t.Nombre}
            </option>
          ))}
        </select>
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setComponenteForm({
                Nombre: "",
                Descripcion: "",
                IdTipoComponente: "",
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {componentes.map((c) => (
          <li key={c.IdComponente}>
            {c.Nombre} - {c.Descripcion} ({c.TipoNombre})
            <button onClick={() => handleEditComponente(c)}>Editar</button>
            <button onClick={() => handleDeleteComponente(c.IdComponente)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
