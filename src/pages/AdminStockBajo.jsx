import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProductos } from '../services/catalogoService.js';

export default function AdminStockBajo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Productos cuyo stock llegó a su nivel crítico (o menos)
  useEffect(() => {
    listarProductos()
      .then((lista) =>
        setProductos(lista.filter((p) => p.stock <= p.stockCritico))
      )
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section>
      <div className="admin-header-tabla">
        <h1>Productos con pocas unidades</h1>

        <Link className="btn-nuevo" to="/admin/productos">
          Volver a productos
        </Link>
      </div>

      <p className="admin-descripcion">
        Se muestran los productos cuyo stock es igual o menor a su stock crítico.
      </p>

      {error && <p role="alert" className="error-msg">{error}</p>}

      {cargando ? (
        <div className="admin-panel">
          <p>Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="admin-panel">
          <p>No hay productos con stock bajo.</p>
        </div>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock crítico</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.stockCritico}</td>
                  <td>
                    <Link
                      className="btn-accion"
                      to={'/admin/productos/' + encodeURIComponent(producto.codigo) + '/editar'}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}