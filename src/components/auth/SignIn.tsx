import React from "react";
import { auth } from "../../firebase";

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function SingIn(){

    const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => {
        // Es una buena práctica manejar posibles errores aquí
        console.error("Error durante el inicio de sesión con Google: ", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">¡Bienvenido!</h1>
        <p className="mb-6 text-gray-600">Inicia sesión para acceder a la aplicación.</p>
        <button 
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300" 
          onClick={signInWithGoogle}
        >
          {/* Un pequeño ícono de Google para mejorar la UI */}
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Iniciar sesión con Google
        </button>
        <p className="mt-4 text-xs text-gray-500">Al continuar, aceptas nuestras normas de la comunidad.</p>
      </div>
    </div>
  );
}

export default SingIn; 