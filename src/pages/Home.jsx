import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carrusel from '../components/Carrusel.jsx';
import { listarProductos } from '../services/catalogoService.js';

// Cantidad de productos que se muestran como destacados en la portada
const CANTIDAD_DESTACADOS = 4;

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  // Los destacados vienen del backend: si cambia un precio, la portada se actualiza sola
  useEffect(() => {
    listarProductos()
      .then((productos) =>
        setDestacados(
          productos.filter((p) => p.stock > 0).slice(0, CANTIDAD_DESTACADOS)
        )
      )
      .catch(() => setDestacados([]));
  }, []);

  return (
    <main className="container-home">
      <Carrusel />

      {/* Grilla de productos destacados */}
      <section className="products-grid">
        {destacados.map((producto) => (
          <article className="product-card" key={producto.codigo}>
            <Link to={'/productos/' + producto.codigo} className="product-img-link">
              <div className="product-img">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
            </Link>
            <div className="product-info">
              <h3>
                <Link to={'/productos/' + producto.codigo}>{producto.nombre}</Link>
              </h3>
              <div className="product-details">
                <span className="attributes">{producto.categoria}</span>
                <span className="price">
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}