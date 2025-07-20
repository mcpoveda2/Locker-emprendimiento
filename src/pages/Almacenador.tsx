import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';

//firebase
import {ref, push, set, onValue, serverTimestamp} from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth';
import {database, auth} from '../firebase.js'
import { Search, Filter, Home, Wrench, Heart, Settings } from 'lucide-react';


import PlatformIcon from '../components/PlatformIcon.js';

interface PlatformData {
  context: string;
  createdAt: number;
  password: string;
  platform: string;
  userEmail: string;
  userId: string;
}

interface DataPass {
  [key: string]: PlatformData;
}

function Almacenador(){

    const navigate = useNavigate();

    
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    const [dataPass, setDataPass] = useState<DataPass | null>(null);


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if(currentUser){
            setUser(currentUser.uid);
            setLoading(false);
            loadPasswordsFromFirebase(currentUser.uid);
        }
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (dataPass) {
            console.log("Datos cargados:", dataPass);
        }else{
            console.log("Datos NO cargados");
        }
    }, [dataPass]);

 
    const loadPasswordsFromFirebase = async (userID = user) =>{
        const historyRef = ref(database, `users/${userID}/passwords`);
        onValue(historyRef, (snapshot)=>{
            const data = snapshot.val();
            setDataPass(data);
                  
        });
    }

    const getPlatformColor = (platformName : string) => {
        const name = platformName.toLowerCase();
        if (name.includes('facebook')) return 'bg-blue-50';
        if (name.includes('instagram')) return 'bg-pink-50';
        if (name.includes('pinterest')) return 'bg-red-50';
        if (name.includes('x') || name.includes('twitter')) return 'bg-purple-50';
        else return getRandomColor()
       
    };

    const getRandomColor = () => {
        const colors = ['bg-green-50', 'bg-blue-50', 'bg-purple-50', 'bg-red-50', 'bg-yellow-50', 'bg-pink-50', 'bg-indigo-50'];
        return colors[Math.floor(Math.random() * colors.length)];
    };


    const handleSocialButtonClick = (platformData : PlatformData) => {
        console.log(`Opening ${platformData.platform}...`, platformData);
        navigate('/platform');
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }


    return(

        <div className="min-h-screen bg-gray-50">

             {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-center">Almacenador de Contraseñas</h1>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Ingrese alguna plataforma"
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg border-none outline-none text-gray-700"
                    />
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="px-6 py-2 flex items-center space-x-3">
                <button
                    onClick={() => setActiveFilter('All')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        activeFilter === 'All'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('Entretenimiento')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        activeFilter === 'Entretenimiento'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Entretenimiento
                </button>

                <button
                    onClick={() => setActiveFilter('Personal')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        activeFilter === 'Personal'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Personal
                </button> 
            </div>

            {/* Social Media Cards */}
            <div className="px-6 py-6 grid grid-cols-2 gap-4 flex-1">
                {dataPass && Object.entries(dataPass).map(([key, platformData]) => {
                    const typedPlatformData = platformData as PlatformData;
                    
                    return (
                        <button
                            key={key}
                            onClick={() => handleSocialButtonClick(typedPlatformData)}
                            className={`${getPlatformColor(typedPlatformData.platform)} relative overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-100/50`}
                            style={{ aspectRatio: '1', minHeight: '140px' }}
                        >
                            <div className="absolute inset-0 p-4 flex flex-col justify-between h-full">
                                {/* Ícono en la parte superior */}
                                <div className="flex justify-start">
                                    <PlatformIcon platformName = {typedPlatformData.platform}/>
                                </div>
                                
                                {/* Nombre en la parte inferior */}
                                <div className="flex justify-start">
                                    <span className="text-gray-900 font-medium text-lg text-left">
                                        {typedPlatformData.platform}
                                    </span>
                                </div>
                            </div>

                            {/* Efecto de brillo sutil */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    );
                })}
            </div>


        </div>
         
    );
}

export default Almacenador;