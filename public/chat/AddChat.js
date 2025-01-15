document.addEventListener("DOMContentLoaded", function () {
    const addChatForm = document.querySelector(".add-chat form");

    if (addChatForm) {
        addChatForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const room_name = document.querySelector("input[name='room_name']").value;
            const room_description = document.querySelector("input[name='room_description']").value;
            const user_ids = document.querySelector("input[name='user_ids']").value.split(',').map(id => id.trim()).filter(id => id);
            const creator = localStorage.getItem('user_id');

            if (!user_ids.includes(creator)) {
                user_ids.push(creator);
            }

            console.log('Utenti:', user_ids);

            try {
                const response = await fetch('http://localhost:8001/chat/chat_rooms/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ room_name, room_description, creator, users: user_ids }),
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
    } else {
        console.error("Elemento .add-chat form non trovato nel DOM");
    }
});