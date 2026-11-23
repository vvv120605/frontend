import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerCarrito,
  calcularTotal,
  vaciarCarrito
} from '../services/carritoService.js';
import { crearBoleta } from '../services/boletaService.js';
import useSesion from '../hooks/useSesion.js';

const formatoPrecio = (valor) =>
  Number(valor).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

export default function Checkout() {
  const navigate = useNavigate();
  const sesion = useSesion();
  const [carrito] = useState(obtenerCarrito);
  const [procesando, setProcesando] = useState(false);

  const confirmar = async () => {
    if (procesando) return;
    setProcesando(true);

    try {
      // El backend crea la boleta a nombre del usuario del token
      const boleta = await crearBoleta(carrito);
      vaciarCarrito();

      navigate('/compra/exitosa', {
        state: { boleta },
        replace: true
      });
    } catch (err) {
      // Ej: "Stock insuficiente para: ..." (409) viene directo del backend
      navigate('/compra/error', {
        state: { mensaje: err.message }
      });
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="text-white">Confirmar compra</h1>
        <p className="text-white">Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5 checkout-page">
      <h1 className="mb-4">Confirmar compra</h1>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card p-3">
            <h2 className="h5">Comprador</h2>
            <p className="mb-1"><strong>Nombre:</strong> {sesion?.nombreCompleto}</p>
            <p><strong>Correo:</strong> {sesion?.correo}</p>
            <p className="text-muted small">
              La compra quedará registrada a tu nombre. Podrás verla en "Mis compras".
            </p>

            <button
              type="button"
              className="btn btn-success"
              onClick={confirmar}
              disabled={procesando}
            >
              {procesando ? 'Procesando...' : 'Confirmar compra'}
            </button>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-3">
            <h2 className="h5">Resumen de compra</h2>

            {carrito.map((item) => (
              <div
                key={item.codigo}
                className="d-flex justify-content-between mb-2"
              >
                <span>{item.nombre} × {item.cantidad}</span>
                <span>{formatoPrecio(item.precio * item.cantidad)}</span>
              </div>
            ))}

            <hr />
            <h3 className="h5">
              Total: {formatoPrecio(calcularTotal())}
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
}