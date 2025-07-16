import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

api = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=api)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-2.5-flash')

def generar_respuestas(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"
    
@app.route('/api/generate',methods = ['POST'])
def generate_response():
    try:
        data = request.get_json()

        if not data or 'prompt' not in data:
            return jsonify({
                'error' : 'Se requiere un prompt en el JSON'
            }),400
        
        prompt = data['prompt']

        if not prompt.strip():
            return jsonify({
                'error' : 'El prompt esta vacio'
            }),400
        
        respuesta = generar_respuestas(prompt)

        return jsonify ({
            'success' : True,
            'response': respuesta,
            'prompt' : prompt
        })
        

    except Exception as e:
        return jsonify({
            'error' : f"Error interno del servidor: {str(e)}"
        }),500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Servidor funcionando correctamente'
    })   
        
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'API de Gemini funcionando',
        'endpoints': {
            'generate': '/api/generate (POST)',
            'health': '/api/health (GET)'
        }
    })
    
if __name__== "__main__":
    
    #prompt = "Explicame que es lost canvas"
    #respuesta = generar_respuestas(prompt)
    #print(respuesta)

    app.run(debug=True, host='0.0.0.0', port=5000)