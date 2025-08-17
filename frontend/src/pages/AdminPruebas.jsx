import React, { useEffect, useState } from "react";
import { API } from "../services/api";
export default function AdminPruebas() {
  const [tipos, setTipos] = useState([]);
  const [comps, setComps] = useState([]);
  const [casoForm, setCasoForm] = useState({
    IdComponente: "",
    Descripcion: "",
    CriteriosPrueba: "",
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

  async function createCaso(e) {
    e.preventDefault();
    await API.post("/casos", casoForm);
    setCasoForm({ IdComponente: "", Descripcion: "", CriteriosPrueba: "" });
    fetchAll();
  }

  return (
    <div style={{ maxWidth: 1000, margin: "12px auto" }}>
      <div className="card">
        <h3>Bienvenido Admin</h3>
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
    </div>
  );
}
