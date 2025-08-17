import React, { useEffect, useState } from "react";
import { API } from "../services/api";
export default function AdminDashboard() {
  const [tipos, setTipos] = useState([]);
  const [comps, setComps] = useState([]);
  const [casos, setCasos] = useState([]);
  const [planes, setPlanes] = useState([]);
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
  return (
    <div style={{ maxWidth: 1000, margin: "12px auto" }}>
      <div className="card">
        <h3>Bienvenido Admin</h3>
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
            <li key={c.IdPrueba}>{c.Descripcion}</li>
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
