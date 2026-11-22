import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';

export default function Registro() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    run: '',
    nombreCompleto: '',
    correo: '',
    direccion: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (datos.contrasena !== datos.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (datos.contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setEnviando(true);

    try {
      await apiFetch('/usuarios', {
        method: 'POST',
        body: {
          nombre: datos.nombreCompleto.trim(),
          email: datos.correo.trim().toLowerCase(),
          password: datos.contrasena,
          run: datos.run.trim(),
          direccion: datos.direccion.trim()
        }
      });

      navigate('/login', {
        state: { mensaje: 'Cuenta creada correctamente. Inicia sesión.' }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="container-contact">
      <section className="contact-section">
        <div className="contact-card">
          <div className="form-header">
            <h2>REGISTRARSE</h2>
          </div>

          <form className="contact-form" onSubmit={manejarRegistro}>
            <div className="form-group">
              <label htmlFor="run">RUN *</label>
              <input
                id="run"
                name="run"
                placeholder="12.345.678-9"
                value={datos.run}
                onChange={manejarCambio}
                maxLength={12}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombreCompleto">NOMBRE COMPLETO *</label>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                value={datos.nombreCompleto}
                onChange={manejarCambio}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">CORREO *</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={datos.correo}
                onChange={manejarCambio}
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">DIRECCIÓN *</label>
              <input
                id="direccion"
                name="direccion"
                value={datos.direccion}
                onChange={manejarCambio}
                maxLength={255}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">CONTRASEÑA *</label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                value={datos.contrasena}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">
                CONFIRMAR CONTRASEÑA *
              </label>
              <input
                id="confirmarContrasena"
                name="confirmarContrasena"
                type="password"
                value={datos.confirmarContrasena}
                onChange={manejarCambio}
                required
              />
            </div>

            {error && <p role="alert" className="error-msg">{error}</p>}

            <button type="submit" className="btn-submit" disabled={enviando}>
              {enviando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>

            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}