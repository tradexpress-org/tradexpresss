// ==========================================
// INTERACTIVE OPEN CHAT WIDGET LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const chatTrigger = document.getElementById('chat-trigger');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatTrigger || !chatWindow || !chatInput || !sendChatBtn || !chatMessages) return;

    // Toggle Chat Window Visibility
    chatTrigger.addEventListener('click', () => {
        const isHidden = chatWindow.style.display === 'none';
        chatWindow.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            chatInput.focus();
            chatTrigger.style.transform = 'scale(0.9)';
        } else {
            chatTrigger.style.transform = 'scale(1)';
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatTrigger.style.transform = 'scale(1)';
    });

    // Send Message Event
    const handleSendMessage = () => {
        const queryText = chatInput.value.trim();
        if (!queryText) return;

        // Render User Message Bubble
        appendMessage(queryText, 'user');
        chatInput.value = '';

        // Trigger Bot Response after brief simulation delay
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const botReply = generateSmartResponse(queryText);
            appendMessage(botReply, 'bot');
        }, 1200);
    };

    sendChatBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Helper to render bubbles
    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        const isUser = sender === 'user';
        
        bubble.style = isUser 
            ? `align-self: flex-end; max-width: 80%; background: #38bdf8; color: #0f172a; padding: 10px 14px; border-radius: 12px 12px 0 12px; font-size: 0.85rem; line-height: 1.4; font-weight: 500;`
            : `align-self: flex-start; max-width: 80%; background: #1e293b; color: #f8fafc; padding: 10px 14px; border-radius: 12px 12px 12px 0; font-size: 0.85rem; line-height: 1.4;`;

        bubble.innerHTML = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Typing Simulation Indicators
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'tx-typing-indicator';
        indicator.style = `align-self: flex-start; background: #1e293b; color: #64748b; padding: 8px 14px; border-radius: 12px 12px 12px 0; font-size: 0.8rem; font-style: italic;`;
        indicator.innerText = 'TX Assistant is typing...';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('tx-typing-indicator');
        if (indicator) indicator.remove();
    }

    // Smart contextual router matching Kenny & Broker Ferddy
    function generateSmartResponse(input) {
        const query = input.toLowerCase();

        if (query.includes('broker') || query.includes('ferddy') || query.includes('sardan') || query.includes('hold')) {
            return `Our chief licensed Customs Broker, <strong>Ferddy Mark Sardan</strong>, can represent you directly before the BOC. Please complete the quick "Need a Broker" form on the dashboard to route your documents to him!`;
        }
        if (query.includes('kenny') || query.includes('who built') || query.includes('creator')) {
            return `This platform is customized and developed by <strong>Kenny</strong> to optimize customs clearances and streamline importer workflows!`;
        }
        if (query.includes('boc') || query.includes('customs') || query.includes('tariff')) {
            return `Under standard Tariff guidelines, clearing items requires proper HS coding. Check out our interactive Resource Center or run a search above to get precise requirements!`;
        }
        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return `Hello! How can Kenny and Broker Ferddy assist you with your logistics operations today?`;
        }
        
        return `Interesting query! I recommend checking our <strong>Customs & Trade Resource Center</strong> on the dashboard, or asking our broker <strong>Ferddy Mark Sardan</strong> directly for legal representation.`;
    }
});