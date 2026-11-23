import { useEffect, useState } from 'react';
import { listarCategorias } from '../services/catalogoService.js';

export default function FormularioProducto({
  productoInicial = {},
  onGuardar,
  onCancelar,
  esEdicion = false,
  error = ''
}) {
  // Las categorías vienen del backend (GET /api/v1/categorias)
  const [categorias, setCategorias] = useState([]);

  const [datos, setDatos] = useState({
    codigo: productoInicial.codigo ?? '',
    nombre: productoInicial.nombre ?? '',
    descripcion: productoInicial.descripcion ?? '',
    precio: productoInicial.precio ?? '',
    stock: productoInicial.stock ?? '',
    stockCritico: productoInicial.stockCritico ?? '',
    categoriaId: productoInicial.categoriaId ?? '',
    imagen: productoInicial.imagen ?? ''
  });

  const [errorLocal, setErrorLocal] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch(() => setErrorLocal('No se pudieron cargar las categorías'));
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    setErrorLocal('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    if (
      !String(datos.codigo).trim() ||
      !String(datos.nombre).trim() ||
      !datos.categoriaId
    ) {
      setErrorLocal('Código, nombre y categoría son obligatorios');
      return;
    }

    const precio = Number(datos.precio);
    if (datos.precio === '' || !Number.isInteger(precio) || precio <= 0) {
      setErrorLocal('El precio debe ser un número entero mayor a 0');
      return;
    }

    const stock = Number(datos.stock);
    if (datos.stock === '' || !Number.isInteger(stock) || stock < 0) {
      setErrorLocal('El stock debe ser un número entero mayor o igual a 0');
      return;
    }

    // El backend exige stock crítico; si se deja vacío se usa 0
    const stockCritico = datos.stockCritico === '' ? 0 : Number(datos.stockCritico);
    if (!Number.isInteger(stockCritico) || stockCritico < 0) {
      setErrorLocal('El stock crítico debe ser un número entero mayor o igual a 0');
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        codigo: String(datos.codigo).trim().toUpperCase(),
        nombre: String(datos.nombre).trim(),
        descripcion: String(datos.descripcion).trim(),
        precio,
        stock,
        stockCritico,
        categoriaId: Number(datos.categoriaId),
        imagen: String(datos.imagen).trim()
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={manejarEnvio} noValidate>
      <label htmlFor="codigo">Código *</label>
      <input
        id="codigo"
        name="codigo"
        placeholder="GT001"
        value={datos.codigo}
        onChange={manejarCambio}
        readOnly={esEdicion}
        maxLength={50}
      />

      <label htmlFor="nombre">Nombre *</label>
      <input
        id="nombre"
        name="nombre"
        value={datos.nombre}
        onChange={manejarCambio}
        maxLength={100}
      />

      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        name="descripcion"
        rows={3}
        value={datos.descripcion}
        onChange={manejarCambio}
        maxLength={500}
      />

      <label htmlFor="precio">Precio *</label>
      <input
        id="precio"
        name="precio"
        type="number"
        min="1"
        value={datos.precio}
        onChange={manejarCambio}
      />

      <label htmlFor="stock">Stock *</label>
      <input
        id="stock"
        name="stock"
        type="number"
        min="0"
        value={datos.stock}
        onChange={manejarCambio}
      />

      <label htmlFor="stockCritico">Stock crítico (si se deja vacío, 0)</label>
      <input
        id="stockCritico"
        name="stockCritico"
        type="number"
        min="0"
        value={datos.stockCritico}
        onChange={manejarCambio}
      />

      <label htmlFor="categoriaId">Categoría *</label>
      <select
        id="categoriaId"
        name="categoriaId"
        value={datos.categoriaId}
        onChange={manejarCambio}
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      <label htmlFor="imagen">Imagen (ruta, ej: /img/gt001.jpg)</label>
      <input
        id="imagen"
        name="imagen"
        value={datos.imagen}
        onChange={manejarCambio}
        maxLength={255}
      />

      {(errorLocal || error) && (
        <p className="error-msg" role="alert">
          {errorLocal || error}
        </p>
      )}

      <div className="admin-botones">
        <button type="submit" disabled={guardando}>
          {guardando
            ? 'Guardando...'
            : esEdicion ? 'Guardar cambios' : 'Guardar producto'}
        </button>

        <button
          type="button"
          className="admin-btn-cancelar"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}