document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const wsUrl = `ws://127.0.0.1:8003/ws/user_notifications/?token=${token}`;
    let messageHistory = [];

    const socket = new WebSocket(wsUrl);

    socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        messageHistory.push(message);
        renderNotifications();
        alert(`New message: ${message.data}`);
    };

    socket.onopen = function() {
        console.log("WebSocket connection is active");
    };

    socket.onclose = function() {
        console.log("WebSocket connection is not active");
    };

    async function handleSendFriendRequest() {
        const friendID = document.getElementById('friendID').value;
        console.log("Friend ID:", friendID);
        console.log("User ID:", user_id);
        try {
            const response = await fetch("http://localhost:8002/user/addfriend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_1: user_id,
                    user_2: friendID,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Friend Request Sent:", data);
            } else {
                const errorData = await response.json();
                console.error("Error in server response:", errorData);
            }
        } catch (error) {
            console.error("Error in request:", error);
        }
    }

    async function handleDeleteFriendRequest() {
        const friendID = document.getElementById('friendID').value;
        console.log("Friend ID:", friendID);
        console.log("User ID:", user_id);
        try {
            const response = await fetch("http://localhost:8002/user/addfriend", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_1: user_id,
                    user_2: friendID,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Friend Request Deleted:", data);
            } else {
                const errorData = await response.json();
                console.error("Error in server response:", errorData);
            }
        } catch (error) {
            console.error("Error in request:", error);
        }
    }

	async function getFriends() {
		const token = localStorage.getItem("token");
		console.log("/----getFirends notification.js----\\");
		try {
			const response = await fetch(
				`http://127.0.0.1:8003/user/friend?user_id=${user_id}`,
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
				console.log("getFriends data:", data);
			} else {
				console.error("Errore nella risposta del server:", response.statusText);
			}
		} catch (error) {
			console.error("Errore nella richiesta:", error);
		}
		console.log("\____getFirends notification.js____/");
	}

    function renderNotifications() {
        const notificationContent = document.getElementById('notificationContent');
        notificationContent.innerHTML = messageHistory.map((message, index) => `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="card-text">${message.data}</p>
                </div>
            </div>
        `).join('');
    }

    function renderNotification() {
        const notificationContainer = document.getElementById('notificationContainer');
        notificationContainer.innerHTML = `
            <div class="notification-box">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Notifications</h5>
                </div>
                <div id="notificationContent" class="d-flex flex-column gap-3"></div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="friendID" placeholder="User ID">
                    <button class="btn btn-outline-primary" type="button" onclick="handleSendFriendRequest()">Send Friend Request</button>
                    <button class="btn btn-outline-secondary" type="button" onclick="handleDeleteFriendRequest()">Delete Friend Request</button>
					<button class="btn btn-outline-secondary" type="button" onclick="getFriends()">Get Friends</button>
                </div>
            </div>
        `;

        renderNotifications();
    }

    window.renderNotification = renderNotification;
    window.handleSendFriendRequest = handleSendFriendRequest;
    window.handleDeleteFriendRequest = handleDeleteFriendRequest;
	window.getFriends = getFriends;
});