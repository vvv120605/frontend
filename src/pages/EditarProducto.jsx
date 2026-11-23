import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormularioProducto from '../components/FormularioProducto.jsx';
import {
  buscarProductoPorCodigo,
  actualizarProducto
} from '../services/catalogoService.js';

export default function EditarProducto() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Busca el producto en el backend por su código (la URL usa el código)
  useEffect(() => {
    buscarProductoPorCodigo(codigo)
      .then(setProducto)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [codigo]);

  // PUT /api/v1/productos/{id}
  const guardarCambios = async (datos) => {
    setError('');

    try {
      await actualizarProducto(producto.id, datos);
      navigate('/admin/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) {
    return <p>Cargando producto...</p>;
  }

  if (!producto) {
    return (
      <>
        <h1>Producto no encontrado</h1>
        {error && <p role="alert" className="error-msg">{error}</p>}
        <button
          type="button"
          className="btn-nuevo"
          onClick={() => navigate('/admin/productos')}
        >
          Volver
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Editar Producto</h1>

      <p className="admin-descripcion">
        Modifica los datos del producto. El código no se puede cambiar.
      </p>

      <FormularioProducto
        key={producto.codigo}
        productoInicial={producto}
        esEdicion={true}
        onGuardar={guardarCambios}
        onCancelar={() => navigate('/admin/productos')}
        error={error}
      />
    </>
  );
}