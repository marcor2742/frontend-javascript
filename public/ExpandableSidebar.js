document.addEventListener('DOMContentLoaded', function() {
    async function getChatRooms() {
        const user_id = localStorage.getItem("user_id");
        const token = localStorage.getItem('token');
        console.log("/-----ExpandableSidebar.js-----\\");
        console.log("user_id in sidechat: ", user_id);
        console.log("Token getChatRooms:", token);
        console.log(`http://localhost:8001/chat/chat_rooms/getchat/?users=${user_id}`);
        console.log("\\_____ExpandableSidebar.js_____/");
        try {
            const response = await fetch(
                `http://localhost:8001/chat/chat_rooms/getchat/?user_id=${user_id}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Risposta dal server:", data);
                localStorage.setItem("chat_rooms", JSON.stringify(data));
                return data;
            } else {
                const errorData = await response.json();
                console.error("Errore nella risposta del server:", errorData);
                return null;
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
            return null;
        }
    }
    
    function renderExpandableSidebar() {
        const sidebarContainer = document.querySelector('.expandable-sidebar-container');
        sidebarContainer.innerHTML = `
            <div class="sidebar">
                <button id="toggleChatButton" class="btn btn-light mb-2">
                    <i class="bi bi-chevron-right"></i>
                </button>
                <button id="createChatButton" class="btn btn-light mb-2">
                    <i class="bi bi-plus"></i>
                </button>
                <button id="singleChatButton" class="btn btn-light mb-2">
                    <i class="bi bi-chat-dots"></i>
                </button>
                <button id="groupChatButton" class="btn btn-light mb-2">
                    <i class="bi bi-people"></i>
                </button>
                <button id="randomChatButton" class="btn btn-light mb-2">
                    <i class="bi bi-shuffle"></i>
                </button>
            </div>
            <div id="chatContainer" class="chat-container"></div>
        `;

        const toggleChatButton = document.getElementById('toggleChatButton');
        const chatContainer = document.getElementById('chatContainer');
        let addChatContainer = null;

        toggleChatButton.addEventListener('click', function() {
            const isOpen = chatContainer.classList.contains('open');
            chatContainer.classList.toggle('open', !isOpen);
            toggleChatButton.innerHTML = isOpen ? `
                <i class="bi bi-chevron-right"></i>
            ` : `
                <i class="bi bi-chevron-left"></i>
            `;
        });

        document.getElementById('createChatButton').addEventListener('click', function() {
            if (addChatContainer) {
                chatContainer.removeChild(addChatContainer);
                addChatContainer = null;
            } else {
                addChatContainer = renderAddChat();
                chatContainer.insertBefore(addChatContainer, chatContainer.firstChild);
            }
        });

        document.getElementById('singleChatButton').addEventListener('click', function() {
            renderChatItem({
                id: '5',
                name: 'Eve',
                lastMessage: 'Thanks for your help!',
                type: 'single'
            });
        });

        document.getElementById('groupChatButton').addEventListener('click', function() {
            alert('Group Chat clicked');
        });

        document.getElementById('randomChatButton').addEventListener('click', function() {
            alert('Random Chat clicked');
        });

        // Fetch chat rooms and render them
        getChatRooms().then(chats => {
            if (chats) {
                chats.forEach(chat => {
                    if (!chat.room_id) {
                        console.error("Chat ID non trovato:", chat);
                        return;
                    }

                    renderChatItem({
                        id: chat.room_id,
                        name: chat.room_name,
                        lastMessage: chat.last_message,
                        type: chat.type
                    });
                });
            }
        });
    }

    window.renderExpandableSidebar = renderExpandableSidebar;
});

function renderChatItem(chat) {
    const chatContainer = document.querySelector('.chat-container');
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.id = chat.id; // Aggiungi l'attributo data-id

    chatItem.innerHTML = `
        <div class="chat-item-header">
            <div class="chat-item-header-content">
                <div class="avatar">
                    <div class="avatar-placeholder"></div>
                </div>
                <div class="chat-item-info">
                    <div class="chat-item-name">${chat.name}</div>
                    <div class="chat-item-message">${chat.lastMessage}</div>
                </div>
                <div class="chat-item-icon">
                    <i class="bi bi-chevron-down"></i>
                </div>
            </div>
        </div>
        <div class="chat-item-content" style="display: none;">
            <div class="scrollable-content"></div>
            <form class="chats-input">
                <input type="text" placeholder="Type a message" />
                <button type="submit">
                    <i class="bi bi-send"></i>
                </button>
            </form>
        </div>
    `;

    chatContainer.insertBefore(chatItem, chatContainer.firstChild);

    const chatItemHeader = chatItem.querySelector('.chat-item-header');
    const chatItemContent = chatItem.querySelector('.chat-item-content');
    const chatItemIcon = chatItem.querySelector('.chat-item-icon i');

    let socket = null;

    chatItemHeader.addEventListener('click', async function() {
        const isOpen = chatItemContent.style.display === 'block';
        chatItemContent.style.display = isOpen ? 'none' : 'block';
        chatItemIcon.className = isOpen ? 'bi bi-chevron-down' : 'bi bi-chevron-up';

        if (!isOpen) {
            // Apri il WebSocket per la chat room
            const token = localStorage.getItem("token");
            socket = new WebSocket(`ws://127.0.0.1:8001/ws/chat/${chat.id}/?token=${token}`);

            socket.onopen = () => {
                console.log(`WebSocket connection opened for chat room ${chat.id}`);
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(`Messaggio ricevuto per chat room ${chat.id}:`, data);
                // Aggiungi il messaggio alla chat room corrispondente
                const chatBubble = renderChatBubble({
                    sender: data.sender,
                    date: new Date(data.timestamp).toLocaleTimeString(),
                    message: data.message,
                    isSingleChat: chat.type === 'single'
                });
                chatItem.querySelector('.scrollable-content').appendChild(chatBubble);
            };

            socket.onclose = () => {
                console.log(`WebSocket connection closed for chat room ${chat.id}`);
                // Cancella i messaggi quando il WebSocket viene chiuso
                chatItem.querySelector('.scrollable-content').innerHTML = '';
            };

            socket.onerror = (error) => {
                console.error(`WebSocket error for chat room ${chat.id}:`, error);
            };

            // Fetch old messages
            try {
                const response = await fetch(
                    `http://127.0.0.1:8001/chat/chat_rooms/${chat.id}/get_message/`,
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
                    data.forEach(msg => {
                        const chatBubble = renderChatBubble({
                            sender: msg.sender,
                            date: new Date(msg.timestamp).toLocaleTimeString(),
                            message: msg.message,
                            isSingleChat: chat.type === 'single'
                        });
                        chatItem.querySelector('.scrollable-content').appendChild(chatBubble);
                    });
                } else {
                    console.error("Errore nella risposta del server:", response.statusText);
                }
            } catch (error) {
                console.error("Errore nella richiesta:", error);
            }
        } else {
            // Chiudi il WebSocket quando la chat viene chiusa
            if (socket) {
                socket.close();
                socket = null;
            }
        }
    });

    const chatsInput = chatItem.querySelector('.chats-input');
    const inputField = chatsInput.querySelector('input');
    const sendButton = chatsInput.querySelector('button');

    chatsInput.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = inputField.value;
        if (message.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
            const messageData = {
                type: "chat_message",
                room_id: chat.id,
                message: message,
                timestamp: new Date().toISOString(),
                sender: localStorage.getItem("user_username"),
            };
            socket.send(JSON.stringify(messageData));
            inputField.value = '';
        } else {
            alert("Connessione WebSocket non attiva");
        }
    });
}

function renderChatBubble({ sender, date, message, isSingleChat }) {
    const user_name = localStorage.getItem("user_username");
    const isSenderMe = user_name === sender;

    const chatBubble = document.createElement('div');
    chatBubble.className = `chat-bubble ${isSenderMe ? "true" : "false"}`;
    chatBubble.innerHTML = `
        ${!isSingleChat && !isSenderMe ? `
            <div class="avatar">
                <div class="avatar-placeholder"></div>
                <div class="date under">${date}</div>
            </div>
        ` : ''}
        <div class="chat-content ${isSenderMe ? "true" : ""}">
            ${!isSingleChat && !isSenderMe ? `<div class="username">${sender}</div>` : ''}
            <div class="message">${message}</div>
            ${isSingleChat || isSenderMe ? `<div class="date ${isSenderMe ? "true" : "false"}">${date}</div>` : ''}
        </div>
    `;

    return chatBubble;
}