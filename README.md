Proyecto completo: backend + frontend para entorno de pruebas de software.

Rutas principales y funcionalidades agregadas:
- Admin: crear tipos, componentes, casos de prueba, planes y asignar casos a planes.
- Tester: ver planes asignados, ver casos de un plan, registrar resultados.
- Dev: ver resultados registrados por testers.

Pasos de instalación:
1) Crear base de datos (ejemplo 'pruebasdb') y ejecutar 'database.sql' en PostgreSQL.
   psql -U usuario -d pruebasdb -f database.sql
2) Backend:
   cd backend
   cp .env.example .env  # editar DATABASE_URL y JWT_SECRET
   npm install
   npm run dev
3) Frontend:
   cd frontend
   npm install
   npm run dev
4) Acceder frontend en: http://localhost:5173
   - Registro: /register (puedes seleccionar rol)
   - Login: /login
   - Admin: /admin
   - Tester: /tester
   - Dev: /dev

Archivos a adaptar a tu sistema:
- backend/.env.example -> copiar a backend/.env y cambiar DATABASE_URL (usuario/password/host/puerto/dbname) y JWT_SECRET
- frontend: si quieres cambiar URL del API, crea archivo .env en frontend con VITE_API_URL=http://localhost:4000/api
