document.addEventListener('DOMContentLoaded', function() {
    function navigateTo(path) {
        window.history.pushState({}, path, window.location.origin + path);
        handleRoute();
    }

    async function handleRoute() {
        const routes = {
            '/': () => navigateTo('/login'),
            '/login': async () => {
                await import('./login.js').then(module => {
                    module.renderLogin();
                });
            },
            '/register': async () => {
                await import('./register.js').then(module => {
                    module.renderRegister();
                });
            },
            '/home': async () => {
                await import('./home.js').then(module => {
                    module.renderHome();
                });
            },
            '/mine': () => window.location.href = 'https://minesweeper.online/it/'
        };

        const path = window.location.pathname;
        const route = routes[path] || routes['/login'];
        route();
    }

    document.querySelector('.App').innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Navbar</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item"><a class="nav-link" href="/login" data-link>Login</a></li>
                    <li class="nav-item"><a class="nav-link" href="/register" data-link>Register</a></li>
                    <li class="nav-item"><a class="nav-link" href="/home" data-link>Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/mine" data-link>Mine</a></li>
                </ul>
            </div>
        </nav>
        <div class="content"></div>
    `;

    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navigateTo(event.target.getAttribute('href'));
        });
    });

    window.onpopstate = handleRoute;
    handleRoute();

    window.navigateTo = navigateTo;
});