const clearChatBtn = document.getElementById("clear-chat");
const chatList = document.querySelector(".chat-list");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".send-icon");

const API_KEY = "AIzaSyAlgCGWEJVof5--FLwewqEkTAsEKSjJDh8"; // Your API Key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

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
}

const generateResponse = async (userMessage) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            contents: [{ 
                role: "user", 
                parts: [{ text: userMessage }] 
            }] 
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

sendChatBtn.addEventListener("click", async () => {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    const outgoingChat = document.createElement("li");
    outgoingChat.classList.add("chat", "outgoing");
    outgoingChat.innerHTML = `<p>${userMessage}</p>`;
    chatList.appendChild(outgoingChat);
    chatInput.value = "";
    chatList.scrollTop = chatList.scrollHeight;

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
    }, 1000);  
});
