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
                        <div class="expandable-sidebar">Sidebar</div>
                    </div>
                    <div class="content">
                        <div class="profile" id="profile">Profile</div>
                        <div class="task-container">Task Available</div>
                        <div class="task-container">Task Active</div>
                        <div class="task-container">Notification</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('toggleProfileButton').addEventListener('click', function() {
            const profileDiv = document.getElementById('profile');
            profileDiv.style.display = profileDiv.style.display === 'none' ? 'block' : 'none';
        });
    }

    window.renderHome = renderHome;
});