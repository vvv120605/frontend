import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSesion from '../hooks/useSesion.js';

// Deja pasar solo a usuarios con sesión y con uno de los roles indicados.
// - Sin sesión: lo envía al login (y después del login vuelve a la página que quería ver).
// - Con sesión pero sin permiso: lo envía a la página que le corresponde según su rol.
export default function RutaProtegida({ roles, children }) {
  const sesion = useSesion();
  const location = useLocation();

  if (!sesion) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          desde: location.pathname,
          mensaje: 'Debes iniciar sesión para acceder a esa página.'
        }}
      />
    );
  }

  if (roles && !roles.includes(sesion.rol)) {
    const destino = sesion.rol === 'VENDEDOR' ? '/admin/productos' : '/';
    return <Navigate to={destino} replace />;
  }

  return children ?? <Outlet />;
}