/* ===================================================================
   TRAUMURLAUB LANKA – "ASK TRAUMURLAUB AI" CHATBOT
   - Real AI Tourism Assistant with Context Memory
   - Quick Prompt Chips
   - Fast Server-Side API Call with Intelligent Fallback Knowledge
   - Action Buttons (WhatsApp, Tours, Contact)
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

function initChatbot() {
  const triggerBtn = document.querySelector('.chatbot-trigger-btn');
  const chatWindow = document.querySelector('.chatbot-window');
  const closeBtn = document.querySelector('.chatbot-close-btn');
  const chatBody = document.querySelector('.chatbot-body');
  const chatInput = document.querySelector('.chatbot-input');
  const sendBtn = document.querySelector('.chatbot-send-btn');
  const typingIndicator = document.querySelector('.chatbot-typing');

  if (!triggerBtn || !chatWindow) return;

  let conversationHistory = [
    {
      role: 'system',
      content: 'You are Traumurlaub AI, the friendly Sri Lankan tourism expert for Traumurlaub Lanka.'
    }
  ];

  // Toggle window
  triggerBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  // Quick reply chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
      handleUserMessage(prompt);
    });
  });

  // Send message event
  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    handleUserMessage(text);
  };

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  async function handleUserMessage(userText) {
    appendMessage('user', userText);
    conversationHistory.push({ role: 'user', content: userText });

    showTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Network error or server unavailable');
      }

      const data = await response.json();
      showTyping(false);

      if (data && data.reply) {
        appendMessage('bot', data.reply, data.actions);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        appendMessage('bot', getLocalFallbackAnswer(userText));
      }
    } catch (err) {
      showTyping(false);
      // Seamless local intelligent fallback
      const fallbackReply = getLocalFallbackAnswer(userText);
      appendMessage('bot', fallbackReply);
      conversationHistory.push({ role: 'assistant', content: fallbackReply });
    }
  }

  function appendMessage(sender, text, actions = null) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    // Convert newlines to breaks and links to html
    let formattedText = escapeHtml(text).replace(/\n/g, '<br>');
    bubble.innerHTML = formattedText;

    if (actions && Array.isArray(actions) && actions.length > 0) {
      const actionContainer = document.createElement('div');
      actionContainer.style.marginTop = '10px';
      actionContainer.style.display = 'flex';
      actionContainer.style.flexWrap = 'wrap';
      actionContainer.style.gap = '6px';

      actions.forEach(act => {
        const btn = document.createElement('a');
        btn.href = act.url;
        btn.className = 'btn btn-sm btn-primary';
        btn.style.fontSize = '0.76rem';
        btn.style.padding = '5px 12px';
        btn.textContent = act.label;
        if (act.url.startsWith('http')) {
          btn.target = '_blank';
          btn.rel = 'noopener';
        }
        actionContainer.appendChild(btn);
      });
      bubble.appendChild(actionContainer);
    }

    // Insert before typing indicator
    if (typingIndicator) {
      chatBody.insertBefore(bubble, typingIndicator);
    } else {
      chatBody.appendChild(bubble);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping(show) {
    if (!typingIndicator) return;
    if (show) {
      typingIndicator.classList.add('active');
      chatBody.appendChild(typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    } else {
      typingIndicator.classList.remove('active');
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getLocalFallbackAnswer(query) {
    const q = query.toLowerCase();

    if (q.includes('sigiriya')) {
      return "Sigiriya is Sri Lanka's renowned 5th-century Rock Fortress and UNESCO World Heritage site, built by King Kashyapa! It features the famous Lion Gate, exquisite frescoes, and water gardens. Traumurlaub Lanka includes Sigiriya in our 3-Day, 5-Day, and 7-Day tours, as well as private day excursions.";
    }
    if (q.includes('ella') || q.includes('bridge') || q.includes('train')) {
      return "Ella is Sri Lanka's mountain paradise! Must-see highlights include the world-famous Nine Arch Bridge in Demodara, Little Adam's Peak, Ravana Falls, and the iconic scenic hill-country train ride. You can explore Ella on our 5-Day and 7-Day tour packages.";
    }
    if (q.includes('beach') || q.includes('mirissa') || q.includes('bentota') || q.includes('arugam')) {
      return "Sri Lanka has golden beaches all year round! For whale watching and surfing, Mirissa and Weligama are magnificent. Bentota offers luxury beach relaxation and water sports. Arugam Bay is a world-class surf haven on the east coast, while Trincomalee offers crystal-clear calm waters.";
    }
    if (q.includes('elephant') || q.includes('safari') || q.includes('yala') || q.includes('udawalawe')) {
      return "Yes! Sri Lanka is one of Asia's finest wildlife safari destinations. Yala National Park is famous for having one of the highest densities of wild leopards in the world, while Udawalawe National Park guarantees breathtaking sightings of wild elephant herds.";
    }
    if (q.includes('7-day') || q.includes('7 day') || q.includes('plan') || q.includes('itinerary')) {
      return "For a 7 Nights / 8 Days journey, we recommend our 'Ultimate Sri Lanka Island Adventure': Negombo → Sigiriya & Dambulla → Kandy → Nuwara Eliya → Ella → Yala Safari → Galle Fort. Would you like us to customize this itinerary for you? You can click below to customize or chat directly with Nirosh on WhatsApp (+94 777 978 768)!";
    }
    if (q.includes('honeymoon')) {
      return "Sri Lanka is an extraordinary honeymoon destination! We craft romantic journeys combining luxury tea estate bungalows in Nuwara Eliya, private scenic train journeys through Ella, wildlife safari tents, and secluded golden beaches in Mirissa and Bentota.";
    }
    if (q.includes('book') || q.includes('price') || q.includes('cost') || q.includes('contact')) {
      return "Traumurlaub Lanka creates personalized tours tailored to your travel dates, party size, and preferences. For an exact quote and customized planning, contact our founder Nirosh directly on WhatsApp at +94 777 978 768 or submit an inquiry on our Contact page!";
    }

    return "Hello! I am Traumurlaub AI. I can guide you through Sri Lanka's top destinations such as Sigiriya, Kandy, Ella, Yala, Galle, and Mirissa, as well as help plan your custom tour. How many days are you planning to stay in Sri Lanka, or which experiences are you most excited about?";
  }
}
