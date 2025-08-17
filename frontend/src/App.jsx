import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminComponentes from "./pages/AdminComponentes";
import AdminPruebas from './pages/AdminPruebas';
import AdminPlanPruebas from './pages/AdminPlanPruebas';
import AdminDashboard from "./pages/AdminDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import DevDashboard from "./pages/DevDashboard";
import "./styles/main.css";

function Private({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" />;
  if (role && user.rol !== role) return <Navigate to="/login" />;
  return children;
}

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    // Navbar para usuarios sin sesión
    return (
      <div className="nav-card">
        <span className="nav-title">Pruebas Software</span>
        <div className="nav-buttons">
          <Link className="nav-btn" to="/login">Login</Link>
          <Link className="nav-btn" to="/register">Registro</Link>
        </div>
      </div>
    );
  }

  if (user.rol === "Admin") {
    return (
      <div className="nav-card">
        <span className="nav-title">Panel Admin</span>
        <div className="nav-buttons">
          <Link className="nav-btn" to="/admin">Home</Link>
          <Link className="nav-btn" to="/admin-componentes">Componentes</Link>
          <Link className="nav-btn" to="/admin-Pruebas">Pruebas</Link>
          <Link className="nav-btn" to="/admin-Planes">Planes de Pruebas</Link>
          <button className="nav-btn" onClick={handleLogout}>Salir</button>
        </div>
      </div>
    );
  }

  if (user.rol === "Tester") {
    return (
      <div className="nav-card">
        <span className="nav-title">Panel Tester</span>
        <div className="nav-buttons">
          <Link className="nav-btn" to="/tester">Dashboard</Link>
          <button className="nav-btn" onClick={handleLogout}>Salir</button>
        </div>
      </div>
    );
  }

  if (user.rol === "Dev") {
    return (
      <div className="nav-card">
        <span className="nav-title">Panel Dev</span>
        <div className="nav-buttons">
          <Link className="nav-btn" to="/dev">Dashboard</Link>
          <button className="nav-btn" onClick={handleLogout}>Salir</button>
        </div>
      </div>
    );
  }

  // Navbar por defecto si el rol no coincide
  return (
    <div className="nav-card">
      <span className="nav-title">Pruebas Software</span>
      <button className="nav-btn" onClick={handleLogout}>Salir</button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />        
        <Route
          path="/admin-Componentes"
          element={
            <Private role="Admin">
              <AdminComponentes />
            </Private>
          }
        />
        <Route path="/admin-pruebas" element={<AdminPruebas />} />
        <Route path="/admin-planes" element={<AdminPlanPruebas />} />
        <Route
          path="/tester"
          element={
            <Private role="Tester">
              <TesterDashboard />
            </Private>
          }
        />
        <Route
          path="/dev"
          element={
            <Private role="Dev">
              <DevDashboard />
            </Private>
          }
        />
      </Routes>
    </div>
  );
}
