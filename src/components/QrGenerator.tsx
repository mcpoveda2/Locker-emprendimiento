import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, QrCode, Camera, Copy, Eye, EyeOff } from 'lucide-react';



const QRGenerator = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [inputText, setInputText] = useState('');
    const [qrImageUrl, setQrImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const password = location.state?.password as string;

    // Función para generar el código QR
    const generateQRCode = async () => {
        if (!password.trim()) {
        setQrImageUrl('');
        return;
        }

        setIsLoading(true);
        setError('');

        try {
        // Usamos la API de QR Server (gratuita y sin límites)
        const size = 300; // Tamaño del QR en píxeles
        const encodedText = encodeURIComponent(password);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x$150&data=${encodedText}&format=png&ecc=M`;
        
        // Verificamos que la URL sea válida
        const response = await fetch(qrUrl, { method: 'HEAD' });
        if (response.ok) {
            setQrImageUrl(qrUrl);
        } else {
            throw new Error('Error al generar el código QR');
        }
        } catch (err) {
        setError('No se pudo generar el código QR. Intenta de nuevo.');
        setQrImageUrl('');
        } finally {
        setIsLoading(false);
        }
    };

    // Efecto para generar QR cuando cambia el texto (con delay para evitar muchas peticiones)
    useEffect(() => {
        generateQRCode();
    });


    return(

        <div>
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-semibold">Seccion</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                </button>
            </div>  

            <div className="min-h-screen bg-green-100 p-4 flex flex-col item-center justify-center ">
             

            <h2 className="text-xl font-semibold text-black mb-4 text-center">Codigo Qr Generado</h2>
            
            <div className='flex item-center justify-center'>
                <div className="mb-6">
                <div className="inline-block p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-inner">
                <img
                    src={qrImageUrl}
                    alt="Código QR generado"
                    className="mx-auto rounded-lg shadow-md border-4 border-white"
                />
                </div>
            </div>

            </div>
              
        </div>

        </div>
        
        
    )

}
export default QRGenerator;