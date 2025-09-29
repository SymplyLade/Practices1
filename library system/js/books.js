// Book management functionality
const BookManager = {
    books: [],
    // DOM Elements
    elements: {
        booksList: null,
        manageBooksList: null,
        searchInput: null,
        addBookForm: null,
        actionsHeader: null
    },
    // Initialize book manager
    init: function() {
        this.books = Storage.getBooks();
        this.elements = {
            booksList: document.getElementById('books-list'),
            manageBooksList: document.getElementById('manage-books-list'),
            searchInput: document.getElementById('search-input'),
            addBookForm: document.getElementById('add-book-form'),
            actionsHeader: document.getElementById('actions-header')
        };
        this.bindEvents();
        this.renderBooks();
        this.renderManageBooks();
    },
    // Bind book-related events
    bindEvents: function() {
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        if (this.elements.addBookForm) {
            this.elements.addBookForm.addEventListener('submit', (e) => this.handleAddBook(e));
        }
    },
    // Render books for public view
    renderBooks: function(filteredBooks = null) {
        const booksToRender = filteredBooks || this.books;
        this.elements.booksList.innerHTML = '';
        if (booksToRender.length === 0) {
            this.elements.booksList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No books found</td></tr>';
            return;
        }
        booksToRender.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td class="${book.available === 'Available' ? 'available' : 'checked-out'}">${book.available}</td>
                ${Auth.isAuthenticated() ? `
                <td class="actions">
                    <button class="btn btn-warning toggle-status" data-id="${book.id}">Toggle Status</button>
                    <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
                </td>
                ` : ''}
            `;
            this.elements.booksList.appendChild(row);
        });
        this.bindBookActionEvents(this.elements.booksList);
    },
    // Render books for management view
    renderManageBooks: function() {
        this.elements.manageBooksList.innerHTML = '';
        if (this.books.length === 0) {
            this.elements.manageBooksList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No books in the library</td></tr>';
            return;
        }
        this.books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td class="${book.available === 'Available' ? 'available' : 'checked-out'}">${book.available}</td>
                <td class="actions">
                    <button class="btn btn-warning toggle-status" data-id="${book.id}">Toggle Status</button>
                    <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
                </td>
            `;
            this.elements.manageBooksList.appendChild(row);
        });
        this.bindBookActionEvents(this.elements.manageBooksList);
    },
    // Bind action events for book buttons
    bindBookActionEvents: function(container) {
        // Toggle status buttons
        container.querySelectorAll('.toggle-status').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.toggleBookStatus(id);
            });
        });
        // Delete buttons
        container.querySelectorAll('.delete-book').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.deleteBook(id);
            });
        });
    },
    // Handle search input
    handleSearch: function(e) {
        const query = this.elements.searchInput.value.toLowerCase();
        const filteredBooks = this.books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
        this.renderBooks(filteredBooks);
    },
    // Handle add book form submission
    handleAddBook: function(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = parseInt(document.getElementById('year').value);
        const available = document.getElementById('availability').value;
        const newBook = {
            id: this.books.length > 0 ? Math.max(...this.books.map(b => b.id)) + 1 : 1,
            title,
            author,
            year,
            available
        };
        this.books.push(newBook);
        this.saveBooks();
        this.renderBooks();
        this.renderManageBooks();
        // Reset form
        this.elements.addBookForm.reset();
        // Show success message
        alert('Book added successfully!');
    },
    // Toggle book status
    toggleBookStatus: function(id) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.available = book.available === 'Available' ? 'Checked Out' : 'Available';
            this.saveBooks();
            this.renderBooks();
            this.renderManageBooks();
        }
    },
    // Delete book
    deleteBook: function(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveBooks();
            this.renderBooks();
            this.renderManageBooks();
        }
    },
    // Save books to storage
    saveBooks: function() {
        Storage.saveBooks(this.books);
    },
    // Update actions header visibility
    updateActionsHeader: function() {
        if (Auth.isAuthenticated()) {
            this.elements.actionsHeader.classList.remove('hidden');
        } else {
            this.elements.actionsHeader.classList.add('hidden');
        }
    }
};