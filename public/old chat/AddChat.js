document.addEventListener('DOMContentLoaded', function() {
    function renderAddChat() {
        const addChatContainer = document.createElement('div');
        addChatContainer.className = 'add-chat';
        addChatContainer.innerHTML = `
            <form id="addChatForm" class="add-chat">
                <input type="text" id="roomName" placeholder="Nome del gruppo" class="form-control mb-2" />
                <input type="text" id="roomDescription" placeholder="Descrizione" class="form-control mb-2" />
                <input type="text" id="userIds" placeholder="Aggiungi membri con userID" class="form-control mb-2" />
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
        `;

        addChatContainer.querySelector('#addChatForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const roomName = document.getElementById('roomName').value;
            const roomDescription = document.getElementById('roomDescription').value;
            const userIds = document.getElementById('userIds').value;
            const creator = localStorage.getItem('user_id');

            let userIdsArray = userIds.split(',').map(id => id.trim()).filter(id => id);
            if (!userIdsArray.includes(creator)) {
                userIdsArray.push(creator);
            }

            try {
                const response = await fetch('http://localhost:8001/chat/chat_rooms/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ room_name: roomName, room_description: roomDescription, creator, users: userIdsArray }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Chat room creata:', data);
                } else {
                    const errorData = await response.json();
                    console.error('Errore nella risposta del server:', errorData);
                }
            } catch (error) {
                console.error('Errore nella richiesta:', error);
            }
        });

        return addChatContainer;
    }

    window.renderAddChat = renderAddChat;
});