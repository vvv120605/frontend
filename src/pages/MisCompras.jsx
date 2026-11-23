import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMisBoletas } from '../services/boletaService.js';

const formatoPrecio = (valor) =>
  Number(valor).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

export default function MisCompras() {
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // GET /api/v1/boletas/mias: el backend devuelve solo las compras del usuario del token
  useEffect(() => {
    listarMisBoletas()
      .then((lista) => setBoletas([...lista].sort((a, b) => b.id - a.id)))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="container py-5">
      <h1 className="text-white mb-4">Mis compras</h1>

      {cargando && <p className="text-white">Cargando tus compras...</p>}

      {error && <p role="alert" className="error-msg">{error}</p>}

      {!cargando && !error && boletas.length === 0 && (
        <div className="card p-4 text-center">
          <p>Aún no tienes compras.</p>
          <Link to="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      )}

      {boletas.map((boleta) => (
        <div className="card p-3 mb-3" key={boleta.id}>
          <div className="d-flex justify-content-between flex-wrap">
            <strong>Boleta N° {boleta.id}</strong>
            <span>{new Date(boleta.fecha).toLocaleString('es-CL')}</span>
            <span>Estado: {boleta.estado}</span>
          </div>

          <ul className="mt-2 mb-2">
            {boleta.detalles.map((detalle) => (
              <li key={detalle.id}>
                {detalle.productoNombre} × {detalle.cantidad} — {formatoPrecio(detalle.subtotal)}
              </li>
            ))}
          </ul>

          <strong>Total: {formatoPrecio(boleta.total)}</strong>
        </div>
      ))}
    </main>
  );
}