const CLAVE_STORAGE = 'carrito';

function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    if (Array.isArray(guardado)) return guardado;
  } catch {
    return [];
  }
  return [];
}

function guardarCarrito(lista) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
  window.dispatchEvent(new Event('carritoActualizado'));
}

function validarProducto(producto) {
  if (!producto || !producto.codigo) {
    throw new Error('El producto no existe');
  }
}

function crearItem(producto, cantidad) {
  return {
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    stock: producto.stock,
    cantidad
  };
}

export function obtenerCarrito() {
  return leerCarrito();
}

export function contarCarrito() {
  return leerCarrito().reduce(
    (total, item) => total + item.cantidad,
    0
  );
}

// Recibe el producto completo (como viene del catálogo) y agrega 1 unidad
export function agregarAlCarrito(producto) {
  return agregarCantidadAlCarrito(producto, 1);
}

// Recibe el producto completo y agrega la cantidad indicada
export function agregarCantidadAlCarrito(producto, cantidad) {
  validarProducto(producto);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error('La cantidad debe ser un entero mayor a cero');
  }

  if (producto.stock <= 0) {
    throw new Error('El producto no tiene stock');
  }

  const carrito = leerCarrito().map((item) => ({ ...item }));
  const existente = carrito.find((item) => item.codigo === producto.codigo);
  const cantidadActual = existente?.cantidad || 0;

  if (cantidadActual + cantidad > producto.stock) {
    throw new Error('No hay suficientes unidades disponibles');
  }

  if (existente) {
    existente.cantidad += cantidad;
    existente.stock = producto.stock;
    existente.precio = producto.precio;
  } else {
    carrito.push(crearItem(producto, cantidad));
  }

  guardarCarrito(carrito);
  return carrito;
}

export function cambiarCantidad(codigo, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error('La cantidad debe ser un entero mayor a cero');
  }

  const carrito = leerCarrito();
  const item = carrito.find((i) => i.codigo === codigo);

  if (!item) {
    throw new Error('El producto no está en el carrito');
  }

  if (item.stock != null && cantidad > item.stock) {
    throw new Error('No hay suficientes unidades disponibles');
  }

  const actualizado = carrito.map((i) =>
    i.codigo === codigo ? { ...i, cantidad } : i
  );

  guardarCarrito(actualizado);
  return actualizado;
}

export function eliminarDelCarrito(codigo) {
  const carrito = leerCarrito();
  const actualizado = carrito.filter(
    (item) => item.codigo !== codigo
  );

  guardarCarrito(actualizado);
  return actualizado;
}

export function vaciarCarrito() {
  guardarCarrito([]);
  return [];
}

export function calcularTotal() {
  return leerCarrito().reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
}