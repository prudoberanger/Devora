import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, image } = await request.json();

    // Construire le prompt à partir de l'historique
    let prompt = '';
    for (const msg of messages) {
      prompt += `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'} : ${msg.content}\n`;
    }
    prompt += 'Assistant : ';

    // Appel à l'API Gemini (modèle flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`;

    let parts = [{ text: prompt }];
    if (image && image.base64) {
      parts.unshift({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: image.base64
        }
      });
    }

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je n’ai pas pu générer de réponse.';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ error: 'Erreur lors de l’appel à Gemini.' }, { status: 500 });
  }
}
