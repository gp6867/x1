const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
    userInput.value = "";

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
});
