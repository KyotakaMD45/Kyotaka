// Page d'accueil : animation des étoiles
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = 300;

let stars = [];

for (let i = 0; i < 30; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
    });
}

function drawStar(star) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.closePath();
}

function updateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0 || star.x > canvas.width) star.speedX *= -1;
        if (star.y < 0 || star.y > canvas.height) star.speedY *= -1;

        drawStar(star);
    });
    requestAnimationFrame(updateStars);
}

updateStars();

// Lancer le chatbot
const startBotBtn = document.getElementById("start-bot");
startBotBtn.addEventListener("click", () => {
    window.location.href = "bot.html"; // Redirige vers la page du chatbot
});

// ----------------------------------------

// Variables pour le chatbot
const clearChatBtn = document.getElementById("clear-chat");
const chatList = document.querySelector(".chat-list");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".send-icon");

const API_KEY = "AIzaSyAlgCGWEJVof5--FLwewqEkTAsEKSjJDh8"; // Remplace par ta clé API
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Fonction pour nettoyer le chat après 7 minutes
const clearChatAfterTime = () => {
    setTimeout(() => {
        chatList.innerHTML = "";
    }, 420000); // 7 minutes = 420000ms
};

clearChatAfterTime();

// Fonction pour afficher l'indicateur de saisie
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

// Fonction pour générer la réponse du bot
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

// Envoi du message au bot
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
        incomingChat.innerHTML = `<p>${botMessage}</p>`;
        chatList.appendChild(incomingChat);
        chatList.scrollTop = chatList.scrollHeight;
    }, 1000);  // Retard pour simuler la réponse
});

// Fonction pour supprimer le chat
clearChatBtn.addEventListener("click", () => {
    chatList.innerHTML = "";
});
