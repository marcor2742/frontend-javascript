function renderLogin() {
    const appDiv = document.querySelector('.App');

    // Aggiungi dinamicamente il file CSS per la pagina di login
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'login.css';
    document.head.appendChild(link);

    appDiv.innerHTML = `
        <div class="login">
            <div class="login_box">
                <h1>Login</h1>
                <div class="login_form">
                    <form class="login_form" id="loginForm">
                        <input type="email" id="email" placeholder="Email" class="form-control" required />
                        <input type="password" id="password" placeholder="Password" class="form-control" required />
                        <div class="empty"></div>
                        <button type="submit" class="btn btn-primary" style="height: 40px; width: 100%;">Login</button>
                        <button type="button" id="registerButton" class="btn btn-secondary" style="height: 40px; width: 100%;">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        onHandleSubmit(e, email, password);
    });

    document.getElementById('registerButton').addEventListener('click', function() {
        window.navigateTo('/register');
    });
}