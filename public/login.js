import { setUserData, getUserData } from './userData.js';

export function renderLogin() {
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
                        <div class="mb-3">
                            <input type="email" id="email" placeholder="Email" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <input type="password" id="password" placeholder="Password" class="form-control" required />
                        </div>
                        <div class="empty"></div>
                        <button type="submit" class="btn btn-primary w-100" style="height: 40px;">Login</button>
                        <button type="button" id="registerButton" class="btn btn-secondary w-100 mt-2" style="height: 40px;">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await onHandleSubmit(e, email, password);
    });

    document.getElementById('registerButton').addEventListener('click', function() {
        window.navigateTo('/register');
    });
}

async function onHandleSubmit(e, email, password) {
    e.preventDefault();
    if (email && password) {
        console.log('Email:', email);
        console.log('Password:', password);
        const csrftoken = getCookie('csrftoken');
        const loginSuccess = await loginUser(email, password, csrftoken);
        if (loginSuccess) {
            await handleGetUser(csrftoken);
            window.navigateTo('/home');
        }
    } else {
        console.log('Per favore, inserisci sia email che password.');
    }
}

async function loginUser(email, password, csrftoken) {
    try {
        const response = await fetch('http://localhost:8000/login/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Risposta dal server:', data);

            setUserData(email, data.username, data.user_id, data.access_token);
            return true;
        } else {
            const errorData = await response.json();
            console.error('Errore login:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Exception login:', error);
        return false;
    }
}

async function handleGetUser(csrftoken) {
    try {
        const response = await fetch('http://localhost:8000/login/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': `Bearer ${getUserData().token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const { user, user_id } = data;
            const { email, username } = user;

            setUserData(email, username, user_id, getUserData().token);
            console.log('User email:', email);
            console.log('User username:', username);
            console.log('User ID:', user_id);
        } else {
            const errorData = await response.json();
            console.error('Errore nella risposta del server:', errorData);
        }
    } catch (error) {
        console.error('Errore nella richiesta:', error);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}