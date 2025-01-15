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

window.renderChatBubble = renderChatBubble;