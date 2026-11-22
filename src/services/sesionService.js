import { apiFetch, leerSesionGuardada, guardarSesion, borrarSesion } from './api.js';

const NOMBRES_ROL = { ADMIN: 'Administrador', VENDEDOR: 'Vendedor', CLIENTE: 'Cliente' };

export function obtenerSesion() {
  return leerSesionGuardada();
}

export async function iniciarSesion(correo, contrasena) {
  const email = correo.trim().toLowerCase();

  const datos = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password: contrasena }
  });

  const sesion = {
    token: datos.token,
    refreshToken: datos.refreshToken,
    rol: datos.rol,                 // ADMIN, VENDEDOR o CLIENTE
    nombreCompleto: datos.nombre,
    correo: email
  };

  guardarSesion(sesion);
  return sesion;
}

export function cerrarSesion() {
  borrarSesion();
}

export function nombreRol(rol) {
  return NOMBRES_ROL[rol] ?? rol;
}

export function tieneRol(...roles) {
  const sesion = obtenerSesion();
  return !!sesion && roles.includes(sesion.rol);
}