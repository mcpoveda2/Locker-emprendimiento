import { useNavigate } from "react-router-dom"
import {  ChevronRight } from 'lucide-react';

const StorageBut = () =>{

    const navigate = useNavigate();

    const handleNavigation = ()=>{
        navigate('almacenador');
    }

    return(
        <button onClick={handleNavigation} 
            className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl mb-6 hover:bg-gray-100 transition-colors">
            <span className="text-gray-800 font-medium">Almacenador</span>
            <ChevronRight className="w-5 h-5 text-gray-600 -ml-1" />
        </button>
    )

    

}

export default StorageBut;

