function renderMessage(message) {
    const isPersonalMessage = message.personal_message === true;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${isPersonalMessage ? "personal" : ""}`;
    messageElement.innerHTML = `
        ${!isPersonalMessage ? `<div class="propic"></div>` : ''}
        <div class="message-content">
            <p>${message.sender_name}</p>
            <p>${message.text}</p>
        </div>
    `;

    return messageElement;
}

window.renderMessage = renderMessage;