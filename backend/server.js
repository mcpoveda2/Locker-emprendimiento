// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  }
});

// Rate limiting específico para generación de contraseñas
const passwordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 contraseñas por IP cada 5 minutos
  message: {
    error: 'Límite de generación de contraseñas excedido, intenta en 5 minutos'
  }
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
});

// Middleware para validar datos de entrada
const validatePasswordRequest = (req, res, next) => {
  const { platform, personalElement, context, length } = req.body;
  
  if (!platform || !personalElement) {
    return res.status(400).json({
      error: 'Plataforma y elemento personal son requeridos'
    });
  }
  
  if (platform.length > 50 || personalElement.length > 100 || (context && context.length > 100)) {
    return res.status(400).json({
      error: 'Los campos exceden la longitud máxima permitida'
    });
  }
  
  const allowedLengths = ['short', 'medium', 'long'];
  if (length && !allowedLengths.includes(length)) {
    return res.status(400).json({
      error: 'Longitud de contraseña no válida'
    });
  }
  
  next();
};

// Función para limpiar y sanitizar inputs
const sanitizeInput = (input) => {
  return input.replace(/[<>\"'&]/g, '').trim();
};

// Función para generar contraseña con Gemini
const generatePasswordWithGemini = async (platform, personalElement, context, length) => {
  const lengthMap = {
    short: '8-12',
    medium: '12-16',
    long: '16-20'
  };
  
  const targetLength = lengthMap[length] || '12-16';
  
  const prompt = `
Eres un experto en ciberseguridad especializado en crear contraseñas seguras y memorables.

Genera UNA contraseña que combine estos elementos de manera natural y memorable:
- Plataforma/Servicio: ${platform}
- Elemento personal: ${personalElement}
- Contexto: ${context || 'uso general'}
- Longitud objetivo: ${targetLength} caracteres

REGLAS IMPORTANTES:
1. La contraseña debe ser fácil de recordar pero segura
2. Incluye al menos: 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
3. Combina los elementos de forma creativa y natural
4. Evita patrones obvios o secuencias comunes
5. No uses información personal identificable directamente
6. Asegúrate de que tenga entre ${targetLength} caracteres

FORMATO DE RESPUESTA:
Devuelve SOLO la contraseña generada, sin explicaciones adicionales.

Ejemplo de estilo: "MiGato2024EnFace!" (pero adapta a los elementos proporcionados)
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const password = response.text().trim();
    
    // Validar que la respuesta sea una contraseña válida
    if (!password || password.length < 8 || password.length > 25) {
      throw new Error('Contraseña generada no válida');
    }
    
    return password;
  } catch (error) {
    console.error('Error generando contraseña con Gemini:', error);
    throw new Error('Error al generar contraseña con IA');
  }
};

// Función para evaluar seguridad de contraseña
const evaluatePasswordStrength = (password) => {
  let score = 0;
  let feedback = [];
  
  // Longitud
  if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else feedback.push('Considera una contraseña más larga');
  
  // Mayúsculas
  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Incluye al menos una mayúscula');
  
  // Minúsculas
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Incluye al menos una minúscula');
  
  // Números
  if (/\d/.test(password)) score += 15;
  else feedback.push('Incluye al menos un número');
  
  // Símbolos
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  else feedback.push('Incluye al menos un símbolo');
  
  // Variedad de caracteres
  if (password.length > 0) {
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 15;
  }
  
  let strength = 'Débil';
  if (score >= 80) strength = 'Muy fuerte';
  else if (score >= 60) strength = 'Fuerte';
  else if (score >= 40) strength = 'Moderada';
  
  return {
    score,
    strength,
    feedback: feedback.slice(0, 3) // Máximo 3 sugerencias
  };
};

// Endpoint principal para generar contraseñas
app.post('/api/generate-password', passwordLimiter, validatePasswordRequest, async (req, res) => {
  try {
    const { platform, personalElement, context, length = 'medium' } = req.body;
    
    // Sanitizar inputs
    const cleanPlatform = sanitizeInput(platform);
    const cleanPersonal = sanitizeInput(personalElement);
    const cleanContext = context ? sanitizeInput(context) : '';
    
    // Generar contraseña con Gemini
    const password = await generatePasswordWithGemini(
      cleanPlatform,
      cleanPersonal,
      cleanContext,
      length
    );
    
    // Evaluar seguridad
    const security = evaluatePasswordStrength(password);
    
    // Generar consejos personalizados
    const tips = [
      `Usa esta contraseña solo para ${cleanPlatform}`,
      'No la compartas con nadie',
      'Guárdala en un gestor de contraseñas seguro',
      'Cámbiala cada 6-12 meses'
    ];
    
    res.json({
      success: true,
      password,
      security,
      tips,
      metadata: {
        platform: cleanPlatform,
        length: password.length,
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error en generación de contraseña:', error);
    
    // Respuesta de fallback en caso de error
    res.status(500).json({
      success: false,
      error: 'Error al generar contraseña. Por favor, intenta de nuevo.',
      fallback: true
    });
  }
});

// Endpoint para verificar salud del servicio
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiAvailable: !!process.env.GEMINI_API_KEY
  });
});

// Endpoint para obtener consejos de seguridad
app.get('/api/security-tips', (req, res) => {
  const tips = [
    {
      title: 'Usa contraseñas únicas',
      description: 'Cada cuenta debe tener su propia contraseña'
    },
    {
      title: 'Activa autenticación de dos factores',
      description: 'Añade una capa extra de seguridad'
    },
    {
      title: 'Actualiza regularmente',
      description: 'Cambia tus contraseñas cada 6-12 meses'
    },
    {
      title: 'Usa un gestor de contraseñas',
      description: 'Herramientas como 1Password o Bitwarden son muy útiles'
    }
  ];
  
  res.json({ tips });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 Cliente permitido: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🤖 Gemini API configurada: ${!!process.env.GEMINI_API_KEY}`);
});

module.exports = app;