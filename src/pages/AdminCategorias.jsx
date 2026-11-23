import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../services/catalogoService.js';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // GET /api/v1/categorias
  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch((err) => setError(err.message));
  }, []);

  const recargar = async () => {
    setCategorias(await listarCategorias());
  };

  const limpiarFormulario = () => {
    setNombre('');
    setEditando(null);
  };

  // POST o PUT /api/v1/categorias
  const manejarGuardar = async (evento) => {
    evento.preventDefault();

    setError('');
    setMensaje('');

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      if (editando) {
        await actualizarCategoria(editando.id, nombreLimpio);
      } else {
        await crearCategoria(nombreLimpio);
      }

      await recargar();

      setMensaje(
        editando
          ? 'Categoría actualizada correctamente.'
          : 'Categoría creada correctamente.'
      );

      limpiarFormulario();
    } catch (err) {
      // Ej: "Ya existe una categoría con ese nombre" (409)
      setError(err.message);
    }
  };

  // DELETE /api/v1/categorias/{id}
  const manejarEliminar = async (categoria) => {
    if (!window.confirm('¿Eliminar la categoría ' + categoria.nombre + '?')) {
      return;
    }

    setError('');
    setMensaje('');

    try {
      await eliminarCategoria(categoria.id);
      await recargar();
      setMensaje('Categoría eliminada correctamente.');

      if (editando?.id === categoria.id) {
        limpiarFormulario();
      }
    } catch (err) {
      // Ej: "No se puede eliminar una categoría que tiene productos" (409)
      setError(err.message);
    }
  };

  const iniciarEdicion = (categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
    setError('');
    setMensaje('');
  };

  return (
    <section>
      <div className="admin-header-tabla">
        <h1>Administración de categorías</h1>

        <Link className="btn-nuevo" to="/admin/productos">
          Volver a productos
        </Link>
      </div>

      <p className="admin-descripcion">
        Crea, edita y elimina las categorías del catálogo.
      </p>

      {error && (
        <p role="alert" className="error-msg">
          {error}
        </p>
      )}

      {mensaje && <p role="status">{mensaje}</p>}

      <form className="admin-form" onSubmit={manejarGuardar}>
        <h2>{editando ? 'Editar categoría' : 'Nueva categoría'}</h2>

        <label htmlFor="nombre-categoria">Nombre *</label>

        <input
          id="nombre-categoria"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          maxLength={100}
          required
        />

        <div className="admin-botones">
          <button type="submit">
            {editando ? 'Guardar cambios' : 'Crear categoría'}
          </button>

          {editando && (
            <button
              type="button"
              className="admin-btn-cancelar"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Categorías registradas</h2>

      {categorias.length === 0 ? (
        <p>No hay categorías registradas.</p>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.id}</td>

                  <td>
                    <div className="admin-acciones">
                      <button
                        type="button"
                        className="btn-accion"
                        onClick={() => iniciarEdicion(categoria)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn-accion btn-eliminar"
                        onClick={() => manejarEliminar(categoria)}
                      >
                        Eliminar
                      </button>
                    </div>
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