document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    const chatRooms = await getChatRooms();
    const roomID = chatRooms && chatRooms.length > 0 ? chatRooms[0].room_id : "some-room-id"; // Ottieni l'ID della stanza in qualche modo
    const wsUrl = `ws://127.0.0.1:8001/ws/chat/${roomID}/?token=${token}`;
    let chat = [];

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Messaggio ricevuto:", data);
        chat.push(data);
        renderChat();
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };

    socket.onerror = (e) => {
        console.error("WebSocket error:", e);
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8001/chat/chat_rooms/${roomID}/get_message/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": localStorage.getItem("csrftoken"),
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                chat = data;
                renderChat();
                // Aggiungi l'event listener dopo aver caricato i messaggi
                const sendButton = document.querySelector(".chats-input button");
                if (sendButton) {
                    sendButton.addEventListener("click", handleSendMessage);
                }
            } else {
                console.error("Errore nella risposta del server:", response.statusText);
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
        }
    };

    const renderChat = () => {
        const chatContainer = document.querySelector(".scrollable-content");
        if (chatContainer) {
            chatContainer.innerHTML = chat.map(msg => `
                <div class="chat-bubble ${msg.sender === localStorage.getItem("user_username") ? "true" : "false"}">
                    <div class="chat-content">
                        <p>${msg.sender}</p>
                        <p>${msg.message}</p>
                        <p>${new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            console.error("Elemento .scrollable-content non trovato nel DOM");
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const message = document.querySelector(".chats-input input").value;
        if (socket.readyState === WebSocket.OPEN) {
            const messageData = {
                type: "chat_message",
                room_id: roomID,
                message: message,
                timestamp: new Date().toISOString(),
                sender: localStorage.getItem("user_username"),
            };
            socket.send(JSON.stringify(messageData));
            document.querySelector(".chats-input input").value = "";
        } else {
            alert("Connessione WebSocket non attiva");
        }
    };

    fetchMessages();
});