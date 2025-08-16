import React, {useState} from 'react'
import { API } from '../services/api'
export default function Login(){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const submit=async(e)=>{ e.preventDefault(); try{ const res=await API.post('/auth/login',{username,password}); localStorage.setItem('token',res.data.token); localStorage.setItem('user',JSON.stringify(res.data.user)); alert('Login OK'); window.location.href = res.data.user.rol === 'Admin' ? '/admin' : res.data.user.rol === 'Tester' ? '/tester' : '/dev'; }catch(e){alert('Error login')} }
  return (<div className="card" style={{maxWidth:420,margin:'20px auto'}}><h3>Login</h3><form onSubmit={submit}><input placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/><input placeholder="password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/><button type="submit">Entrar</button></form></div>)
}
