import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { cerrarSesion, nombreRol } from '../services/sesionService.js';
import useSesion from '../hooks/useSesion.js';

// Opciones del menú y qué roles pueden verlas
const OPCIONES_MENU = [
  { ruta: '/admin', texto: 'Dashboard', roles: ['ADMIN'], end: true },
  { ruta: '/admin/productos', texto: 'Productos', roles: ['ADMIN', 'VENDEDOR'] },
  { ruta: '/admin/usuarios', texto: 'Usuarios', roles: ['ADMIN'] },
  { ruta: '/admin/pedidos', texto: 'Pedidos', roles: ['ADMIN', 'VENDEDOR'] },
  { ruta: '/admin/reportes', texto: 'Reportes', roles: ['ADMIN'] }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const sesion = useSesion();

  const salir = () => {
    cerrarSesion();
    navigate('/login');
  };

  const opcionesVisibles = OPCIONES_MENU.filter((opcion) =>
    opcion.roles.includes(sesion?.rol)
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Sonido Vivo
        </div>

        {sesion && (
          <p className="admin-usuario">
            {sesion.nombreCompleto}
            <br />
            <small>Rol: {nombreRol(sesion.rol)}</small>
          </p>
        )}

        <nav>
          <ul>
            {opcionesVisibles.map((opcion) => (
              <li key={opcion.ruta}>
                <NavLink
                  to={opcion.ruta}
                  end={opcion.end}
                  className={({ isActive }) => isActive ? 'activo' : ''}
                >
                  {opcion.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-cerrar-sesion"
            onClick={salir}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  );
}