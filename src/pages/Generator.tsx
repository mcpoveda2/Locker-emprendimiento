import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Copy, RefreshCw, Settings } from 'lucide-react';

import HelloAgent from '../components/HelloAgent';


const PasswordGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    platform: '',
    personalElement: '',
    context: '',
    length: 'medium'
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const API_URL = 'http://localhost:5000/api/generate';
  const HEALTH_URL = 'http://localhost:5000/api/health';

  const steps = [
    {
      title: 'Hola Agent',
      subtitle: 'Michael Poveda',
      question: '¿Para qué plataforma necesitas la contraseña?',
      placeholder: 'Ej: Facebook, Gmail, Banco...',
      field: 'platform'
    },
    {
      title: 'Hola Agent',
      subtitle: 'Michael Poveda',
      question: '¿Cuéntame algo personal que te guste o recuerdes?',
      placeholder: 'Ej: La playa, mi gato, pizza...',
      field: 'personalElement'
    },
    {
      title: 'Hola Agent',
      subtitle: 'Michael Poveda',
      question: '¿Hay algún contexto específico que quieras incluir?',
      placeholder: 'Ej: Trabajo, estudios, personal...',
      field: 'context'
    }
  ];

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [steps[currentStep].field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePassword();
    }
  };

  {/*Generacion de contraseña*/}

  const generatePassword = async () => {
    setIsGenerating(true);
    setFeedback('');
    
    try {
      // Configurar longitud según la selección
      const lengthMapping = {
        short: '8-12 caracteres',
        medium: '12-16 caracteres',
        long: '16-20 caracteres'
      };

      const prompt = `Eres un generador de contraseñas seguras y memorables. Genera una contraseña basada en los siguientes elementos:

Plataforma: ${formData.platform}
Elemento personal: ${formData.personalElement}
Contexto: ${formData.context}
Longitud deseada: ${lengthMapping[formData.length]}

INSTRUCCIONES ESPECÍFICAS:
1. Combina estos elementos de manera natural y memorable en FRASES (IMPORTANTE)
2. Usa Mayusculas SOLO EN LA PRIMERA LETRA
3. Hazla segura pero fácil de recordar (IMPORTANTE)
4. Usa el elemento personal como base principal
5. Integra la plataforma de manera orgánica
6. Añade números relevantes al contexto pero SIEMPRE AL FINAL
7. NO USAR SIMBOLOS NI EMOJIS





EJEMPLO: Si es para Facebook, le gusta la playa y es personal, podrías generar algo como "LaPlayaEnFacebook"

Responde SOLO con la contraseña generada, sin explicaciones adicionales.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt : prompt
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data["response"])
      //const password = data.candidates[0].content.parts[0].text.trim();
      const password = data["response"]
      console.log(password)


      setGeneratedPassword(password);
      setFeedback('¡Contraseña generada exitosamente con IA! Es segura y memorable.');
      
    } catch (error) {
      console.error('Error generating password:', error);
      setFeedback('Error al generar la contraseña. Intentando con generador local...');
      
      // Fallback al generador local si falla la API
      const fallbackPassword = generateMockPassword();
      setGeneratedPassword(fallbackPassword);
      setFeedback('Contraseña generada con generador local. Funciona correctamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  {/*Contraseña local*/}

  const generateMockPassword = () => {
    const { platform, personalElement, context } = formData;
    
    // Algoritmo local como fallback
    const platformWord = platform.charAt(0).toUpperCase() + platform.slice(1);
    const personalWord = personalElement.charAt(0).toUpperCase() + personalElement.slice(1);
    const contextWord = context.charAt(0).toUpperCase() + context.slice(1);
    
    const numbers = Math.floor(Math.random() * 99) + 10;
    const symbols = ['!', '@', '#', '$', '%'][Math.floor(Math.random() * 5)];
    
    return `${personalWord}En${platformWord}${contextWord}${numbers}${symbols}`;
  };


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setFeedback('¡Contraseña copiada al portapapeles!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      setFeedback('Error al copiar la contraseña');
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      platform: '',
      personalElement: '',
      context: '',
      length: 'medium'
    });
    setGeneratedPassword('');
    setShowPassword(false);
    setFeedback('');
  };


  {/*Si esta generado la contraseña*/}


  if (generatedPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg max-w-md w-full p-8">

          {/*Saludo*/}

          <HelloAgent name={"Michael Poveda"}/>

          <div className="space-y-6">

            {/*Mostrar contraseñas*/}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">

              <p className="text-green-800 font-medium mb-3">Tu contraseña segura generada con IA:</p>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm flex-1 mr-2">
                    {showPassword ? generatedPassword : '•'.repeat(generatedPassword.length)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*Consejos */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 text-sm">
                <strong>Consejos de seguridad:</strong><br/>
                • No compartas esta contraseña<br/>
                • Úsala solo para {formData.platform}<br/>
                • Guárdala en un lugar seguro<br/>
                • Esta contraseña fue generada con IA para ser memorable
              </p>
            </div>

            {feedback && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-gray-700 text-sm">{feedback}</p>
              </div>
            )}

            {/*Botones */}


            <div className="flex space-x-3">
              <button
                onClick={generatePassword}
                disabled={isGenerating}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Generar Nueva con IA
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Empezar de Nuevo
              </button>
            </div>
          </div>


          <div className="mt-8 text-center">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-md w-full p-8">
        {/*Saludo*/}

        <HelloAgent name={steps[currentStep].subtitle}/>

        <div className="space-y-6">

          {/* Questions */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium mb-3">{steps[currentStep].question}</p>
            <div className="bg-white rounded-lg border border-green-200">
              <textarea
                value={formData[steps[currentStep].field]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={steps[currentStep].placeholder}
                className="w-full p-3 border-none rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>
          </div>

          {/*Longitud de contraseña*/}

          {currentStep === steps.length - 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 font-medium mb-3">Configuración adicional:</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Longitud de contraseña:
                  </label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short">Corta (8-12 caracteres)</option>
                    <option value="medium">Media (12-16 caracteres)</option>
                    <option value="long">Larga (16-20 caracteres)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            {/*Boton siguiente o generar con ia*/}
            <button
              onClick={handleNext} //sumar mas 1 o generar
              disabled={!formData[steps[currentStep].field].trim() || isGenerating}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Generando con IA...
                </div>
              ) : (
                currentStep === steps.length - 1 ? 'Generar con IA' : 'Siguiente'
              )}
            </button>

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
          </div>

          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>


        </div>

        <div className="mt-8 text-center">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;