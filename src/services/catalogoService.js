import { apiFetch } from './api.js';

// Convierte un producto del backend al formato que usan las páginas de la tienda.
// El backend envía "categoriaNombre"; las páginas usan "categoria".
function aProducto(dto) {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    precio: dto.precio,
    stock: dto.stock,
    stockCritico: dto.stockCritico,
    imagen: dto.imagen,
    categoriaId: dto.categoriaId,
    categoria: dto.categoriaNombre
  };
}

// GET /api/v1/productos (público)
export async function listarProductos() {
  const productos = await apiFetch('/productos');
  return productos.map(aProducto);
}

// Busca un producto por su código (GT001, BT001...). Devuelve null si no existe.
export async function buscarProductoPorCodigo(codigo) {
  const buscado = String(codigo ?? '').trim().toUpperCase();
  const productos = await listarProductos();
  return productos.find((producto) => producto.codigo === buscado) ?? null;
}

// GET /api/v1/categorias (público)
export async function listarCategorias() {
  return apiFetch('/categorias');
}

// Arma el cuerpo que espera el backend (ProductoRequestDTO)
function aProductoRequest(datos) {
  return {
    codigo: datos.codigo,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    stock: datos.stock,
    stockCritico: datos.stockCritico,
    imagen: datos.imagen,
    categoriaId: datos.categoriaId
  };
}

// POST /api/v1/productos
export async function crearProducto(datos) {
  const creado = await apiFetch('/productos', { method: 'POST', body: aProductoRequest(datos) });
  return aProducto(creado);
}

// PUT /api/v1/productos/{id}
export async function actualizarProducto(id, datos) {
  const actualizado = await apiFetch('/productos/' + id, { method: 'PUT', body: aProductoRequest(datos) });
  return aProducto(actualizado);
}

// DELETE /api/v1/productos/{id}
export async function eliminarProducto(id) {
  return apiFetch('/productos/' + id, { method: 'DELETE' });
}

// POST /api/v1/categorias
export async function crearCategoria(nombre) {
  return apiFetch('/categorias', { method: 'POST', body: { nombre } });
}

// PUT /api/v1/categorias/{id}
export async function actualizarCategoria(id, nombre) {
  return apiFetch('/categorias/' + id, { method: 'PUT', body: { nombre } });
}

// DELETE /api/v1/categorias/{id}
export async function eliminarCategoria(id) {
  return apiFetch('/categorias/' + id, { method: 'DELETE' });
}