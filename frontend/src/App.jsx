import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import TesterDashboard from "./pages/TesterDashboard";
import DevDashboard from "./pages/DevDashboard";
import './styles/main.css';

function Private({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" />;
  if (role && user.rol !== role) return <Navigate to="/login" />;
  return children;
}

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="nav-card">
      <span className="nav-title">Pruebas Software</span>
      <div className="nav-buttons">
        <Link className="nav-btn" to={user ? "/" : "/login"}>Inicio</Link>
        <Link className="nav-btn" to="/register">Registro</Link>
        <Link className="nav-btn" to="/admin">Panel Admin</Link>
        <Link className="nav-btn" to="/tester">Panel Tester</Link>
        <Link className="nav-btn" to="/dev">Panel Dev</Link>
        <button className="nav-btn" onClick={handleLogout}>Salir</button>
      </div>
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
        <Route
          path="/admin"
          element={
            <Private role="Admin">
              <AdminDashboard />
            </Private>
          }
        />
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
