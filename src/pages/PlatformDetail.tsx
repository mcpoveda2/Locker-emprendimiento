import React, {useState} from "react";

import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, QrCode, Camera, Copy, Eye, EyeOff } from 'lucide-react';

import PlatformIcon from '../components/PlatformIcon';


import type { PlatformData } from '../interface/PlatformData.tsx'
import type { DataPass } from '../interface/DataPass.tsx'

const PlatformDetail = () =>{
    
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const platformData = location.state?.platformData as PlatformData;

    console.log('imprimir datos',platformData)

    if (!platformData) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <p className="text-gray-600">No se encontraron datos de la plataforma</p>
            <button 
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
                Volver al inicio
            </button>
            </div>
        </div>
        );
    }

    const getPlatformGradient = (platformName: string) => {
        const name = platformName.toLowerCase();
        if (name.includes('facebook')) return 'bg-gradient-to-br from-blue-400 to-blue-600';
        if (name.includes('instagram')) return 'bg-gradient-to-br from-pink-400 to-purple-600';
        if (name.includes('pinterest')) return 'bg-gradient-to-br from-red-400 to-red-600';
        if (name.includes('x') || name.includes('twitter')) return 'bg-gradient-to-br from-purple-400 to-purple-600';
        return 'bg-gradient-to-br from-green-400 to-green-600';
    };

    const handleCopyPassword = async () => {
        try {
        await navigator.clipboard.writeText(platformData.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        console.error('Error al copiar:', err);
        }
    };

    const handleQRCode = () => {
        // Implementar funcionalidad del QR Code
        console.log('Generar QR Code');
    };

    const handleScan = () => {
        // Implementar funcionalidad de escanear
        console.log('Escanear');
    };

    return(
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-semibold">{platformData.platform}</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                </button>
            </div>

            <div className="flex flex-col items-center px-6 py-8">

                
                <div className={`w-24 h-24 rounded-full ${getPlatformGradient(platformData.platform)} flex items-center justify-center shadow-lg mb-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <PlatformIcon platformName={platformData.platform} size="lg" />
                    </div>
                </div>

                {/* Password Section */}
                <div className="w-full max-w-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{platformData.platform}</h2>

                    <h3 className="text-xl font-semibold text-green-600 mb-4 text-center">Contraseña</h3>
            
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                        <div className="flex items-center justify-between">
                        <div className="flex-1 mr-3 text-center">
                            <span className="text-gray-900 font-medium text-lg break-all ">
                            {showPassword ? platformData.password : '•'.repeat(platformData.password.length)}
                            </span>
                        </div>
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {showPassword ? 
                            <EyeOff className="w-5 h-5 text-gray-600" /> : 
                            <Eye className="w-5 h-5 text-gray-600" />
                            }
                        </button>
                        </div>
                    </div> 

                    {/* Context if available */}
                    {platformData.context && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Uso:</h4>
                        <span className="text-gray-900 break-all">{platformData.context}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                        onClick={handleQRCode}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 px-4 flex flex-col items-center justify-center transition-colors shadow-md"
                        >
                        <QrCode className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">QR Code</span>
                        </button>
                        
                        <button
                        onClick={handleScan}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 px-4 flex flex-col items-center justify-center transition-colors shadow-md"
                        >
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Escanear</span>
                        </button>
                    </div>

                    {/* Copy Password Button */}
                    <button
                        onClick={handleCopyPassword}
                        className={`w-full mt-4 py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        copied 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                        } border`}
                    >
                        <Copy className="w-5 h-5" />
                        <span>{copied ? 'Copiado!' : 'Copiar Contraseña'}</span>
                    </button>
                    
                </div>

            </div>
            



        </div>
    )
    
}

export default PlatformDetail;