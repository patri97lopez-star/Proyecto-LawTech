/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const MODEL_NAME = "gemini-3-flash-preview";

export async function processEmail(subject: string, body: string, type: string) {
  const prompt = `Actúa como un asistente jurídico experto para un despacho de abogados. 
  Has recibido un correo con el siguiente asunto: "${subject}" y tipo: "${type}".
  
  Cuerpo del correo:
  """
  ${body}
  """
  
  Por favor:
  1. Genera un resumen estructurado (Partes implicadas, Plazos, Acciones necesarias).
  2. Clasifica el correo en una categoría jurídica (ej. Juicios, Licitaciones, Contratos, etc.).
  3. Propón un borrador de respuesta formal, claro y sin jerga innecesaria.
  4. Intenta extraer el nombre del remitente y su correo electrónico si aparecen en el texto.
  
  Responde en formato JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          classification: { type: Type.STRING },
          suggestedDraft: { type: Type.STRING },
          senderName: { type: Type.STRING, nullable: true },
          senderEmail: { type: Type.STRING, nullable: true }
        },
        required: ["summary", "classification", "suggestedDraft"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function processJudicialMinute(procedureType: string, parties: string, keyPoints: string) {
  const prompt = `Actúa como un secretario judicial o abogado experto. Genera un acta estructurada basada en:
  Tipo de procedimiento: ${procedureType}
  Partes: ${parties}
  Puntos clave: ${keyPoints}
  
  Debe incluir:
  - Encabezado formal.
  - Resumen de hechos.
  - Resumen de alegaciones.
  - Decisiones y acuerdos adoptados.
  - Plazos y próximos pasos.
  
  Responde en formato JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          header: { type: Type.STRING },
          facts: { type: Type.STRING },
          allegations: { type: Type.STRING },
          decisions: { type: Type.STRING },
          nextSteps: { type: Type.STRING }
        },
        required: ["header", "facts", "allegations", "decisions", "nextSteps"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function processTender(type: string, organization: string, deadlines: string, requirements: string) {
  const prompt = `Actúa como un experto en licitaciones. Analiza la siguiente licitación:
  Tipo: ${type}
  Organismo: ${organization}
  Plazos: ${deadlines}
  Requisitos: ${requirements}
  
  Por favor:
  1. Genera un resumen de licitación en formato tabla (descripción breve).
  2. Crea una lista de tareas pendientes (Checklist).
  3. Propón un correo de presentación de ofertas o aviso de interés.
  
  Responde en formato JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryTable: { type: Type.STRING },
          tasks: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          presentationDraft: { type: Type.STRING }
        },
        required: ["summaryTable", "tasks", "presentationDraft"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getLegalChatResponse(history: { role: 'user' | 'model', message: string }[], userMessage: string) {
  const systemInstruction = `Eres un asistente jurídico experto integrado en LeyFlow, un software de gestión para despachos de abogados en España.
  Tienes un conocimiento profundo y actualizado de la legislación española, incluyendo pero no limitado a:
  - Código Civil
  - Código Penal
  - Código de Comercio (Mercantil)
  - Ley de Suelo y Rehabilitación Urbana (Urbanismo)
  - Ley de Enjuiciamiento Civil y Criminal
  - Ley de Contratos del Sector Público
  
  Tu objetivo es ayudar a los abogados con consultas rápidas, dudas sobre plazos, interpretación de artículos o redacción de párrafos legales.
  
  Reglas:
  1. Sé siempre profesional, formal y preciso.
  2. Cita artículos específicos de las leyes cuando sea posible.
  3. Si una consulta es ambigua, pide aclaraciones.
  4. Mantén tus respuestas concisas pero completas.
  5. Recuerda que eres un asistente, no un sustituto del criterio profesional del abogado.
  6. Responde siempre en español.`;

  const contents = [
    ...history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.message }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    //@ts-ignore - The SDK handles the structure but types can be strict
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}

export async function suggestInvoiceItems(workDescription: string) {
  const prompt = `Actúa como un experto en facturación para abogados en España. Basándote en la siguiente descripción de trabajo realizado, genera una lista de conceptos facturables (items de factura).
  
  Descripción del trabajo:
  """
  ${workDescription}
  """
  
  Por cada concepto, sugiere:
  1. Descripción profesional.
  2. Cantidad (ej. horas, unidades).
  3. Precio unitario sugerido (en base a mercado medio en España, en Euros).
  4. Tipo de IVA (normalmente 21%).
  
  Responde en formato JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unitPrice: { type: Type.NUMBER },
                taxRate: { type: Type.NUMBER }
              },
              required: ["description", "quantity", "unitPrice", "taxRate"]
            }
          }
        },
        required: ["suggestedItems"]
      }
    }
  });

  return JSON.parse(response.text);
}
