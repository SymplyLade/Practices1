// Librarian dashboard functionality
let currentEditingId = null;
// Display all books in the librarian dashboard
function displayLibrarianBooks() {
    const booksContainer = document.getElementById('librarianBooksContainer');
    const books = getBooks();
    // Update stats
    document.getElementById('totalBooks').textContent = books.length;
    document.getElementById('availableBooks').textContent =
        books.filter(book => book.available > 0).length;
    if (books.length === 0) {
        booksContainer.innerHTML = '<p class="no-books">No books in the library yet.</p>';
        return;
    }
    booksContainer.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Total Copies:</strong> ${book.quantity}</p>
            <p><strong>Available:</strong> ${book.available}</p>
            <span class="status ${book.available > 0 ? 'available' : 'borrowed'}">
                ${getStatusText(book)}
            </span>
            <div class="book-actions">
                <button type="button" class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button type="button" class="btn-danger" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}
// Open modal to add a new book
function openAddBookModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Book';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    openModal('bookFormModal');
}
// Close modal
function closeBookFormModal() {
    closeModal('bookFormModal');
}
// Edit book details
function editBook(bookId) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    currentEditingId = bookId;
    document.getElementById('modalTitle').textContent = 'Edit Book';
    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('genre').value = book.genre;
    document.getElementById('quantity').value = book.quantity;
    openModal('bookFormModal');
}
// Delete book
function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        const books = getBooks();
        const updatedBooks = books.filter(book => book.id !== bookId);
        saveBooks(updatedBooks);
        displayLibrarianBooks();
        alert('Book deleted successfully!');
    }
}
// Handle add/edit book form submission
document.getElementById('bookForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const books = getBooks();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const genre = document.getElementById('genre').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    if (!title || !author || !isbn || !genre || isNaN(quantity) || quantity < 1) {
        alert("Please fill in all fields correctly.");
        return;
    }
    if (currentEditingId) {
        // Update existing book
        const bookIndex = books.findIndex(book => book.id === currentEditingId);
        if (bookIndex !== -1) {
            const currentAvailable = books[bookIndex].available;
            const availableChange = quantity - books[bookIndex].quantity;
            books[bookIndex] = {
                ...books[bookIndex],
                title,
                author,
                isbn,
                genre,
                quantity,
                available: Math.max(0, currentAvailable + availableChange)
            };
        }
    } else {
        // Add new book
        const newBook = {
            id: generateId(),
            title,
            author,
            isbn,
            genre,
            quantity,
            available: quantity
        };
        books.push(newBook);
    }
    saveBooks(books);
    displayLibrarianBooks();
    closeBookFormModal();
    alert(`Book ${currentEditingId ? 'updated' : 'added'} successfully!`);
});
// Initialize librarian dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (isLibrarianLoggedIn && isLibrarianLoggedIn()) {
        displayLibrarianBooks();
    }
});