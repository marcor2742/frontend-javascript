document.addEventListener('DOMContentLoaded', function() {
    async function handleCompleteTask(task_id, task_rate) {
        const user_id = localStorage.getItem("user_id");
        try {
            const response = await fetch(
                `http://localhost:8002/task/progress/${task_id}&${user_id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"),
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ rate: task_rate }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("CompletedTask:", data);
                handleGetActiveTasks();
            } else {
                const errorData = await response.json();
                console.error("Errore CompletedTask:", errorData);
            }
        } catch (error) {
            console.error("Errore CompletedTask:", error);
        }
    }

    function renderTask(task) {
        return `
            <div class="card mb-3" id="task-${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.task.name} ${task.task.category}</h5>
                    <div class="d-flex justify-content-between">
                        <div>
                            <h6>Time remaining</h6>
                            <p>${task.task.duration.split(' ')[0]} days</p>
                        </div>
                        <div>
                            <h6>EXP</h6>
                            <p>${task.task.exp}</p>
                        </div>
                        <div>
                            <h6>Progress</h6>
                            <p>${task.rate}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-secondary" onclick="handleCancelTask(${task.id})">Cancella</button>
                        <button class="btn btn-primary" onclick="handleCompleteTask(${task.task.id}, 100)">Completa</button>
                    </div>
                </div>
            </div>
        `;
    }

    async function handleGetActiveTasks() {
        const user_id = localStorage.getItem("user_id");
        try {
            const response = await fetch(
                `http://localhost:8002/task/progress?user_id=${user_id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"),
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const taskContainer = document.getElementById('taskActiveContent');
                taskContainer.innerHTML = data.map(task => renderTask(task)).join('');
                console.log("ActiveTask:", data);
            } else {
                const errorData = await response.json();
                console.error("Errore ActiveTask:", errorData);
            }
        } catch (error) {
            console.error("Errore ActiveTask:", error);
        }
    }

    function renderTaskActive() {
        const taskContainer = document.getElementById('taskActiveContainer');
        taskContainer.innerHTML = `
            <div class="taskbox">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Task Active</h5>
                </div>
                <div id="taskActiveContent" class="d-flex flex-column gap-3"></div>
            </div>
        `;

        handleGetActiveTasks();
    }

    window.renderTaskActive = renderTaskActive;
    window.handleCompleteTask = handleCompleteTask;
});