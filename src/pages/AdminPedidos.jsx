import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarBoletas } from '../services/boletaService.js';

const formatoPrecio = (valor) =>
  Number(valor || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

const formatoFecha = (fecha) => {
  const fechaValida = new Date(fecha);
  return Number.isNaN(fechaValida.getTime())
    ? 'Fecha inválida'
    : fechaValida.toLocaleString('es-CL');
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('todos');

  // Cada vez que cambia "recargas", se vuelve a pedir el listado
  const [recargas, setRecargas] = useState(0);

  // GET /api/v1/boletas (ADMIN y VENDEDOR)
  useEffect(() => {
    listarBoletas()
      .then((lista) => {
        setPedidos([...lista].sort((a, b) => b.id - a.id));
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [recargas]);

  const actualizar = () => {
    setCargando(true);
    setRecargas((n) => n + 1);
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termino = busqueda.trim().toLowerCase();

    const coincideBusqueda =
      String(pedido.id).includes(termino) ||
      String(pedido.usuarioNombre || '').toLowerCase().includes(termino);

    const coincideEstado = estado === 'todos' || pedido.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <>
      <div className="admin-header-tabla">
        <h1>Administración de pedidos</h1>

        <button type="button" className="btn-nuevo" onClick={actualizar}>
          Actualizar listado
        </button>
      </div>

      <p className="admin-descripcion">
        Consulta las boletas registradas y revisa el detalle de cada compra.
      </p>

      <div className="admin-panel">
        <div className="admin-filtros-pedidos">
          <div>
            <label htmlFor="buscar-pedido">Buscar pedido</label>
            <input
              id="buscar-pedido"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="N.º de boleta o comprador"
            />
          </div>

          <div>
            <label htmlFor="filtrar-estado">Estado</label>
            <select
              id="filtrar-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">Pagada</option>
              <option value="ANULADA">Anulada</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p role="alert" className="error-msg">{error}</p>}

      {cargando ? (
        <div className="admin-panel">
          <p>Cargando pedidos...</p>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="admin-panel">
          <p>
            {pedidos.length === 0
              ? 'Todavía no hay pedidos registrados.'
              : 'No se encontraron pedidos con esos filtros.'}
          </p>
        </div>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>N.º boleta</th>
                <th>Fecha</th>
                <th>Comprador</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{formatoFecha(pedido.fecha)}</td>
                  <td>{pedido.usuarioNombre}</td>
                  <td>
                    {pedido.detalles.reduce((total, d) => total + d.cantidad, 0)}
                  </td>
                  <td>{formatoPrecio(pedido.total)}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    <Link className="btn-accion" to={'/admin/pedidos/' + pedido.id}>
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-descripcion">
        Pedidos encontrados: {pedidosFiltrados.length}
      </p>
    </>
  );
}