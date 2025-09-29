// Student view specific functionality
function displayBooks(books = null) {
    const booksContainer = document.getElementById('booksContainer');
    const booksToDisplay = books || getBooks();
    if (!booksToDisplay || booksToDisplay.length === 0) {
        booksContainer.innerHTML = '<p class="no-books">No books found matching your criteria.</p>';
        return;
    }
    booksContainer.innerHTML = booksToDisplay.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.id})">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <span class="status ${book.available > 0 ? 'available' : 'borrowed'}">
                ${getStatusText(book)}
            </span>
            ${book.available > 0
                ? `<p><small>${book.available} of ${book.quantity} available</small></p>`
                : '<p><small>All copies currently borrowed</small></p>'
            }
        </div>
    `).join('');
}
function showBookDetails(bookId) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const bookDetails = document.getElementById('bookDetails');
    bookDetails.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Total Copies:</strong> ${book.quantity}</p>
        <p><strong>Available Copies:</strong> ${book.available}</p>
        <p><strong>Status:</strong>
            <span class="status ${book.available > 0 ? 'available' : 'borrowed'}">
                ${getStatusText(book)}
            </span>
        </p>
        ${book.available === 0
            ? '<p class="warning">This book is currently not available for borrowing.</p>'
            : '<p class="success">This book is available for borrowing.</p>'
        }
    `;
    openModal('bookModal');
}
// Close modal with X button (supports multiple modals)
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});
// Initialize student view
document.addEventListener('DOMContentLoaded', function() {
    displayBooks();
    // Add search on input
    document.getElementById('searchInput')?.addEventListener('input', searchBooks);
});
