import { Lock } from 'lucide-react';

interface HelloAgentProps{
    name:string;
}

const HelloAgent = ({name}:HelloAgentProps) =>{
    return(
    <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Hola Agent</h1>
            <p className="text-gray-600">{name}</p>
          </div>
    )
}

export default HelloAgent;