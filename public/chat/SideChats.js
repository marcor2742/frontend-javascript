document.addEventListener("DOMContentLoaded", function () {
    const fetchChatRooms = async () => {
        const data = await getChatRooms();
        if (data) {
            renderChatRooms(data);
        } else {
            console.log("Dati non ricevuti:", data);
            renderChatRooms([]);
        }
    };

    const renderChatRooms = (chatRooms) => {
        const sideChatContainer = document.querySelector(".sidechat");
        if (sideChatContainer) {
            sideChatContainer.innerHTML = `
                <div class="add-chat">
                    <form>
                        <input type="text" name="room_name" placeholder="Nome del gruppo" />
                        <input type="text" name="room_description" placeholder="Descrizione" />
                        <input type="text" name="user_ids" placeholder="Aggiungi membri con userID" />
                        <button type="submit">Add</button>
                    </form>
                </div>
                <input type="text" placeholder="Cerca chat" class="sidechat-input" />
                ${chatRooms.map(room => `
                    <div class="chat" data-room-id="${room.room_id}">
                        <p>${room.room_name}</p>
                    </div>
                `).join('')}
            `;
        } else {
            console.error("Elemento .sidechat non trovato nel DOM");
        }
    };

    fetchChatRooms();
});