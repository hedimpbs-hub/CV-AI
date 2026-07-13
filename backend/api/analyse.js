import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { critere, fileData, mimeType } = req.body;

  if (!critere || !fileData || !mimeType) {
    return res.status(400).json({ error: 'Les critères et le fichier sont requis.' });
  }

  try {
    const promptConstructed = `
      Tu es un expert en recrutement RH. Analyse le document de CV fourni en fonction du profil recherché ci-dessous.
      
      PROFIL RECHERCHÉ :
      ${critere}
      
      Donne ton analyse sous la forme suivante :
      1. Adéquation globale (Note sur 10 et résumé de 2 lignes)
      2. Points forts du candidat par rapport au poste
      3. Points faibles ou compétences manquantes
      4. Verdict final (Recommander ou Écarter pour un entretien)
    `;

    // Appel à Gemini en incluant à la fois le texte et les données du fichier
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        promptConstructed,
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        }
      ],
    });

    return res.status(200).json({ reponse: response.text });

  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    return res.status(500).json({ error: 'Erreur interne lors de l\'analyse du fichier.' });
  }
}
