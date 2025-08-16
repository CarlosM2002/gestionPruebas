import React, {useState} from 'react'
import { API } from '../services/api'
export default function Register(){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [rol,setRol]=useState('Tester');
  const submit=async(e)=>{ e.preventDefault(); try{ await API.post('/auth/register',{username,password,rol}); alert('Registrado'); window.location.href='/login'; }catch(e){alert('Error registro')} }
  return (<div className="card" style={{maxWidth:480,margin:'20px auto'}}><h3>Registro</h3><form onSubmit={submit}><input placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/><input placeholder="password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/><select value={rol} onChange={(e)=>setRol(e.target.value)}><option>Admin</option><option>Dev</option><option>Tester</option></select><button>Registrar</button></form></div>)
}
