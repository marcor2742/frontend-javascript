let userData = {
    email: null,
    username: null,
    userId: null,
    token: null
};

export function setUserData(email, username, userId, token) {
    userData.email = email;
    userData.username = username;
    userData.userId = userId;
    userData.token = token;
}

export function getUserData() {
    return userData;
}