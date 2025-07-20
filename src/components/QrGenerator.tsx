import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Eye, EyeOff } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const QRGenerator = () => {
    const location = useLocation();

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
        const timeoutId = setTimeout(() => {
        generateQRCode();
        }, 500); // Espera 500ms después de que el usuario deje de escribir

        return () => clearTimeout(timeoutId);
    });

    // Función para descargar el QR
    const downloadQR = async () => {
        if (!qrImageUrl) return;

        try {
        const response = await fetch(qrImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        } catch (err) {
        setError('Error al descargar la imagen');
        }
    };

    // Función para copiar texto al portapapeles
    const copyToClipboard = async () => {
        try {
        await navigator.clipboard.writeText(inputText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
        setError('No se pudo copiar al portapapeles');
        }
    };

    // Ejemplos predefinidos
    const examples = 'MiContraseña123!';

    const setExample = (example : string) => {
        setInputText(example);
    };
    

    return(
        <div>
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
    )

}
export default QRGenerator;