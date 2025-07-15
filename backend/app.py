import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=api)

model = genai.GenerativeModel('gemini-1.5-flash')

def generar_respuestas(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"
    
if __name__== "__main__":
    prompt = "Explicame que es lost canvas"
    respuesta = generar_respuestas(prompt)
    print(respuesta)