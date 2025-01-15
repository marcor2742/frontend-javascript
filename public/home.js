document.addEventListener('DOMContentLoaded', function() {
    function renderHome() {
        const appDiv = document.querySelector('.App');
        appDiv.innerHTML = `
            <div class="home">
                <div class="navbar">
                    <img src="logo.png" alt="logo" class="logo-image" />
                    <button class="propic-button" id="toggleProfileButton">
                        <img src="propic.jpeg" alt="propic" class="propic-image" />
                    </button>
                </div>
                <div class="undernavbar">
                    <div class="expandable-sidebar-container">
                        <div class="expandable-sidebar">
                            <nav class="sidebar-nav">
                                <button class="sidebar-button open">
                                    <i class="bi bi-chevron-right icon"></i>
                                    <span class="button-label">Open</span>
                                </button>
                                <button class="sidebar-button close">
                                    <i class="bi bi-chevron-left icon"></i>
                                    <span class="button-label">Close</span>
                                </button>
                                <button class="sidebar-button create">
                                    <i class="bi bi-plus icon"></i>
                                    <span class="button-label">Create</span>
                                </button>
                                <button class="sidebar-button single">
                                    <i class="bi bi-chat icon"></i>
                                    <span class="button-label">Single</span>
                                </button>
                                <button class="sidebar-button group">
                                    <i class="bi bi-people icon"></i>
                                    <span class="button-label">Group</span>
                                </button>
                                <button class="sidebar-button random">
                                    <i class="bi bi-shuffle icon"></i>
                                    <span class="button-label">Random</span>
                                </button>
                            </nav>
                            <div class="chat-list"></div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="profile" id="profile">Profile</div>
                        <div class="task-container">Task Available</div>
                        <div class="task-container">Task Active</div>
                        <div class="task-container">Notification</div>
                    </div>
                </div>
                <div class="add-chat">
                    <form>
                        <input type="text" name="room_name" placeholder="Nome del gruppo" />
                        <input type="text" name="room_description" placeholder="Descrizione" />
                        <input type="text" name="user_ids" placeholder="Aggiungi membri con userID" />
                        <button type="submit">Add</button>
                    </form>
                </div>
                <div class="scrollable-content"></div>
            </div>
        `;

        document.getElementById('toggleProfileButton').addEventListener('click', function() {
            const profileDiv = document.getElementById('profile');
            profileDiv.style.display = profileDiv.style.display === 'none' ? 'block' : 'none';
        });

        if (typeof renderExpandableSidebar === 'function') {
            renderExpandableSidebar();
        }

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
    }

    window.renderHome = renderHome;
});