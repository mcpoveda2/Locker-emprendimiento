import { useNavigate } from "react-router-dom";
import { Lock, Play} from 'lucide-react';




const GeneratePassBut = () =>{

    const navigate = useNavigate();

    const handleNavigation = () =>{
        navigate('/generator');
    }
    
    return(
        <button 
            onClick={handleNavigation}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl mb-6 flex items-center justify-center transition-colors"
        >
        <span className="mr-2">GENERAR CONTRASEÑA</span>
        <Play className="w-5 h-5 fill-current" />
        <Play className="w-5 h-5 fill-current -ml-1" />
        </button>
    )

}


export default GeneratePassBut;
