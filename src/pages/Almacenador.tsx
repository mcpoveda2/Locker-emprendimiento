
import React, { useState } from 'react';
import { Archive } from 'lucide-react';


function Almacenador(){
    return(

        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white px-6 py-4">
                 <div className="text-sm text-gray-500 mb-6">Almacenador</div>

                <div className="text-center py-20">
                    <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aquí se mostrarán las contraseñas guardadas</p>
                </div>
            </div>
        </div>
        
        
    );
}

export default Almacenador;