window.globalVariables = {
    token: null,
    userEmail: null,
    userUsername: null,
    userId: null,
    setVarData: function(newVarData) {
        Object.assign(this, newVarData);
    },
    getVarData: function() {
        return {
            token: this.token,
            userEmail: this.userEmail,
            userUsername: this.userUsername,
            userId: this.userId,
        };
    }
};