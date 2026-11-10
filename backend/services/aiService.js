// ===================================================================
// TRAUMURLAUB LANKA – AI SERVICE ("ASK TRAUMURLAUB AI")
// Integrates with OpenAI API (GPT-4o / GPT-3.5) with Context Memory
// and High-Fidelity Local Knowledge Fallback Engine
// ===================================================================

const https = require('https');

const SYSTEM_PROMPT = `You are Traumurlaub AI, the friendly Sri Lankan tourism expert for Traumurlaub Lanka.
You are knowledgeable about Sri Lanka's destinations, cultural heritage, wildlife, beaches, travel experiences, local food, tourism, and itineraries.
Help international visitors understand Sri Lanka and plan unforgettable travel experiences.
Recommend destinations and tours according to visitors' interests, trip duration, family requirements, honeymoon preferences, wildlife interests, culture, adventure, and relaxation.
Suggest practical sample itineraries and explain destinations accurately.
Promote Traumurlaub Lanka tours naturally when appropriate.

Company information:
Traumurlaub Lanka.
Owner / Founder: Nirosh.
Approximately 15 years of tourism experience.
More than 2,500 customers served.
For bookings and inquiries:
WhatsApp: +94 777 978 768.
Email: nirosh19@yahoo.com, traumurlaublanka.sl@gmail.com.

Tour packages:
- 3 Nights / 4 Days: Discover Sri Lanka – Short Island Escape (Negombo, Sigiriya, Dambulla, Kandy)
- 5 Nights / 6 Days: Sri Lanka Highlights – Culture & Nature (Negombo, Sigiriya, Dambulla, Kandy, Nuwara Eliya, Ella)
- 7 Nights / 8 Days: Ultimate Sri Lanka Island Adventure (Negombo, Sigiriya, Dambulla, Kandy, Nuwara Eliya, Ella, Yala Safari, Galle)
- 1-Day Excursions: Sigiriya & Dambulla, Kandy, Galle Fort, Ella Scenic, Yala Safari, Udawalawe Safari, Colombo City, Bentota River Safari, Nuwara Eliya Tea Country, Mirissa Whale Watching.

Crucial rules:
Never invent confirmed pricing, hotel availability, or confirmed bookings.
If uncertain, recommend contacting Traumurlaub Lanka directly via WhatsApp (+94 777 978 768).
Be welcoming, helpful, professional, and passionate about Sri Lanka.`;

async function getChatbotResponse(userMessage, conversationHistory = []) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-') && !apiKey.includes('your_openai_api_key')) {
    try {
      return await callOpenAI(apiKey, userMessage, conversationHistory);
    } catch (err) {
      console.warn('OpenAI API request failed, falling back to local expert system:', err.message);
      return generateLocalExpertResponse(userMessage);
    }
  }

  // Built-in intelligent local Sri Lanka travel expert response
  return generateLocalExpertResponse(userMessage);
}

function callOpenAI(apiKey, userMessage, conversationHistory) {
  return new Promise((resolve, reject) => {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.filter(m => m.role !== 'system').slice(-6),
      { role: 'user', content: userMessage }
    ];

    const postData = JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 450
    });

    const req = https.request({
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            resolve({
              reply: parsed.choices[0].message.content,
              actions: [
                { label: 'Chat on WhatsApp', url: 'https://wa.me/94777978768' },
                { label: 'Explore Packages', url: 'tours.html' },
                { label: 'Send Inquiry', url: 'contact.html' }
              ]
            });
          } else {
            reject(new Error(parsed.error?.message || 'Invalid response from OpenAI'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function generateLocalExpertResponse(query) {
  const q = query.toLowerCase();

  let reply = '';
  let actions = [
    { label: 'Plan My Tour', url: 'contact.html' },
    { label: 'Chat on WhatsApp', url: 'https://wa.me/94777978768' }
  ];

  if (q.includes('sigiriya')) {
    reply = "Sigiriya is Sri Lanka's crown jewel! This 5th-century fortress of King Kashyapa stands 200m above the jungle, featuring the legendary lion paws entrance, mirror wall, and colorful frescoes. We include Sigiriya on our 3-Day, 5-Day, and 7-Day tours, as well as private 1-day excursions.";
    actions.push({ label: 'Explore Tours', url: 'tours.html' });
  } else if (q.includes('ella') || q.includes('bridge') || q.includes('train')) {
    reply = "Ella is beloved for the iconic Nine Arch Bridge in Demodara, hiking Little Adam's Peak, and enjoying the world-famous hill-country scenic train ride through misty tea plantations! Traumurlaub Lanka includes Ella in both our 5-Night and 7-Night tours.";
    actions.push({ label: 'View 5-Day Tour', url: 'tours.html#tour-02' });
  } else if (q.includes('safari') || q.includes('elephant') || q.includes('yala') || q.includes('udawalawe')) {
    reply = "Sri Lanka is an extraordinary safari destination! Yala National Park offers one of the world's highest densities of leopards, while Udawalawe guarantees magnificent wild elephant herds. Both can be explored via private 4x4 jeeps on our tours and day excursions.";
    actions.push({ label: 'Yala Safari Details', url: 'excursions.html' });
  } else if (q.includes('beach') || q.includes('mirissa') || q.includes('bentota') || q.includes('arugam')) {
    reply = "For beaches, Mirissa offers whale watching and scenic palm hills, Bentota is perfect for golden sand relaxation and river safaris, while Arugam Bay is famous for world-class surfing. We can easily arrange beach days at the conclusion of your tour!";
  } else if (q.includes('7 day') || q.includes('7-day') || q.includes('8 day') || q.includes('plan')) {
    reply = "For an unforgettable one-week journey, we recommend our 7 Nights / 8 Days Ultimate Island Adventure: Negombo → Sigiriya & Dambulla → Kandy → Nuwara Eliya → Ella → Yala Safari → Galle Fort. Would you like Nirosh to customize this for you?";
    actions.push({ label: 'View 7-Day Tour', url: 'tours.html#tour-03' });
  } else if (q.includes('nirosh') || q.includes('who are you') || q.includes('experience')) {
    reply = "Traumurlaub Lanka was founded by Nirosh, bringing approximately 15 years of tourism excellence and over 2,500 happy travelers! We specialize in private, personalized Sri Lanka tours with dedicated guidance and modern air-conditioned vehicles.";
    actions.push({ label: 'About Us', url: 'about.html' });
  } else {
    reply = "Ayubowan! I am Traumurlaub AI. Sri Lanka has so much to offer: ancient citadels in Sigiriya, tea country in Nuwara Eliya & Ella, thrilling safaris in Yala, and tropical beaches in Mirissa and Bentota. How many days are you planning to visit, or what experiences are you most excited to see?";
  }

  return { reply, actions };
}

module.exports = {
  getChatbotResponse
};
