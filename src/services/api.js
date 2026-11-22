const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
const CLAVE_SESION = 'sonidoVivo_sesion';

// ---------- Sesión guardada en el navegador ----------

export function leerSesionGuardada() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  window.dispatchEvent(new Event('sesionActualizada'));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.dispatchEvent(new Event('sesionActualizada'));
}

// ---------- Renovación del token ----------

async function renovarToken() {
  const sesion = leerSesionGuardada();
  if (!sesion?.refreshToken) return false;

  const respuesta = await fetch(API_URL + '/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: sesion.refreshToken })
  });

  if (!respuesta.ok) {
    borrarSesion(); // el refresh también venció: hay que volver a iniciar sesión
    return false;
  }

  const datos = await respuesta.json();
  guardarSesion({ ...sesion, token: datos.token, refreshToken: datos.refreshToken, rol: datos.rol });
  return true;
}

// ---------- Llamada genérica a la API ----------

export async function apiFetch(ruta, { method = 'GET', body } = {}, reintentar = true) {
  const sesion = leerSesionGuardada();
  const headers = {};

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (sesion?.token) headers.Authorization = 'Bearer ' + sesion.token;

  const respuesta = await fetch(API_URL + ruta, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  // Token vencido: se renueva una vez y se repite la petición
  if (respuesta.status === 401 && reintentar && sesion?.refreshToken && !ruta.startsWith('/auth/')) {
    if (await renovarToken()) {
      return apiFetch(ruta, { method, body }, false);
    }
  }

  if (!respuesta.ok) {
    let mensaje = 'Error ' + respuesta.status;
    try {
      const error = await respuesta.json();
      if (error.message) mensaje = error.message;
    } catch {
      /* respuesta sin JSON */
    }
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }

  return respuesta.status === 204 ? null : respuesta.json();
}