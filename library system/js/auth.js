// Authentication management
const Auth = {
    // Librarian credentials
    credentials: {
        username: 'admin',
        password: 'library123'
    },
    // Current authentication state
    isLoggedIn: Storage.getAuthStatus(),
    // DOM Elements
    elements: {
        librarianNav: null,
        loginNav: null,
        logoutNav: null,
        loginForm: null,
        logoutBtn: null,
        loginError: null
    },
    // Initialize authentication
    init: function() {
        this.elements = {
            librarianNav: document.getElementById('librarian-nav'),
            loginNav: document.getElementById('login-nav'),
            logoutNav: document.getElementById('logout-nav'),
            loginForm: document.getElementById('login-form'),
            logoutBtn: document.getElementById('logout-btn'),
            loginError: document.getElementById('login-error')
        };
        this.bindEvents();
        this.updateNavigation();
    },
    // Bind authentication events
    bindEvents: function() {
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    },
    // Handle login form submission
    handleLogin: function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === this.credentials.username && password === this.credentials.password) {
            this.isLoggedIn = true;
            Storage.setAuthStatus(true);
            this.updateNavigation();
            this.hideLoginError();
            this.clearLoginForm();
            // Redirect to dashboard
            if (typeof App !== 'undefined') {
                App.showPage('dashboard');
            }
        } else {
            this.showLoginError();
        }
    },
    // Handle logout
    handleLogout: function(e) {
        e.preventDefault();
        this.isLoggedIn = false;
        Storage.setAuthStatus(false);
        this.updateNavigation();
        // Redirect to home
        if (typeof App !== 'undefined') {
            App.showPage('home');
        }
    },
    // Update navigation based on login status
    updateNavigation: function() {
        if (this.isLoggedIn) {
            this.elements.librarianNav.classList.remove('hidden');
            this.elements.logoutNav.classList.remove('hidden');
            this.elements.loginNav.classList.add('hidden');
        } else {
            this.elements.librarianNav.classList.add('hidden');
            this.elements.logoutNav.classList.add('hidden');
            this.elements.loginNav.classList.remove('hidden');
        }
    },
    // Show login error message
    showLoginError: function() {
        if (this.elements.loginError) {
            this.elements.loginError.classList.remove('hidden');
        }
    },
    // Hide login error message
    hideLoginError: function() {
        if (this.elements.loginError) {
            this.elements.loginError.classList.add('hidden');
        }
    },
    // Clear login form
    clearLoginForm: function() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    },
    // Check if user is logged in
    isAuthenticated: function() {
        return this.isLoggedIn;
    }
};
