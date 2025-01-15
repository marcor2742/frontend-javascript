document.addEventListener('DOMContentLoaded', function() {
    function renderChat(roomID, isSingleChat) {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.innerHTML = `
            <div class="scrollable-content"></div>
            <form class="chats-input">
                <input type="text" placeholder="Type a message" />
                <button type="submit">
                    <i class="bi bi-send"></i>
                </button>
            </form>
        `;

        const scrollableContent = chatContainer.querySelector('.scrollable-content');
        const chatsInput = chatContainer.querySelector('.chats-input');
        const inputField = chatsInput.querySelector('input');
        const sendButton = chatsInput.querySelector('button');

        let chat = [];

        async function fetchMessages() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://127.0.0.1:8001/chat/chat_rooms/${roomID}/get_message/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    chat = data;
                    renderMessages();
                } else {
                    console.error("Errore nella risposta del server:", response.statusText);
                }
            } catch (error) {
                console.error("Errore nella richiesta:", error);
            }
        }

        function renderMessages() {
            scrollableContent.innerHTML = '';
            chat.forEach(msg => {
                const msgDate = new Date(msg.timestamp).toLocaleDateString();
                const msgTime = new Date(msg.timestamp).toLocaleTimeString();
                const chatBubble = document.createElement('div');
                chatBubble.className = `chat-bubble ${msg.sender === localStorage.getItem("user_username") ? "true" : "false"}`;
                chatBubble.innerHTML = `
                    <div class="chat-content ${msg.sender === localStorage.getItem("user_username") ? "true" : ""}">
                        ${!isSingleChat && msg.sender !== localStorage.getItem("user_username") ? `<div class="username">${msg.sender}</div>` : ''}
                        <div class="message">${msg.message}</div>
                        <div class="date ${msg.sender === localStorage.getItem("user_username") ? "true" : "false"}">${msgTime}</div>
                    </div>
                `;
                scrollableContent.appendChild(chatBubble);
            });
        }

        chatsInput.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = inputField.value;
            if (message.trim() !== "") {
                const messageData = {
                    type: "chat_message",
                    room_id: roomID,
                    message: message,
                    timestamp: new Date().toISOString(),
                    sender: localStorage.getItem("user_username"),
                };
                chat.push(messageData);
                renderMessages();
                inputField.value = '';
            }
        });

        fetchMessages();
    }

    window.renderChat = renderChat;
});