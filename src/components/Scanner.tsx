import React, { useState, useEffect, useRef , useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, QrCode, Camera, Copy, Eye, EyeOff, Square, CheckCircle, AlertCircle, Scan } from 'lucide-react';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import {database, auth} from '../firebase.js'
import {ref, onValue} from 'firebase/database'

import { onAuthStateChanged } from 'firebase/auth';
import type { DataPass } from '../interface/DataPass.tsx'
import type { PlatformData } from '../interface/PlatformData.tsx'

const Scanner = () =>{
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [captureCount, setCaptureCount] = useState(0);
    const [capturedPhotos, setCapturedPhotos] = useState([]);
    const [qrResults, setQrResults] = useState([]); // Para almacenar resultados de QR
    const [isProcessingQR, setIsProcessingQR] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [dataPass, setDataPass] = useState([]);//datos
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();


    const qr_api = 'http://api.qrserver.com/v1/read-qr-code/?fileurl=';
    
    const processQRCode = async (blob, photoId) => {
        try {
            setIsProcessingQR(true);
            
            // Crear FormData para enviar la imagen
            const formData = new FormData();
            formData.append('file', blob, `capture_${photoId}.jpg`);
            
            console.log(`Procesando QR para foto #${photoId}...`);
            
            const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log(`Resultado QR para foto #${photoId}:`, result);
            
            // La API devuelve un array con los resultados
            if (result && result.length > 0) {
                const qrData = result[0];
                
                if (qrData.symbol && qrData.symbol.length > 0) {
                    const qrContent = qrData.symbol[0].data;
                    const qrError = qrData.symbol[0].error;
                    
                    if (qrContent && !qrError) {
                        // QR detectado exitosamente
                        const newQRResult = {
                            id: photoId,
                            content: qrContent,
                            timestamp: new Date().toLocaleTimeString(),
                            success: true
                        };
                        
                        setQrResults(prev => [...prev, newQRResult]);
                        
                        console.log(`🎉 QR detectado en foto #${photoId}:`, qrContent);

                        const firebaseConfig = {
                            apiKey: "AIzaSyCHWA13y_lwuvaKBV9A4PUeJWWjDseYWDE",
                            authDomain: "horizon-auto-filler.firebaseapp.com",
                            projectId: "horizon-auto-filler",
                            storageBucket: "horizon-auto-filler.firebasestorage.app",
                            messagingSenderId: "917713430561",
                            appId: "1:917713430561:web:31846c0fb6f95980379b60"
                        };

                        const app = initializeApp(firebaseConfig);

                        const db = getFirestore(app);

                        const docRef = doc(db, "tmp", qrContent);

                        const docSnap = await getDoc(docRef);

                        const data = docSnap.data();

                        const paginaExtension = data?.page; // page de la base de datos de la extensión

                        const loadPasswordsFromFirebase = async (userID = user) =>{
                            const historyRef = ref(database, `users/${userID}/passwords`);
                            onValue(historyRef, (snapshot)=>{
                                setDataPass(snapshot.val());        
                            });
                        }

                        useEffect(() => {
                            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                              setUser(currentUser);
                              loadPasswordsFromFirebase(currentUser?.uid);
                            });
                            return () => unsubscribe();
                          }, []);

                        Object.entries(dataPass).map(async ([key, platformData]) => {
                            const typedPlatformData = platformData as PlatformData;
                            if (typedPlatformData.platform == paginaExtension) {
                                await updateDoc(docRef, {
                                    username: typedPlatformData.userEmail
                                });

                                await updateDoc(docRef, {
                                    password: typedPlatformData.password
                                });
                            }
                        });

                        // Opcional: detener el escaneo automáticamente cuando se detecta un QR
                        // stopCamera();
                        
                        return newQRResult;
                    } else if (qrError) {
                        console.log(`❌ Error en QR foto #${photoId}:`, qrError);
                    }
                } else {
                    console.log(`📷 No se detectó QR en foto #${photoId}`);
                }
            }
            
            return null;
            
        } catch (error) {
            console.error(`Error procesando QR para foto #${photoId}:`, error);
            
            const errorResult = {
                id: photoId,
                error: error.message,
                timestamp: new Date().toLocaleTimeString(),
                success: false
            };
            
            setQrResults(prev => [...prev, errorResult]);
            return null;
        } finally {
            setIsProcessingQR(false);
        }
    };

    // Función mejorada para capturar foto y procesar QR automáticamente
    const capturePhoto = async () => {
        if (!videoRef.current) return;
        
        const video = videoRef.current;
        
        // Crear canvas para capturar el frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Convertir a blob
        canvas.toBlob(async (blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                const timestamp = new Date().toLocaleTimeString();
                
                // Actualizar contador y agregar foto al array
                setCaptureCount(prev => {
                    const newCount = prev + 1;
                    
                    // Agregar foto al estado
                    setCapturedPhotos(prevPhotos => [...prevPhotos, {
                        id: newCount,
                        url: imageUrl,
                        blob: blob,
                        timestamp: timestamp,
                        width: canvas.width,
                        height: canvas.height,
                        qrProcessed: false
                    }]);
                    
                    console.log(`Foto capturada #${newCount}`, {
                        width: canvas.width,
                        height: canvas.height,
                        timestamp: timestamp
                    });
                    
                    // Procesar QR automáticamente
                    processQRCode(blob, newCount).then(qrResult => {
                        if (qrResult && qrResult.success) {
                            // Marcar la foto como procesada exitosamente
                            setCapturedPhotos(prevPhotos => 
                                prevPhotos.map(photo => 
                                    photo.id === newCount 
                                        ? { ...photo, qrProcessed: true, qrContent: qrResult.content }
                                        : photo
                                )
                            );
                        }
                    });
                    
                    return newCount;
                });
            }
        }, 'image/jpeg', 0.8);
    };

    // Función para reenviar una foto específica a la API de QR
    const reprocessQR = async (photo) => {
        await processQRCode(photo.blob, photo.id);
    };

    // Función para copiar contenido QR al portapapeles
    const copyQRContent = async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            alert('Contenido copiado al portapapeles!');
        } catch (err) {
            console.error('Error copiando al portapapeles:', err);
        }
    };

    // Función para descargar una foto
    const downloadPhoto = (photo) => {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `captura_${photo.id}_${photo.timestamp.replace(/:/g, '-')}.jpg`;
        link.click();
    };

    // Función para limpiar todas las fotos
    const clearAllPhotos = () => {
        capturedPhotos.forEach(photo => {
            URL.revokeObjectURL(photo.url);
        });
        setCapturedPhotos([]);
        setCaptureCount(0);
        setQrResults([]);
    };

    const startCamera = async () => {
        try {
            setError(null);
            setCaptureCount(0);
            setCapturedPhotos([]);
            setQrResults([]);
            
            console.log('Iniciando cámara...');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            setIsScanning(true);
            streamRef.current = stream;
            
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    
                    videoRef.current.onloadedmetadata = () => {
                        console.log('Video listo, iniciando capturas cada segundo...');
                        intervalRef.current = setInterval(capturePhoto, 1000);
                    };
                } else {
                    setError('Error: No se pudo acceder al elemento video');
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
    };

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            stopCamera();
            capturedPhotos.forEach(photo => {
                URL.revokeObjectURL(photo.url);
            });
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
