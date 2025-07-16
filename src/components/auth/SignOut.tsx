import React from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

function SignOut() {
  
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      
      console.error("Error al cerrar sesión: ", error);
    });
  };

  // El componente solo renderiza el botón si hay un usuario activo.
  return auth.currentUser && (
    <button 
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-300"
      onClick={handleSignOut}
    >
      Cerrar Sesión
    </button>
  );
}

export default SignOut;