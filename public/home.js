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
                    <div class="expandable-sidebar-container"></div>
                    <div class="content">
                        <div class="profile" id="profile" style="display: none;"></div>
                        <div class="task-container">Task Available</div>
                        <div class="task-container">Task Active</div>
                        <div class="task-container">Notification</div>
                    </div>
                </div>
            </div>
        `;

        const profileDiv = document.getElementById('profile');
        const toggleProfileButton = document.getElementById('toggleProfileButton');

        toggleProfileButton.addEventListener('click', function() {
            const isProfileVisible = profileDiv.style.display === 'block';
            profileDiv.style.display = isProfileVisible ? 'none' : 'block';
            if (!isProfileVisible) {
                renderProfile();
            }
        });

        // Check if profile should be visible on page load
        if (profileDiv.style.display === 'block') {
            renderProfile();
        }

        renderExpandableSidebar();
    }

    window.renderHome = renderHome;
});