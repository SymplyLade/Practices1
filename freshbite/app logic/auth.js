//Authentication module
const Auth = {
    // Staff credentials
    staffCredentials: {
        username: 'admin',
        password: 'cafe123'
    },
    // Check if user is logged in
    isLoggedIn: false,
    // Login function
    login: function(username, password) {
        if (username === this.staffCredentials.username &&
            password === this.staffCredentials.password) {
            this.isLoggedIn = true;
            return true;
        }
        return false;
    },
    // Logout function
    logout: function() {
        this.isLoggedIn = false;
    }
};