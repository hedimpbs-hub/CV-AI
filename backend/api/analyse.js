import { GoogleGenAI } from '@google/genai';

// Initialisation de l'API avec la variable d'environnement de Vercel
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Gestion du preflight request (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { critere, cv } = req.body;

  if (!critere || !cv) {
    return res.status(400).json({ error: 'Les champs critère et CV sont requis.' });
  }

  try {
    // Construction d'un prompt précis pour guider l'IA
    const promptConstructed = `
      Tu es un expert en recrutement RH. Analyse le CV fourni en fonction du profil recherché.
      
      PROFIL RECHERCHÉ :
      ${critere}
      
      TEXTE DU CV :
      ${cv}
      
      Donne ton analyse sous la forme suivante :
      1. Adéquation globale (Note sur 10 et résumé de 2 lignes)
      2. Points forts du candidat par rapport au poste
      3. Points faibles ou compétences manquantes
      4. Verdict final (Recommander ou Écarter pour un entretien)
    `;

    // Appel au modèle gemini-2.5-flash (rapide et efficace pour l'analyse de texte)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptConstructed,
    });

    return res.status(200).json({ reponse: response.text });

  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    return res.status(500).json({ error: 'Erreur interne lors de l\'analyse du CV.' });
  }
}