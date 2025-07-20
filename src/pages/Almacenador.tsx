import React, { useState , useEffect } from 'react';
import { Archive } from 'lucide-react';

//firebase
import {ref, push, set, onValue, serverTimestamp} from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth';
import {database, auth} from '../firebase.js'
import { Search, Filter, Home, Wrench, Heart, Settings } from 'lucide-react';



function Almacenador(){

    
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [dataPass, setDataPass] = useState(null);


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
                        activeFilter === 'Entretenimiento'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Personal
                </button>

                



                
                
            </div>


            <button onClick={loadPasswordsFromFirebase}>
                ola
            </button>

            
        </div>
        
        
    );
}

export default Almacenador;