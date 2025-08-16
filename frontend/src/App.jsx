import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import TesterDashboard from './pages/TesterDashboard'
import DevDashboard from './pages/DevDashboard'
function Private({children, role}){
  const user = JSON.parse(localStorage.getItem('user')||'null');
  if(!user) return <Navigate to='/login'/>;
  if(role && user.rol !== role) return <Navigate to='/login'/>;
  return children;
}
export default function App(){
  return (<div>
    <nav className="card"><Link to="/login">Login</Link><Link to="/register">Register</Link><Link to="/admin">Admin</Link><Link to="/tester">Tester</Link><Link to="/dev">Dev</Link></nav>
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/admin" element={<Private role="Admin"><AdminDashboard/></Private>} />
      <Route path="/tester" element={<Private role="Tester"><TesterDashboard/></Private>} />
      <Route path="/dev" element={<Private role="Dev"><DevDashboard/></Private>} />
    </Routes>
  </div>)
}
