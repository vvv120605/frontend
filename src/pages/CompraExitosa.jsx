import { Link, useLocation } from 'react-router-dom';

const formatoPrecio = (valor) =>
  Number(valor).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

export default function CompraExitosa() {
  const { state } = useLocation();
  const boleta = state?.boleta;

  return (
    <main className="container py-5 text-center">
      <h1 className="text-white mb-4">¡Compra exitosa!</h1>

      <div className="card p-4 mx-auto" style={{ maxWidth: '550px' }}>
        <h2 className="text-success">Boleta generada</h2>
        <p>Tu compra se ha registrado correctamente.</p>

        {boleta && (
          <div className="text-start">
            <p><strong>Boleta N°:</strong> {boleta.id}</p>
            <p><strong>Fecha:</strong> {new Date(boleta.fecha).toLocaleString('es-CL')}</p>
            <p><strong>Estado:</strong> {boleta.estado}</p>

            <ul>
              {boleta.detalles.map((detalle) => (
                <li key={detalle.id}>
                  {detalle.productoNombre} × {detalle.cantidad} — {formatoPrecio(detalle.subtotal)}
                </li>
              ))}
            </ul>

            <p><strong>Total:</strong> {formatoPrecio(boleta.total)}</p>
          </div>
        )}

        <div className="d-flex justify-content-center gap-2 mt-3">
          <Link to="/mis-compras" className="btn btn-success">
            Ver mis compras
          </Link>
          <Link to="/productos" className="btn btn-primary">
            Volver a productos
          </Link>
        </div>
      </div>
    </main>
  );
}