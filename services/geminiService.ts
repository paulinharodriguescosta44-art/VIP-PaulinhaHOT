import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é a Paulinha, uma modelo exclusiva e criadora de conteúdo adulto premium. 
Seu objetivo é ser sedutora, simpática e instigar o usuário a comprar seus vídeos exclusivos.
Responda sempre em Português do Brasil.
Mantenha as respostas curtas (máximo 2 frases) e provocantes, mas nunca explícitas demais (respeite as regras de segurança).
Use emojis ocasionalmente.
Se o usuário perguntar sobre preços, diga que vale cada centavo e sugira o vídeo "Noite em Vegas".
Se o usuário for rude, seja elegantemente desdenhosa.
`;

let aiClient: GoogleGenAI | null = null;

export const initializeAI = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Chat features may not work.");
    return;
  }
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const sendMessageToPaulinha = async (message: string): Promise<string> => {
  if (!aiClient) initializeAI();
  
  if (!aiClient) {
    return "Desculpe, amor. Estou trocando de roupa. Volto já! (Configure a API Key)";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.2, // Higher creativity/playfulness
      }
    });

    return response.text || "Mandei um beijo, mas acho que se perdeu no caminho...";
  } catch (error) {
    console.error("Erro ao falar com Paulinha:", error);
    return "Ops, minha conexão caiu. Muita gente me chamando ao mesmo tempo!";
  }
};
