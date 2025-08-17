import React, { useEffect, useState } from "react";
import { API } from "../services/api";
export default function AdminPruebas() {
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

  const [editCasoId, setEditCasoId] = useState(null);
  const [editCasoForm, setEditCasoForm] = useState({
    IdComponente: "",
    Descripcion: "",
    CriteriosPrueba: "",
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
  // Editar caso
  function startEditCaso(caso) {
    setEditCasoId(caso.IdPrueba);
    setEditCasoForm({
      IdComponente: caso.IdComponente,
      Descripcion: caso.Descripcion,
      CriteriosPrueba: caso.CriteriosPrueba,
    });
  }

  async function updateCaso(e) {
    e.preventDefault();
    await API.put(`/casos/${editCasoId}`, editCasoForm);
    setEditCasoId(null);
    setEditCasoForm({ IdComponente: "", Descripcion: "", CriteriosPrueba: "" });
    fetchAll();
  }

  async function deleteCaso(id) {
    if (window.confirm("¿Eliminar caso?")) {
      await API.delete(`/casos/${id}`);
      fetchAll();
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "12px auto" }}>
      <div className="card">
        <h3>Bienvenido Admin</h3>
      </div>
      <div className="card">
        <h4>Crear Tipo de Componente</h4>
        <form onSubmit={createTipo}>
          <input
            value={tipoForm}
            onChange={(e) => setTipoForm(e.target.value)}
            placeholder="Nombre tipo"
          />
          <button>Crear</button>
        </form>
      </div>
      <div className="card">
        <h4>Crear Componente</h4>
        <form onSubmit={createComponente}>
          <input
            placeholder="Nombre"
            value={compForm.Nombre}
            onChange={(e) =>
              setCompForm({ ...compForm, Nombre: e.target.value })
            }
          />
          <input
            placeholder="Descripcion"
            value={compForm.Descripcion}
            onChange={(e) =>
              setCompForm({ ...compForm, Descripcion: e.target.value })
            }
          />
          <select
            value={compForm.IdTipoComponente}
            onChange={(e) =>
              setCompForm({ ...compForm, IdTipoComponente: e.target.value })
            }
          >
            <option value="">--Tipo--</option>
            {tipos.map((t) => (
              <option key={t.IdTipoComponente} value={t.IdTipoComponente}>
                {t.Nombre}
              </option>
            ))}
          </select>
          <button>Crear</button>
        </form>
      </div>
      <div className="card">
        <h4>Crear Caso de Prueba</h4>
        <form onSubmit={createCaso}>
          <select
            value={casoForm.IdComponente}
            onChange={(e) =>
              setCasoForm({ ...casoForm, IdComponente: e.target.value })
            }
          >
            <option value="">--Componente--</option>
            {comps.map((c) => (
              <option key={c.IdComponente} value={c.IdComponente}>
                {c.Nombre}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Descripcion"
            value={casoForm.Descripcion}
            onChange={(e) =>
              setCasoForm({ ...casoForm, Descripcion: e.target.value })
            }
          />
          <textarea
            placeholder="Criterios"
            value={casoForm.CriteriosPrueba}
            onChange={(e) =>
              setCasoForm({ ...casoForm, CriteriosPrueba: e.target.value })
            }
          />
          <button>Crear Caso</button>
        </form>
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
      <div className="card">
        <h4>Listas</h4>
        <strong>Tipos</strong>
        <ul>
          {tipos.map((t) => (
            <li key={t.IdTipoComponente}>{t.Nombre}</li>
          ))}
        </ul>
        <strong>Componentes</strong>
        <ul>
          {comps.map((c) => (
            <li key={c.IdComponente}>
              {c.Nombre} ({c.TipoNombre})
            </li>
          ))}
        </ul>
        <strong>Casos</strong>
        <ul>
          {casos.map((c) => (
            <li key={c.IdPrueba}>
              {editCasoId === c.IdPrueba ? (
                <form onSubmit={updateCaso} style={{ display: "inline" }}>
                  <select
                    value={editCasoForm.IdComponente}
                    onChange={(e) =>
                      setEditCasoForm({
                        ...editCasoForm,
                        IdComponente: e.target.value,
                      })
                    }
                  >
                    <option value="">--Componente--</option>
                    {comps.map((comp) => (
                      <option key={comp.IdComponente} value={comp.IdComponente}>
                        {comp.Nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    value={editCasoForm.Descripcion}
                    onChange={(e) =>
                      setEditCasoForm({
                        ...editCasoForm,
                        Descripcion: e.target.value,
                      })
                    }
                    placeholder="Descripcion"
                  />
                  <input
                    value={editCasoForm.CriteriosPrueba}
                    onChange={(e) =>
                      setEditCasoForm({
                        ...editCasoForm,
                        CriteriosPrueba: e.target.value,
                      })
                    }
                    placeholder="Criterios"
                  />
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={() => setEditCasoId(null)}>
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    {c.Descripcion} ({c.CriteriosPrueba})
                  </span>
                  <button onClick={() => startEditCaso(c)}>Editar</button>
                  <button onClick={() => deleteCaso(c.IdPrueba)}>
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <strong>Planes</strong>
        <ul>
          {planes.map((p) => (
            <li key={p.IdPlandePrueba}>
              {p.Descripcion} - {p.TesterName} - {p.FechaEjecucion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
