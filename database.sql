-- Schema original + Rol column and seeder users
CREATE TYPE rol_usuario AS ENUM ('Admin', 'Dev', 'Tester');
CREATE TYPE estado_recepcion AS ENUM ('Enviado', 'Recibido', 'Corregido');
CREATE TYPE estado_prueba AS ENUM ('Pendiente', 'Exitoso', 'Fallido', 'Bloqueado');

CREATE TABLE IF NOT EXISTS "TipoComponente" (
  "IdTipoComponente" SERIAL PRIMARY KEY,
  "Nombre" VARCHAR(100) NOT NULL,
  "Descripcion" TEXT
);

CREATE TABLE IF NOT EXISTS "Componente" (
  "IdComponente" SERIAL PRIMARY KEY,
  "Nombre" VARCHAR(100) NOT NULL,
  "Descripcion" TEXT,
  "IdTipoComponente" INTEGER NOT NULL REFERENCES "TipoComponente"("IdTipoComponente")
);

CREATE TABLE IF NOT EXISTS "Usuario" (
  "IdUsuario" SERIAL PRIMARY KEY,
  "Username" VARCHAR(50) UNIQUE NOT NULL,
  "Contrasena" VARCHAR(255) NOT NULL,
  "Rol" rol_usuario NOT NULL DEFAULT 'Tester'
);

CREATE TABLE IF NOT EXISTS "casoPrueba" (
  "IdPrueba" SERIAL PRIMARY KEY,
  "IdComponente" INTEGER NOT NULL REFERENCES "Componente"("IdComponente"),
  "Descripcion" TEXT NOT NULL,
  "CriteriosPrueba" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "casoPruebaUsuario" (
  "IdPrueba" INTEGER REFERENCES "casoPrueba"("IdPrueba"),
  "IdUsuario" INTEGER REFERENCES "Usuario"("IdUsuario"),
  "RolenCaso" rol_usuario NOT NULL,
  PRIMARY KEY ("IdPrueba","IdUsuario")
);

CREATE TABLE IF NOT EXISTS "planDoPrueba" (
  "IdPlandePrueba" SERIAL PRIMARY KEY,
  "IdTester" INTEGER NOT NULL REFERENCES "Usuario"("IdUsuario"),
  "Descripcion" TEXT NOT NULL,
  "FechaEjecucion" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "planDoPruebaCasoPrueba" (
  "IdPlandePrueba" INTEGER REFERENCES "planDoPrueba"("IdPlandePrueba"),
  "IdPrueba" INTEGER REFERENCES "casoPrueba"("IdPrueba"),
  PRIMARY KEY ("IdPlandePrueba","IdPrueba")
);

CREATE TABLE IF NOT EXISTS "ResultadoEjecucionPrueba" (
  "IdResultado" SERIAL PRIMARY KEY,
  "IdPlandePrueba" INTEGER NOT NULL REFERENCES "planDoPrueba"("IdPlandePrueba"),
  "IdPrueba" INTEGER NOT NULL REFERENCES "casoPrueba"("IdPrueba"),
  "EstadoPrueba" estado_prueba NOT NULL,
  "Observaciones" TEXT,
  "FechaEjecucion" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Recepcion" (
  "IdRecepcion" SERIAL PRIMARY KEY,
  "FechaRecepcion" DATE NOT NULL,
  "Estado" estado_recepcion NOT NULL,
  "Comentarios" TEXT
);
