const clearChatBtn = document.getElementById("clear-chat");
const chatList = document.querySelector(".chat-list");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".send-icon");

clearChatBtn.addEventListener("click", () => {
    chatList.innerHTML = "";
});

const showTypingIndicator = () => {
    const typingIndicator = document.createElement("li");
    typingIndicator.classList.add("chat", "incoming", "typing-indicator");
    typingIndicator.innerHTML = `
        <span class="material-symbols-outlined">smart_toy</span>
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
    return `Réponse automatique de Préscilia: ${userMessage}`; // Custom message logic
};

sendChatBtn.addEventListener("click", async () => {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    const respectfulMessage = "Salut, je suis Préscilia, comment puis-je t'aider?"; // Respectful greeting
    const outgoingChat = document.createElement("li");
    outgoingChat.classList.add("chat", "outgoing");
    outgoingChat.innerHTML = `<p>${userMessage}</p>`;
    chatList.appendChild(outgoingChat);
    chatInput.value = "";
    chatList.scrollTop = chatList.scrollHeight;

    // First, send a respectful message before generating a response
    const respectfulChat = document.createElement("li");
    respectfulChat.classList.add("chat", "incoming");
    respectfulChat.innerHTML = `
        <span class="material-symbols-outlined">smart_toy</span>
        <p>${respectfulMessage}</p>`;
    chatList.appendChild(respectfulChat);
    chatList.scrollTop = chatList.scrollHeight;

    // Simulate typing before sending the bot's response
    const typingIndicator = showTypingIndicator();

    const botMessage = await generateResponse(userMessage);

    setTimeout(() => {
        typingIndicator.remove();
        const incomingChat = document.createElement("li");
        incomingChat.classList.add("chat", "incoming");
        incomingChat.innerHTML = `
            <span class="material-symbols-outlined">smart_toy</span>
            <p>${botMessage}</p>`;
        chatList.appendChild(incomingChat);
        chatList.scrollTop = chatList.scrollHeight;
    }, 500);

    // Remove messages after 7 minutes
    setTimeout(() => {
        outgoingChat.remove();
        respectfulChat.remove();
        incomingChat.remove();
    }, 7 * 60 * 1000);
});
