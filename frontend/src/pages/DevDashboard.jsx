import React, {useEffect, useState} from 'react'
import { API } from '../services/api'
export default function DevDashboard(){
  const [resultados,setResultados]=useState([]);
  useEffect(()=>{ API.get('/resultados').then(r=>setResultados(r.data)).catch(e=>console.error(e)); },[]);
  return (<div style={{maxWidth:900,margin:'12px auto'}}><div className="card"><h3>Panel Dev</h3></div><div className="card"><h4>Resultados</h4><ul>{resultados.map(r=><li key={r.IdResultado}>{r.FechaEjecucion} - {r.CasoDesc} - {r.EstadoPrueba} - {r.Observaciones} - Tester: {r.TesterName}</li>)}</ul></div></div>)
}
