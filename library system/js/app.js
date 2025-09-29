// Main application controller
const App = {
    // DOM Elements
    elements: {
        pages: null,
        navLinks: null
    },
    // Initialize the application
    init: function() {
        this.elements = {
            pages: document.querySelectorAll('.page'),
            navLinks: document.querySelectorAll('.nav-link')
        };
        this.bindEvents();
        // Initialize modules
        Auth.init();
        BookManager.init();
        // Show home page by default
        this.showPage('home');
    },
    // Bind application events
    bindEvents: function() {
        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
    },
    // Show specific page and hide others
    showPage: function(pageName) {
        this.elements.pages.forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        // Update book displays when showing books or dashboard
        if (pageName === 'books' || pageName === 'dashboard') {
            BookManager.renderBooks();
            if (pageName === 'dashboard') {
                BookManager.renderManageBooks();
            }
        }
    }
};
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
