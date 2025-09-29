//Storage management for books and authentication state
const Storage = {
    // Book storage methods
    getBooks: () => {
        const books = localStorage.getItem('libraryBooks');
        return books ? JSON.parse(books) : [
            { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, available: 'Available' },
            { id: 2, title: '1984', author: 'George Orwell', year: 1949, available: 'Available' },
            { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, available: 'Checked Out' },
            { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, available: 'Available' },
            { id: 5, title: 'Moby Dick', author: 'Herman Melville', year: 1851, available: 'Checked Out' }
        ];
    },
    saveBooks: (books) => {
        localStorage.setItem('libraryBooks', JSON.stringify(books));
    },
    // Authentication storage methods
    getAuthStatus: () => {
        return localStorage.getItem('isLibrarianLoggedIn') === 'true';
    },
    setAuthStatus: (status) => {
        localStorage.setItem('isLibrarianLoggedIn', status.toString());
    },
    // Clear all storage (for logout/reset)
    clearAll: () => {
        localStorage.removeItem('libraryBooks');
        localStorage.removeItem('isLibrarianLoggedIn');
    }
};

