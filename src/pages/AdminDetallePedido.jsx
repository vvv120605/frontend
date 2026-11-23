import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerBoleta, cambiarEstadoBoleta } from '../services/boletaService.js';
import { tieneRol } from '../services/sesionService.js';

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

export default function AdminDetallePedido() {
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Solo el administrador puede cambiar el estado; el vendedor solo ve
  const esAdmin = tieneRol('ADMIN');

  // GET /api/v1/boletas/{id}
  useEffect(() => {
    obtenerBoleta(id)
      .then(setPedido)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  const cambiarEstado = async (nuevoEstado) => {
    if (
      nuevoEstado === 'ANULADA' &&
      !window.confirm('¿Anular la boleta N.º ' + pedido.id + '? El stock de sus productos se devolverá.')
    ) {
      return;
    }

    setProcesando(true);
    setError('');
    setMensaje('');

    try {
      // PATCH /api/v1/boletas/{id}/estado (al anular, el backend devuelve el stock)
      const actualizado = await cambiarEstadoBoleta(pedido.id, nuevoEstado);
      setPedido(actualizado);
      setMensaje(
        nuevoEstado === 'ANULADA'
          ? 'Boleta anulada. El stock de sus productos fue devuelto.'
          : 'Boleta marcada como ' + nuevoEstado + '.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return <p>Cargando pedido...</p>;
  }

  if (!pedido) {
    return (
      <section>
        <h1>Pedido no encontrado</h1>
        <p>{error || 'No existe una boleta con el número ' + id + '.'}</p>

        <Link to="/admin/pedidos" className="btn-nuevo">
          Volver a pedidos
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="admin-header-tabla">
        <h1>Detalle del pedido</h1>

        <Link to="/admin/pedidos" className="btn-nuevo">
          Volver a pedidos
        </Link>
      </div>

      {mensaje && <p role="status">{mensaje}</p>}
      {error && <p role="alert" className="error-msg">{error}</p>}

      <section className="admin-panel">
        <h2>Resumen de compra</h2>

        <div className="admin-detalle">
          <p><strong>Boleta N.º:</strong> {pedido.id}</p>
          <p><strong>Fecha:</strong> {formatoFecha(pedido.fecha)}</p>
          <p><strong>Estado:</strong> {pedido.estado}</p>
          <p><strong>Comprador:</strong> {pedido.usuarioNombre}</p>
        </div>

        {esAdmin && pedido.estado !== 'ANULADA' && (
          <div className="admin-acciones">
            {pedido.estado === 'PENDIENTE' && (
              <button
                type="button"
                className="btn-accion"
                disabled={procesando}
                onClick={() => cambiarEstado('PAGADA')}
              >
                Marcar como pagada
              </button>
            )}

            <button
              type="button"
              className="btn-accion btn-eliminar"
              disabled={procesando}
              onClick={() => cambiarEstado('ANULADA')}
            >
              Anular boleta
            </button>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <h2>Productos del pedido</h2>

        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedido.detalles.map((detalle) => (
                <tr key={detalle.id}>
                  <td>{detalle.productoNombre}</td>
                  <td>{formatoPrecio(detalle.precioUnitario)}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{formatoPrecio(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <th colSpan={3}>Total del pedido</th>
                <th>{formatoPrecio(pedido.total)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}