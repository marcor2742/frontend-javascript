document.addEventListener('DOMContentLoaded', function() {
    async function PatchProfile(name, surname, birthdate, bio) {
        const userID = localStorage.getItem("user_id");

        try {
            const response = await fetch(`http://localhost:8002/user/user/${userID}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account_id: userID,
                    first_name: name,
                    last_name: surname,
                    birth_date: birthdate,
                    bio: bio,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Profile:", data);
            } else {
                const errorData = await response.json();
                console.error("Errore nella risposta del server:", errorData);
            }
        } catch (error) {
            console.error("Errore nella richiesta:", error);
        }
    }

    function renderProfile() {
        const username = localStorage.getItem("user_username") || "";
        const email = localStorage.getItem("user_email") || "";
        const user_id = localStorage.getItem("user_id") || "";
        let name = "";
        let surname = "";
        let birthdate = "";
        let bio = "";
        let edit = false;

        let tempName = "";
        let tempSurname = "";
        let tempBirthdate = "";
        let tempBio = "";

        const profileDiv = document.getElementById('profile');
        profileDiv.innerHTML = `
            <div class="profile-card">
                <div class="profile-card-content">
                    <div class="profile-card-details">
                        <form class="profile-form" id="profileForm">
                            <div class="profile-form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" name="username" value="${username}" readonly class="form-control readonly-input">
                            </div>
                            <div class="profile-form-group">
                                <label for="user_id">User ID</label>
                                <input type="text" id="user_id" name="user_id" value="${user_id}" readonly class="form-control readonly-input">
                            </div>
                            <div class="profile-form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" value="${email}" readonly class="form-control readonly-input">
                            </div>
                            <div class="profile-form-group">
                                <label for="birthdate">Data di nascita</label>
                                <input type="date" id="birthdate" name="birthdate" value="${birthdate}" class="form-control">
                            </div>
                            <div class="profile-form-group">
                                <label for="name">Nome</label>
                                <input type="text" id="name" name="name" value="${name}" class="form-control">
                            </div>
                            <div class="profile-form-group">
                                <label for="surname">Cognome</label>
                                <input type="text" id="surname" name="surname" value="${surname}" class="form-control">
                            </div>
                            <div class="profile-form-group">
                                <label for="bio">Bio</label>
                                <textarea id="bio" name="bio" class="form-control" rows="1">${bio}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="profile-card-image-container">
                        <div class="profile-image-circle">
                            <!-- <img src="/placeholder.svg" alt="Profile" class="profile-card-image" /> -->
                        </div>
                        <div class="buttons">
                            <button id="editButton" class="edit-button btn btn-light">
                                <i class="bi bi-pencil edit-icon"></i>
                            </button>
                            <button id="saveButton" class="save-button btn btn-light">
                                <i class="bi bi-save save-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const form = document.getElementById('profileForm');
        const editButton = document.getElementById('editButton');
        const saveButton = document.getElementById('saveButton');

        editButton.addEventListener('click', function(e) {
            e.preventDefault();
            edit = !edit;
            if (edit) {
                tempName = name;
                tempSurname = surname;
                tempBirthdate = birthdate;
                tempBio = bio;
                form.querySelectorAll('input, textarea').forEach(input => {
                    input.removeAttribute('readonly');
                    input.classList.remove('readonly-input');
                });
            } else {
                form.querySelectorAll('input, textarea').forEach(input => {
                    input.setAttribute('readonly', true);
                    input.classList.add('readonly-input');
                });
            }
        });

        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            name = document.getElementById('name').value;
            surname = document.getElementById('surname').value;
            birthdate = document.getElementById('birthdate').value;
            bio = document.getElementById('bio').value;

            localStorage.setItem("name", name);
            localStorage.setItem("surname", surname);
            localStorage.setItem("birthdate", birthdate);
            localStorage.setItem("bio", bio);
            PatchProfile(name, surname, birthdate, bio);

            edit = false;
            form.querySelectorAll('input, textarea').forEach(input => {
                input.setAttribute('readonly', true);
                input.classList.add('readonly-input');
            });
        });

        async function GetProfile() {
            const userID = localStorage.getItem("user_id");
            try {
                const response = await fetch(`http://localhost:8002/user/user/${userID}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    name = data.first_name || "";
                    surname = data.last_name || "";
                    birthdate = data.birth_date || "";
                    bio = data.bio || "";
                    document.getElementById('name').value = name;
                    document.getElementById('surname').value = surname;
                    document.getElementById('birthdate').value = birthdate;
                    document.getElementById('bio').value = bio;
                } else {
                    const errorData = await response.json();
                    console.error("Errore nella risposta del server:", errorData);
                }
            } catch (error) {
                console.error("Errore nella richiesta:", error);
            }
        }

        GetProfile();
    }

    window.renderProfile = renderProfile;
});