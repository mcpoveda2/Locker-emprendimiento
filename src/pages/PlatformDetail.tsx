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

        </div>
    )
    
}

export default PlatformDetail;