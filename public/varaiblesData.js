let varData = {
    token: null,
    userEmail: null,
    userUsername: null,
    userId: null,
	name: null,
	surname: null,
	birthdate: null,
	bio: null,
};

export function setVarData(newVarData) {
    varData = { ...varData, ...newVarData };
}

export function getVarData() {
    return varData;
}