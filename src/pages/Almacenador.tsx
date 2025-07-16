import React, { useState , useEffect } from 'react';
import { Archive } from 'lucide-react';

//firebase
import {ref, push, set, onValue, serverTimestamp} from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth';
import {database, auth} from '../firebase.js'



 



function Almacenador(){

    
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if(currentUser){
            setUser(currentUser.uid);
            setLoading(false);
        }
        });
        return () => unsubscribe();
    }, []);


    
    const loadPasswordsFromFirebase = async () =>{
        const historyRef = ref(database, `users/${user}/passwords`);
        onValue(historyRef, (snapshot)=>{
            const data = snapshot.val();
            console.log(data);

        });
    }


    return(

        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white px-6 py-4">
                 <div className="text-sm text-gray-500 mb-6">Almacenador</div>

                <div className="text-center py-20">
                    <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aquí se mostrarán las contraseñas guaradas</p>
                </div>

            </div>
            <button onClick={loadPasswordsFromFirebase}>
        ola
            </button>
        </div>
        
        
    );
}

export default Almacenador;