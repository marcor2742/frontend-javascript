const getChatRooms = async () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem('token');
    console.log("user_id in sidechat: ", user_id);
    console.log("Token inviato nell'header Authorization:", token);
    console.log(`http://localhost:8001/chat/chat_rooms/getchat/?users=${user_id}`);
    try {
        const response = await fetch(
            `http://localhost:8001/chat/chat_rooms/getchat/?user_id=${user_id}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Risposta dal server:", data);
            localStorage.setItem("chat_rooms", JSON.stringify(data));
            return data;
        } else {
            const errorData = await response.json();
            console.error("Errore nella risposta del server:", errorData);
            return null;
        }
    } catch (error) {
        console.error("Errore nella richiesta:", error);
        return null;
    }
};

window.getChatRooms = getChatRooms;