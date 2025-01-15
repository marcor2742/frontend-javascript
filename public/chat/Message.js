document.addEventListener("DOMContentLoaded", function () {
    const renderMessage = (message) => {
        const isPersonalMessage = message.personal_message === true;
        return `
            <div class="message ${isPersonalMessage ? "personal" : ""}">
                ${!isPersonalMessage ? '<div class="propic"></div>' : ''}
                <div class="message-content">
                    <p>${message.sender_name}</p>
                    <p>${message.text}</p>
                </div>
            </div>
        `;
    };

    window.renderMessage = renderMessage;
});