// Shared functions and data management
// Sample initial books data
const initialBooks = [
    {
        id: 1,
        title: "Things Fall Apart",
        author: "Chinua Achebe",
        isbn: "9780385474542",
        genre: "Fiction",
        quantity: 5,
        available: 3
    },
    {
        id: 2,
        title: "Half of a Yellow Sun",
        author: "Chimamanda Ngozi Adichie",
        isbn: "9780007200283",
        genre: "Fiction",
        quantity: 3,
        available: 1
    },
    {
        id: 3,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "9780553380163",
        genre: "Science",
        quantity: 4,
        available: 4
    }
];
// Initialize books in localStorage
function initializeBooks() {
    if (!localStorage.getItem('libraryBooks')) {
        localStorage.setItem('libraryBooks', JSON.stringify(initialBooks));
    }
}
// Get all books from localStorage
function getBooks() {
    initializeBooks();
    return JSON.parse(localStorage.getItem('libraryBooks'));
}
// Save books to localStorage
function saveBooks(books) {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}
// Generate unique ID for new books
function generateId() {
    const books = getBooks();
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
}
// Check if user is logged in as librarian
function isLibrarianLoggedIn() {
    return localStorage.getItem('librarianLoggedIn') === 'true';
}
// Format book status
function getStatusText(book) {
    return book.available > 0 ? 'Available' : 'Borrowed';
}
// Search and filter functions
function searchBooks() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const genreFilter = document.getElementById('genreFilter')?.value.toLowerCase() || "";
    const availabilityFilter = document.getElementById('availabilityFilter')?.value || "";
    const books = getBooks();
    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm);
        const matchesGenre = !genreFilter || book.genre.toLowerCase() === genreFilter;
        const matchesAvailability = !availabilityFilter ||
            (availabilityFilter === 'available' && book.available > 0) ||
            (availabilityFilter === 'borrowed' && book.available === 0);
        return matchesSearch && matchesGenre && matchesAvailability;
    });
    if (typeof displayBooks === "function") {
        displayBooks(filteredBooks); // student-side display
    }
}
function filterBooks() {
    searchBooks(); // Reuse search function for filtering
}
// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeBooks();
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
