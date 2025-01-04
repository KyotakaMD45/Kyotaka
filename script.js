const clearChatBtn = document.getElementById("clear-chat");
const chatList = document.querySelector(".chat-list");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".send-icon");

const API_KEY = "AIzaSyAlgCGWEJVof5--FLwewqEkTAsEKSjJDh8"; // Remplace par ta clé API
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

clearChatBtn.addEventListener("click", () => {
    chatList.innerHTML = "";
});

const showTypingIndicator = () => {
    const typingIndicator = document.createElement("li");
    typingIndicator.classList.add("chat", "incoming", "typing-indicator");
    typingIndicator.innerHTML = `
        <div class="typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>`;
    chatList.appendChild(typingIndicator);
    chatList.scrollTop = chatList.scrollHeight;
    return typingIndicator;
};

const generateResponse = async (userMessage) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: { text: userMessage },
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        return data.candidates[0].output;
    } catch (error) {
        return `Error: ${error.message}`;
    }
};

sendChatBtn.addEventListener("click", async () => {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    // Envoi du message de l'utilisateur
    const outgoingChat = document.createElement("li");
    outgoingChat.classList.add("chat", "outgoing");
    outgoingChat.innerHTML = `<p>${userMessage}</p>`;
    chatList.appendChild(outgoingChat);
    chatInput.value = "";
    chatList.scrollTop = chatList.scrollHeight;

    // Affichage de l'indicateur de saisie
    const typingIndicator = showTypingIndicator();

    // Génération de la réponse du bot
    const botMessage = await generateResponse(userMessage);

    // Affichage de la réponse du bot après un délai
    setTimeout(() => {
        typingIndicator.remove();
        const incomingChat = document.createElement("li");
        incomingChat.classList.add("chat", "incoming");
        incomingChat.innerHTML = `
            <span class="material-symbols-outlined">smart_toy</span>
            <p>${botMessage}</p>`;
        chatList.appendChild(incomingChat);
        chatList.scrollTop = chatList.scrollHeight;
    }, 1000);
});
