document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem('token');
    let chats = [];
    let isSidebarOpen = false;
    let areChatItemsVisible = true;
    let activeButton = null;

    const handleChatTypeClick = (type) => {
        const firstChatOfType = chats.find((chat) => chat.type === type);
        if (firstChatOfType && chatRefs[firstChatOfType.id]) {
            chatRefs[firstChatOfType.id].scrollIntoView({
                behavior: "smooth",
            });
        }
        activeButton = type;
    };

    const handleCloseSidebar = () => {
        areChatItemsVisible = false;
        setTimeout(() => {
            isSidebarOpen = false;
        }, 350);
    };

    const handleOpenSidebar = () => {
        isSidebarOpen = true;
        areChatItemsVisible = true;
    };

    const handleAddSidebar = () => {
        handleCloseSidebar();
    };

    const handleSendMessage = (chatId) => {
        if (newMessage.trim() !== "") {
            console.log(`Sending message to chat ${chatId}: ${newMessage}`);
            newMessage = "";
        }
    };

    const fetchChats = async () => {
        const serverChats = await getChatRooms();
        const addGroupChat = [{
            id: "0",
            name: "Crea",
            lastMessage: "Hey, crea?",
            type: "crea",
        }];

        const mockChats = [
            {
                id: "5",
                name: "Eve",
                lastMessage: "Thanks for your help!",
                type: "single",
            },
            {
                id: "6",
                name: "Project Team",
                lastMessage: "Meeting at 3 PM",
                type: "group",
            },
            // ... altre chat di esempio ...
        ];

        if (serverChats) {
            const serverChatsFormatted = serverChats.map(chat => ({
                id: chat.room_id.toString(),
                name: chat.room_name,
                lastMessage: chat.room_description,
                type: "group",
            }));
            chats = [...addGroupChat, ...serverChatsFormatted, ...mockChats];
        } else {
            chats = [...addGroupChat, ...mockChats];
        }

        renderExpandableSidebar();
    };

    const renderExpandableSidebar = () => {
        // Codice per renderizzare la sidebar espandibile
        document.querySelector(".sidebar-button.open").addEventListener("click", handleOpenSidebar);
        document.querySelector(".sidebar-button.close").addEventListener("click", handleCloseSidebar);
        document.querySelector(".sidebar-button.create").addEventListener("click", () => handleChatTypeClick("crea"));
        document.querySelector(".sidebar-button.single").addEventListener("click", () => handleChatTypeClick("single"));
        document.querySelector(".sidebar-button.group").addEventListener("click", () => handleChatTypeClick("group"));
        document.querySelector(".sidebar-button.random").addEventListener("click", () => handleChatTypeClick("random"));
    };

    fetchChats();

    window.renderExpandableSidebar = renderExpandableSidebar;
});