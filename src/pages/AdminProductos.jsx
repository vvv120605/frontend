import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  listarProductos,
  eliminarProducto
} from '../services/catalogoService.js';
import { tieneRol } from '../services/sesionService.js';

export default function AdminProductos() {
  const { codigo } = useParams();

  const [productos, setProductos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(
    codigo ? codigo.toUpperCase() : null
  );
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // El vendedor solo puede ver; crear, editar y eliminar es del administrador
  const esAdmin = tieneRol('ADMIN');

  // GET /api/v1/productos
  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch((err) => setError(err.message));
  }, []);

  // DELETE /api/v1/productos/{id}
  const manejarEliminar = async (producto) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar ' + producto.nombre + '?'
    );

    if (!confirmar) return;

    setError('');
    setMensaje('');

    try {
      await eliminarProducto(producto.id);
      setSeleccionado(null);
      setProductos(await listarProductos());
      setMensaje('Producto eliminado correctamente.');
    } catch (err) {
      // Ej: "No se puede eliminar un producto que tiene ventas registradas" (409)
      setError(err.message);
    }
  };

  const productoSeleccionado = productos.find(
    (producto) => producto.codigo === seleccionado
  );

  return (
    <>
      <div className="admin-header-tabla">
        <h1>Administración de Productos</h1>

        {esAdmin && (
          <Link to="/admin/productos/nuevo" className="btn-nuevo">
            + Nuevo Producto
          </Link>
        )}
      </div>

      <p className="admin-descripcion">
        Consulta y administra los productos del catálogo de Sonido Vivo.
      </p>

      {esAdmin && (
        <p className="admin-descripcion">
          <Link to="/admin/productos/stock-bajo">Ver productos con pocas unidades</Link>
          {' | '}
          <Link to="/admin/categorias">Administrar categorías</Link>
        </p>
      )}

      {error && (
        <p role="alert" className="error-msg">
          {error}
        </p>
      )}
      
      {mensaje && <p role="status">{mensaje}</p>}

      {productos.length === 0 ? (
        <div className="admin-panel">
          <p>No hay productos registrados.</p>
        </div>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio.toLocaleString('es-CL')}</td>
                  <td>{producto.stock}</td>

                  <td>
                    <div className="admin-acciones">
                      <button
                        type="button"
                        className="btn-accion"
                        onClick={() => setSeleccionado(producto.codigo)}
                      >
                        Ver
                      </button>

                      {esAdmin && (
                        <>
                          <Link
                            className="btn-accion"
                            to={'/admin/productos/' + encodeURIComponent(producto.codigo) + '/editar'}
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="btn-accion btn-eliminar"
                            onClick={() => manejarEliminar(producto)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {productoSeleccionado && (
        <section className="admin-panel" aria-label="Detalle del producto">
          <div className="admin-header-tabla">
            <h2>Detalle del producto</h2>

            <button
              type="button"
              className="admin-btn-cerrar"
              onClick={() => setSeleccionado(null)}
            >
              Cerrar
            </button>
          </div>

          <div className="admin-detalle">
            <p><strong>Código:</strong> {productoSeleccionado.codigo}</p>
            <p><strong>Nombre:</strong> {productoSeleccionado.nombre}</p>
            <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
            <p><strong>Descripción:</strong> {productoSeleccionado.descripcion || 'Sin descripción'}</p>
            <p>
              <strong>Precio:</strong> ${productoSeleccionado.precio.toLocaleString('es-CL')}
            </p>
            <p><strong>Stock:</strong> {productoSeleccionado.stock}</p>
            <p>
              <strong>Stock crítico:</strong>{' '}
              {productoSeleccionado.stockCritico ?? 'Sin definir'}
            </p>
            <p><strong>Imagen:</strong> {productoSeleccionado.imagen || 'Sin imagen'}</p>
          </div>
        </section>
      )}
    </>
  );
}