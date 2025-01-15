document.addEventListener('DOMContentLoaded', function() {
    let currentOpenChat = null; // Variabile per tenere traccia della chat aperta

    async function getChatRooms() {
        const user_id = localStorage.getItem("user_id");
        const token = localStorage.getItem('token');
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
            const addChatContainer = renderAddChat();
            chatContainer.innerHTML = '';
            chatContainer.appendChild(addChatContainer);
        });

        document.getElementById('singleChatButton').addEventListener('click', async function() {
            const chats = await getChatRooms();
            if (chats) {
                chatContainer.innerHTML = '';
                chats.forEach(chat => {
                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-item bg-light p-2 mb-2';
                    chatItem.innerText = chat.room_name;
                    chatItem.addEventListener('click', function() {
                        if (currentOpenChat === chat.room_id) {
                            chatItem.classList.remove('open'); // Rimuovi la classe 'open' se la chat è già aperta
                            currentOpenChat = null;
                            chatContainer.innerHTML = ''; // Chiudi la chat
                        } else {
                            if (currentOpenChat !== null) {
                                document.querySelector(`.chat-item[data-room-id="${currentOpenChat}"]`).classList.remove('open');
                            }
                            chatItem.classList.add('open'); // Aggiungi la classe 'open' alla chat corrente
                            renderChat(chat.room_id, true);
                            currentOpenChat = chat.room_id;
                        }
                    });
                    chatItem.setAttribute('data-room-id', chat.room_id);
                    chatContainer.appendChild(chatItem);
                });
            }
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
                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-item bg-light p-2 mb-2';
                    chatItem.innerText = chat.room_name;
                    chatItem.setAttribute('data-room-id', chat.room_id);
                    chatContainer.appendChild(chatItem);
                });
            }
        });
    }

    window.renderExpandableSidebar = renderExpandableSidebar;
});