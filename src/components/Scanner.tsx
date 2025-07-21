import React, { useState, useEffect, useRef , useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, QrCode, Camera, Copy, Eye, EyeOff, Square, CheckCircle, AlertCircle, Scan } from 'lucide-react';



const Scanner = () =>{
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [captureCount, setCaptureCount] = useState(0);
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);


    const navigate = useNavigate();

    const qr_api = 'http://api.qrserver.com/v1/read-qr-code/?fileurl=';
    
    // Función para capturar foto
    const capturePhoto = () => {
        console.log("en capture");
        if (!videoRef.current) return;
        console.log("en capture")
        const video = videoRef.current;
        
        // Crear canvas para capturar el frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Incrementar contador de capturas
        setCaptureCount(prev => prev + 1);
        
        console.log(`Foto capturada #${captureCount + 1}`, {
        width: canvas.width,
        height: canvas.height,
        timestamp: new Date().toLocaleTimeString()
        });
    };

    const startCamera = async () => {
    try {
      setError(null);
      setCaptureCount(0);
      
      console.log('Iniciando cámara...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      console.log('Stream obtenido:', stream);
      
      // PRIMERO cambiar el estado para que se renderice el video element
      setIsScanning(true);
      streamRef.current = stream;
      
      // LUEGO usar setTimeout para que React termine de renderizar
      setTimeout(() => {
        console.log('videoRef.current después del render:', videoRef.current);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Stream asignado al video');
          
          // Esperar a que el video cargue y luego empezar a capturar cada segundo
          videoRef.current.onloadedmetadata = () => {
            console.log('Video listo, iniciando capturas cada segundo...');
            intervalRef.current = setInterval(capturePhoto, 1000);
          };
        } else {
          console.error('videoRef.current sigue siendo null después del render');
          setError('Error: No se pudo acceder al elemento video');
          // Detener el stream si no podemos usarlo
          stream.getTracks().forEach(track => track.stop());
          setIsScanning(false);
        }
      }, 100);
      
    } catch (err) {
      setError('Error al acceder a la cámara: ' + err.message);
      console.error('Error:', err);
      setIsScanning(false);
    }
  };

    // Detener la cámara
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
        setCaptureCount(0);
    };

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
        stopCamera();
        };
    }, []);



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
                <h1 className="text-xl font-semibold">Scanner</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                </button>
            </div>  

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cámara Test</h2>
                <p className="text-gray-600">Prueba de cámara con captura automática</p>
            </div>


            {/* Área de video */}
            <div className="relative mb-6">
                {!isScanning ? (
                <div className="bg-gray-100 rounded-lg p-12 text-center">
                    <Camera className="mx-auto mb-4 text-gray-400" size={64} />
                    <p className="text-gray-500">Presiona para iniciar la cámara</p>
                </div>
                ) : (
                <div className="relative">
                    <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg bg-black"
                    />
                    {/* Overlay con información */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                    <div>📷 Activa</div>
                    <div>Capturas: {captureCount}</div>
                    </div>
                    {/* Marco de captura */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Square className="text-white opacity-50" size={200} strokeWidth={2} />
                    </div>
                </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Botones */}
            <div className="space-y-3">
                {!isScanning ? (
                <button
                    onClick={startCamera}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                    <Camera className="mr-2" size={20} />
                    Iniciar Cámara
                </button>
                ) : (
                <button
                    onClick={stopCamera}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Detener Cámara
                </button>
                )}
            </div>

            {/* Info */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                {isScanning 
                    ? `Capturando fotos cada segundo. Total: ${captureCount}`
                    : 'La cámara capturará fotos automáticamente cada segundo'
                }
                </p>
            </div>


        </div>
    )

}

export default Scanner;
