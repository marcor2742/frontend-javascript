let variables = {
    token: null,
    userEmail: null,
    userUsername: null,
    userId: null,
	name: null,
	surname: null,
	birthdate: null,
	bio: null,
};

export function setVariables(newVariables) {
    variables = { ...variables, ...newVariables };
    console.log('Variables set:', variables); // Aggiungi questo per il debug
}

export function getVariables() {
    console.log('Variables retrieved:', variables); // Aggiungi questo per il debug
    return variables;
}