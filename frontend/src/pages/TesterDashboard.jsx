import React, {useEffect, useState} from 'react'
import { API } from '../services/api'
export default function TesterDashboard(){
  const [planes,setPlanes]=useState([]); const [casos,setCasos]=useState([]); const [selectedPlan,setSelectedPlan]=useState(''); const [resultForm,setResultForm]=useState({IdPlandePrueba:'',IdPrueba:'',EstadoPrueba:'Pendiente',Observaciones:'',FechaEjecucion:''});
  useEffect(()=>{ fetchPlanes(); },[]);
  async function fetchPlanes(){ try{ const res=await API.get('/planes/mios'); setPlanes(res.data); }catch(e){console.error(e)} }
  async function loadCasos(planId){ setSelectedPlan(planId); try{ const res=await API.get(`/planes/${planId}/casos`); setCasos(res.data);}catch(e){console.error(e)} }
  async function submitResult(e){ e.preventDefault(); try{ await API.post('/resultados', resultForm); alert('Resultado registrado'); setResultForm({IdPlandePrueba:'',IdPrueba:'',EstadoPrueba:'Pendiente',Observaciones:'',FechaEjecucion:''}); }catch(e){alert('Error') } }
  return (<div style={{maxWidth:900,margin:'12px auto'}}>
    <div className="card"><h3>Panel Tester</h3></div>
    <div className="card"><h4>Tus Planes</h4><ul>{planes.map(p=><li key={p.IdPlandePrueba}><button onClick={()=>loadCasos(p.IdPlandePrueba)}>Ver casos</button> {p.Descripcion} - {p.FechaEjecucion}</li>)}</ul></div>
    <div className="card"><h4>Casos del Plan {selectedPlan}</h4><ul>{casos.map(c=><li key={c.IdPrueba}>{c.Descripcion}</li>)}</ul></div>
    <div className="card"><h4>Registrar Resultado</h4><form onSubmit={submitResult}><select value={resultForm.IdPlandePrueba} onChange={(e)=>setResultForm({...resultForm,IdPlandePrueba:e.target.value})}><option value=''>--Plan--</option>{planes.map(p=> <option key={p.IdPlandePrueba} value={p.IdPlandePrueba}>{p.Descripcion}</option>)}</select><select value={resultForm.IdPrueba} onChange={(e)=>setResultForm({...resultForm,IdPrueba:e.target.value})}><option value=''>--Caso--</option>{casos.map(c=> <option key={c.IdPrueba} value={c.IdPrueba}>{c.Descripcion}</option>)}</select><select value={resultForm.EstadoPrueba} onChange={(e)=>setResultForm({...resultForm,EstadoPrueba:e.target.value})}><option>Pendiente</option><option>Exitoso</option><option>Fallido</option><option>Bloqueado</option></select><textarea placeholder='Observaciones' value={resultForm.Observaciones} onChange={(e)=>setResultForm({...resultForm,Observaciones:e.target.value})}/><input type='date' value={resultForm.FechaEjecucion} onChange={(e)=>setResultForm({...resultForm,FechaEjecucion:e.target.value})}/><button>Registrar</button></form></div>
  </div>)
}
