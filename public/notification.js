import { setVariables, getVariables } from './var.js';

let messageHistory = [];

async function handleFriendRequest(str_method, user_id, friend_id) {
    console.log(`/----handleFriendRequest ${str_method} notification.js----\\`);
    console.log("User ID:", user_id);
    console.log("Friend ID:", friend_id);
    try {
        const response = await fetch("http://localhost:8002/user/addfriend", {
            method: str_method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_1: user_id,
                user_2: friend_id,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Friend Request Sent:", data);
            renderNotification();
        } else {
            const errorData = await response.json();
            console.error("Error in server response:", errorData);
        }
    } catch (error) {
        console.error("Error in request:", error);
    }
}

async function getFriends() {
    const { token, userId } = getVariables();
    console.log("/----getFirends notification.js----\\");
	console.log("User ID:", userId);
	console.log("Token:", token);
    try {
        const response = await fetch(
            `http://127.0.0.1:8002/user/friend?user_id=${userId}&accepted=true`,
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
            renderFriendsList(data);
        } else {
            console.error("Errore nella risposta del server:", response.statusText);
        }
    } catch (error) {
        console.error("Errore nella richiesta:", error);
    }
    console.log("\\____getFirends notification.js____/");
}

function renderFriendsList(friends) {
    const { userId } = getVariables();
    const friendsList = document.getElementById('friendsList');
    const numericUserId = Number(userId);
    friendsList.innerHTML = friends.map(friend => {
        const friendId = (friend.user_1 === numericUserId) ? friend.user_2 : friend.user_1;
        return `
            <div class="friend-item">
                <p>Friend ID: ${friendId}</p>
                <button class="btn btn-outline-danger btn-square" type="button" onclick="handleFriendRequest('DELETE', '${userId}', ${friendId})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function renderFriendRequest() {
    const { userId } = getVariables();
    const notificationContent = document.getElementById('notificationContent');
    notificationContent.innerHTML = messageHistory.map((message, index) => {
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="card-text">User ID: ${message.user_id}</p>
                    <button class="btn btn-outline-primary" type="button" onclick="handleFriendRequest('PATCH', ${Number(message.message)}, '${userId}')">Accept</button>
                    <button class="btn btn-outline-secondary" type="button" onclick="handleFriendRequest('DELETE', '${userId}', ${Number(message.message)})">Decline</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderNotification() {
    const { userId } = getVariables();
    const notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.innerHTML = `
        <div class="notification-box">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Notifications</h5>
            </div>
            <div id="friendsList" class="mb-3"></div>
            <div id="notificationContent" class="d-flex flex-column gap-3"></div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="friendID" placeholder="User ID">
                <button class="btn btn-outline-primary" type="button" onclick="handleFriendRequest('POST', '${userId}', Number(document.getElementById('friendID').value))">Send Friend Request</button>
                <button class="btn btn-outline-secondary" type="button" onclick="handleFriendRequest('DELETE', '${userId}', Number(document.getElementById('friendID').value))">Delete Friend Request</button>
            </div>
        </div>
    `;

    renderFriendRequest();
    getFriends();
}

document.addEventListener('DOMContentLoaded', function() {
    const { token } = getVariables();
    const wsUrl = `ws://127.0.0.1:8003/ws/user_notifications/?token=${token}`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        console.log("/----websocket notification.js----\\");
        console.log("Nuovo messaggio:", message);

        const messageId = message.id;
        const sender = message.Sender;
        const sender_id = Number(message.message);
        const isSent = message.is_sent;
        const userId = message.user_id;
        console.log("Message ID:", messageId);
        console.log("Sender:", sender);
        console.log("sender_id:", sender_id);
        console.log("Is Sent:", isSent);
        console.log("User ID:", userId);

        messageHistory.push(message);
        renderFriendRequest();

        console.log("\\____websocket notification.js____/");
    };

    socket.onopen = function() {
        console.log("WebSocket connection is active");
    };

    socket.onclose = function() {
        console.log("token:", token);
        console.log("WebSocket connection is not active");
    };

    window.renderNotification = renderNotification;
    window.handleFriendRequest = handleFriendRequest;
    window.getFriends = getFriends;
});

export { renderNotification, handleFriendRequest, getFriends };