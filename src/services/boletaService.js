import { apiFetch } from './api.js';

// POST /api/v1/boletas (requiere sesión)
// Solo se envía qué productos y cuántas unidades: el backend toma al comprador
// desde el token, calcula los precios y el total, valida el stock y lo descuenta.
export async function crearBoleta(carrito) {
  if (carrito.some((item) => !item.id)) {
    throw new Error(
      'Tu carrito tiene productos antiguos. Vacíalo y vuelve a agregarlos desde el catálogo.'
    );
  }

  return apiFetch('/boletas', {
    method: 'POST',
    body: {
      detalles: carrito.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad
      }))
    }
  });
}

// GET /api/v1/boletas/mias (requiere sesión): compras del usuario logueado
export async function listarMisBoletas() {
  return apiFetch('/boletas/mias');
}

// GET /api/v1/boletas: todas las boletas
export async function listarBoletas() {
  return apiFetch('/boletas');
}

// GET /api/v1/boletas/{id}: detalle de una boleta
export async function obtenerBoleta(id) {
  return apiFetch('/boletas/' + encodeURIComponent(id));
}

// PATCH /api/v1/boletas/{id}/estado?estado=PAGADA (solo ADMIN)
// Si el estado es ANULADA, el backend devuelve el stock de cada producto.
export async function cambiarEstadoBoleta(id, estado) {
  return apiFetch(
    '/boletas/' + encodeURIComponent(id) + '/estado?estado=' + encodeURIComponent(estado),
    { method: 'PATCH' }
  );
}