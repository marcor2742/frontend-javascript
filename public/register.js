	function renderRegister() {
		const appDiv = document.querySelector('.App');
	
		// Aggiungi dinamicamente il file CSS per la pagina di registrazione
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'register.css';
		document.head.appendChild(link);
	
		appDiv.innerHTML = `
			<div class="register">
				<div class="login_box">
					<h1>Register</h1>
					<div class="login_form">
						<form class="login_form" id="registerForm">
							<input type="text" id="username" placeholder="Username" class="form-control" required />
							<input type="email" id="email" placeholder="Email" class="form-control" required />
							<input type="password" id="password" placeholder="Password" class="form-control" required />
							<button type="submit" class="btn btn-primary" style="height: 40px; width: 100%;">Register</button>
							<button type="button" id="loginButton" class="btn btn-secondary" style="height: 40px; width: 100%;">Login</button>
						</form>
					</div>
				</div>
			</div>
		`;
	
		document.getElementById('registerForm').addEventListener('submit', function(e) {
			const username = document.getElementById('username').value;
			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;
			onHandleSubmit(e, username, email, password);
		});
	
		document.getElementById('loginButton').addEventListener('click', function() {
			navigateTo('/login');
		});
	}
	
	document.addEventListener('DOMContentLoaded', renderRegister);