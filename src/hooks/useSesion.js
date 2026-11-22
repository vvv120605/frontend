import { useEffect, useState } from 'react';
import { obtenerSesion } from '../services/sesionService.js';

// Devuelve la sesión actual y se actualiza sola al iniciar o cerrar sesión
// (también si se cierra la sesión en otra pestaña del navegador).
export default function useSesion() {
  const [sesion, setSesion] = useState(obtenerSesion);

  useEffect(() => {
    const actualizar = () => setSesion(obtenerSesion());

    window.addEventListener('sesionActualizada', actualizar);
    window.addEventListener('storage', actualizar);

    return () => {
      window.removeEventListener('sesionActualizada', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  return sesion;
}