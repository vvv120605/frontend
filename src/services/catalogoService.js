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