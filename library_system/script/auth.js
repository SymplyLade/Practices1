//Authentication functionality
const librarianCredentials = {
    username: "librarian",
    password: "Ogombo247" // :zap: use the same password shown on your login page
};
// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === librarianCredentials.username && password === librarianCredentials.password) {
        localStorage.setItem('librarianLoggedIn', 'true');
        window.location.href = 'librarian.html'; // redirect to dashboard
    } else {
        alert('Invalid credentials! Please try again.');
    }
});
// Logout function
function logout() {
    localStorage.removeItem('librarianLoggedIn');
    window.location.href = 'index.html';
}
// Helper function to check login status
function isLibrarianLoggedIn() {
    return localStorage.getItem('librarianLoggedIn') === 'true';
}
// Protect librarian page
if (window.location.pathname.includes('librarian.html')) {
    if (!isLibrarianLoggedIn()) {
        window.location.href = 'login.html';
    }
}