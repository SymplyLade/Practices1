// Authentication functionality

const librarianCredentials = {
    username: "librarian",
    password: "library123"
};

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === librarianCredentials.username && password === librarianCredentials.password) {
        localStorage.setItem('librarianLoggedIn', 'true');
        window.location.href = 'librarian.html';
    } else {
        alert('Invalid credentials! Please try again.');
    }
});

function logout() {
    localStorage.removeItem('librarianLoggedIn');
    window.location.href = 'index.html';
}

// Check authentication on librarian pages
if (window.location.pathname.includes('librarian.html')) {
    if (!isLibrarianLoggedIn()) {
        window.location.href = 'login.html';
    }
}