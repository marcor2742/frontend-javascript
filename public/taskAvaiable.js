document.addEventListener('DOMContentLoaded', function() {
    async function joinTasks(task_id, user_id) {
        console.log("Joining task:", task_id, user_id);
        try {
            const response = await fetch(`http://localhost:8002/task/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ task: task_id, user: user_id }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Joined chat:", data);
            } else {
                const errorData = await response.json();
                console.error("Errore nella risposta del server:", errorData);
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
        }
    }

    function renderTask(task) {
        const user_id = localStorage.getItem("user_id");

        const handleJoinTask = (task_id) => {
            joinTasks(task_id, user_id);
        };

        return `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${task.name} ${task.category}</h5>
                    <p class="card-text">${task.description}</p>
                    <div class="d-flex justify-content-between">
                        <div>
                            <h6>Time remaining</h6>
                            <p>${task.duration[0]} days</p>
                        </div>
                        <div>
                            <h6>EXP</h6>
                            <p>${task.exp}</p>
                        </div>
                    </div>
                    <button class="btn btn-outline-primary" onclick="handleJoinTask(${task.id})">Join</button>
                </div>
            </div>
        `;
    }

    async function handleGetTasks() {
        const user_id = localStorage.getItem("user_id");
        try {
            const response = await fetch(`http://localhost:8002/task/task?user_id=${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const taskContainer = document.getElementById('taskAvailableContainer');
                taskContainer.innerHTML = data.map(task => renderTask(task)).join('');
                console.log("AviableTask:", data);
            } else {
                const errorData = await response.json();
                console.error("Errore nella risposta del server:", errorData);
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
        }
    }

    function renderTaskAvaiable() {
        const taskContainer = document.getElementById('taskAvailableContainer');
        taskContainer.innerHTML = `
            <div class="taskbox">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Task Available</h5>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ALL
                        </button>
                        <div class="dropdown-menu" aria-labelledby="categoryDropdown">
                            <a class="dropdown-item" href="#" onclick="filterTasks('ALL')">ALL</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('SP')">SP</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('ED')">ED</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('HE')">HE</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('AR')">AR</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('SS')">SS</a>
                            <a class="dropdown-item" href="#" onclick="filterTasks('MD')">MD</a>
                        </div>
                    </div>
                </div>
                <div id="taskContainer" class="d-flex flex-column gap-3"></div>
            </div>
        `;

        handleGetTasks();
    }

    window.renderTaskAvaiable = renderTaskAvaiable;
});