import type { Message } from '../types';

const MOCK_RESPONSES = [
  "Merci pour votre question ! Chez Auralis, nous concevons des chatbots intelligents sur mesure. Pour en discuter, écrivez-nous à contact@studio-auralis.com !",
  "Nous proposons des solutions d'IA conversationnelle, du développement web moderne, et de l'intégration d'APIs. Contactez-nous à contact@studio-auralis.com pour en savoir plus !",
  "Bonne question ! Nos chatbots utilisent les dernières avancées en IA pour offrir une expérience naturelle. Envoyez-nous un mail à contact@studio-auralis.com pour discuter de votre projet !",
  "Nous avons accompagné plusieurs entreprises dans leur transformation digitale. Écrivez-nous à contact@studio-auralis.com pour découvrir nos réalisations !",
  "Notre approche : comprendre votre besoin, concevoir une solution élégante, et itérer jusqu'à la perfection. Parlons-en à contact@studio-auralis.com !",
  "Intéressé par un projet ? Super ! Ce chatbot est une démo de notre savoir-faire. Pour un devis personnalisé, contactez-nous directement à contact@studio-auralis.com.",
  "Nos projets vont du chatbot e-commerce à l'assistant RH intelligent. Chaque solution est sur mesure. Discutons-en par mail : contact@studio-auralis.com !",
  "L'IA conversationnelle, c'est notre passion. Ce chatbot est un aperçu de ce qu'on peut créer pour vous. Écrivez-nous à contact@studio-auralis.com !",
];

function getRandomDelay(): number {
  return 1000 + Math.random() * 1000;
}

function getMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export async function sendMessage(
  messages: Message[]
): Promise<string> {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return getMockResponse();
  }

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('API key not configured');
  }

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              `Tu es l'assistant IA d'Auralis, studio de développement web et IA. Tu es sympathique, pro et concis. 2-3 phrases max.

RÈGLES IMPORTANTES :
- Ce chatbot est une DÉMO intégrée dans un portfolio. Tu ne peux PAS envoyer de devis, prendre de rendez-vous, ni traiter de demandes concrètes.
- Dès qu'un visiteur montre de l'intérêt pour un projet, un devis, une collaboration, ou veut aller plus loin, tu dois TOUJOURS le rediriger vers contact@studio-auralis.com.
- Formule ça naturellement, par exemple : "Pour aller plus loin, écrivez-nous à contact@studio-auralis.com, on vous répondra rapidement !"
- Ne promets JAMAIS d'envoyer quoi que ce soit par mail toi-même. Tu es un assistant vitrine, pas un commercial.
- Tu peux parler de nos services (chatbots IA, développement web, intégration d'APIs) et montrer notre expertise, mais pour toute action concrète → contact@studio-auralis.com.`,
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
