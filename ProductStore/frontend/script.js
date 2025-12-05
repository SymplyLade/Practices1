// // Initialize state
// let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
// let products = JSON.parse(localStorage.getItem('products')) || [];
// let users = JSON.parse(localStorage.getItem('users')) || [];

// // Page detection
// function getCurrentPage() {
//     const path = window.location.pathname;
//     if (path.includes('login.html')) return 'login';
//     if (path.includes('admin-dashboard.html')) return 'admin-dashboard';
//     if (path.includes('user-dashboard.html')) return 'user-dashboard';
//     return 'landing';
// }

// // Load data from JSON
// async function loadLibraryData() {
//     try {
//         const response = await fetch('product-data.json');
//         const data = await response.json();
        
//         // Always update books from JSON to ensure we have the latest data
//         products = data.products;
//         localStorage.setItem('products', JSON.stringify(products));
        
//         // Update users from JSON, but don't overwrite existing users
//         const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
//         const jsonUsers = data.users || [];
        
//         // Merge users, avoiding duplicates
//         const mergedUsers = [...existingUsers];
//         jsonUsers.forEach(newUser => {
//             if (!mergedUsers.some(existingUser => existingUser.username === newUser.username)) {
//                 mergedUsers.push(newUser);
//             }
//         });
        
//         users = mergedUsers;
//         localStorage.setItem('users', JSON.stringify(users));

//         // Initialize borrowing histories if they don't exist
//         if (!localStorage.getItem('allBorrowingHistories')) {
//             storeAllBorrowingHistories();
//         }
        
//         return data;
//     } catch (error) {
//         console.error('Error loading library data:', error);
//         showAlert('Failed to load book data. Some features may not work.', 'warning');
        
//         // Initialize with empty arrays if loading fails
//         books = JSON.parse(localStorage.getItem('products')) || [];
//         users = JSON.parse(localStorage.getItem('users')) || [];
        
//         return { users: [], products: [] };
//     }
// }

// // Save books to localStorage
// function saveProducts() {
//     localStorage.setItem('products', JSON.stringify(products));
// }

// // Store all borrowing histories in localStorage
// function storeAllSalesHistories() {
//     const allHistories = {};

//     products.forEach(product => {
//         if (product.saleHistory) {
//             product.saleHistory.forEach(entry => {
//                 if (!allHistories[entry.user]) {
//                     allHistories[entry.user] = [];
//                 }
//                 allHistories[entry.user].push({
//                    productName: product.name,
//                     saleDate: entry.borrowDate,
//                     // returnDate: entry.returnDate || null,
//                 });
//             });
//         }
//     });

//     localStorage.setItem('allSalesHistories', JSON.stringify(allHistories));
// }

// // Display books for user or librarian
// function displayProducts() {
//     const userBookList = document.getElementById('userProductList');
//     const librarianBookList = document.getElementById('adminProductList');
//     if (userProductList) userProductList.innerHTML = '';
//     if (adminProductList) adminProductList.innerHTML = '';

//     const soldProductList = document.getElementById('soldProductList');
//     if (soldProductList) borrowedBooksList.innerHTML = '';

//     // Sort books
//     const sortedProducts = [...products].sort((a, b) => {
//         if (a.isAvailable && !b.isAvailable) return -1;
//         if (!a.isAvailable && b.isAvailable) return 1;
//         return a.name.localeCompare(b.name);
//     });
    
//     // Display sorted book
//     sortedProducts.forEach(product => {
//         const productCard = createProductCard(product);
        
//         if (currentUser?.role === 'user' && userProductList) {
//             if (product.isAvailable) {
//                 userProductList.appendChild(productCard);
//             }
//             if (!product.isAvailable && product.soldBy === currentUser.username) {
//                 const soldCard = createProductCard(product, true);
//                 soldProductList.appendChild(soldCard);
//             }
//         } else if (currentUser?.role === 'admin' && adminProductList) {
//             adminProductList.appendChild(bookCard);
//         }
//     });
     
//     // Search functionality
//     const searchButton = document.getElementById('searchButton');
//     const clearSearch = document.getElementById('clearSearch');
    
//     if (searchButton) {
//         searchButton.addEventListener('click', () => {
//             const searchTerm = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
//             const filteredProducts = products.filter(product =>
//                 searchTerm === '' ||
//                 product.name?.toLowerCase().includes(searchTerm) 
//                 // product.author?.toLowerCase().includes(searchTerm) 
//                 // book.genre?.toLowerCase().includes(searchTerm)
//             );
//             displaySearchResults(filteredProducts);
//         });
//     }

//     if (clearSearch) {
//         clearSearch.addEventListener('click', () => {
//             document.getElementById('searchInput').value = '';
//             displayProducts();
//         });
//     }

//     // Show/hide borrowed books section
//     const mySoldProducts= document.getElementById('mySoldProducts');
//     if (mySoldProducts) {
//         const hasoldProducts = products.some(products => 
//             !product.isAvailable && product.soldTo === currentUser?.username
//         );
//         mySoldProducts.style.display = hasoldProducts ? 'block' : 'none';
//     }

//     setTimeout(() => displaySoldHistory());
// }

// // Create book card element
// function createProductCard(product, isSold = false, isPublic = false) {
//     const productCard = document.createElement('div');
//     productCard.className = `product-card ${product.isAvailable ? 'available' : 'not-available'} ${
//         isSold ? 'sold-card' : ''
//     }`;
    
//     const soldDate = product.soldDate ? new Date(product.soldDate) : null;
//     // const dueDate = book.dueDate ? new Date(book.dueDate) : null;
//     const imageUrl = product.productImage || product.coverImage || '/images/default-product.jpg';
    
//     productCard.innerHTML = `
//         <div class="product-image-container">
//             <img src="${imageUrl}" alt="${product.name} cover" class="product-cover" onerror="this.src='/images/default-product.jpg'">
//             ${!product.isAvailable ? `
//                 <span class="product-status-badge">Sold</span>
//             ` : ''}
//         </div>
//         <div class="product-info">
//             <h4 class="product-name">${product.name}</h4>
//             <p class="product-price">by ${product.price}</p>
//             <div class="product-meta">
//                 // <span class="book-genre">${book.genre}</span>
//                 <span class="badge ${product.isAvailable ? 'bg-success' : 'bg-danger'}">
//                     ${product.isAvailable ? 'Available' : 'Sold'}
//                 </span>
//             </div>
//             ${!product.isAvailable && soldDate && !isPublic ? `
//                 <div class="sold-dates">
//                     <div class="date-item">
//                         <span class="date-label">Sold:</span>
//                         <span class="date-value">${soldDate.toLocaleDateString()}</span>
//                     </div>
//                     // <div class="date-item">
//                     //     <span class="date-label">Due:</span>
//                     //     <span class="date-value">${dueDate.toLocaleDateString()}</span>
//                     // </div>
//                 </div>
//             ` : ''}
//             ${isPublic && !product.isAvailable ? `
//                 <p class="text-muted mt-2">Please register to patronise us.</p>
//             ` : ''}
//         </div>
//         <div class="product-actions">
//             ${isPublic ? `
//                 <a href="login.html" class="btn btn-sm btn-primary">Register to Patronise</a>
//             ` : currentUser?.role === 'user' ? `
//                 <button class="btn btn-sm ${product.isAvailable ? 'btn-primary' : 'btn-secondary'}"
//                     onclick="handleBookAction(${product.id}, '${product.isAvailable ? 'sold': ""}')">
//                     ${product.isAvailable ? 'Sold' : ''}
//                 </button>
//             ` : currentUser?.role === 'admin' ? `
//                 <button class="btn btn-sm btn-danger delete-btn"
//                     onclick="handleBookAction(${product.id}, 'delete')"
//                     data-bs-toggle="tooltip" product="Delete this product">
//                     <i class="bi bi-trash"></i> Delete
//                 </button>
//             ` : ''}
//         </div>
//     `;
    
//     return productCard;
// }

// // Display search results
// function displaySearchResults(filteredProducts) {
//     const userProductList = document.getElementById('userProductList');
//     const soldProductsList = document.getElementById('soldProductList');
//     if (!userProductList || !soldProductsList) return;

//     userProductList.innerHTML = '';
//     soldProductsList.innerHTML = '';

//     if (filteredProducts.length === 0) {
//         userProductList.innerHTML = '<p class="text-muted">No product found matching your search.</p>';
//         return;
//     }

//     // Sort search results - available first
//     const sortedResults = [...filteredProducts].sort((a, b) => {
//         if (a.isAvailable && !b.isAvailable) return -1;
//         if (!a.isAvailable && b.isAvailable) return 1;
//         return 0;
//     });
 
//     // Render Books for User Based on Availability and Borrowing
//     sortedResults.forEach(product => {
//         const productCard = createProductCard(product);
        
//         if (currentUser?.role === 'user' && userProductList) {
//             if (product.isAvailable) {
//                 userProductList.appendChild(productCard);
//             }
//             if (!product.isAvailable && product.soldTo === currentUser.username) {
//                 const soldCard = createProductCard(product, true);
//                 soldProductsList.appendChild(soldCard);
//             }
//         }
//     });
// }

// // // Display borrowing history
// // function displayBorrowingHistory() {
// //     const historySection = document.getElementById('borrowingHistory');
// //     if (!historySection) return;

// //     historySection.innerHTML = '';

// //     // For regular users: 
// //     if (currentUser?.role === 'user') {
// //         const userHistory = books
// //             .filter(book => book.borrowHistory?.some(entry => entry.user === currentUser.username))
// //             .flatMap(book => 
// //                 book.borrowHistory
// //                     .filter(entry => entry.user === currentUser.username)
// //                     .map(entry => ({
// //                         title: book.title,
// //                         ...entry
// //                     }))
// //             )
// //             .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

// //         const historyHTML = `
// //             <div class="history-section-header">
// //                 <h3>Your Borrowing History</h3>
// //             </div>
// //             ${userHistory.length === 0 ? 
// //                 '<p class="text-muted">No borrowing history found</p>' : 
// //                 `<div class="table-responsive">
// //                     <table class="table table-hover">
// //                         <thead class="table-light">
// //                             <tr>
// //                                 <th>Book</th>
// //                                 <th>Borrowed</th>
// //                                 <th>Returned</th>
// //                                 <th>Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             ${userHistory.map(entry => `
// //                                 <tr>
// //                                     <td>${entry.title}</td>
// //                                     <td>${new Date(entry.borrowDate).toLocaleDateString()}</td>
// //                                     <td>${entry.returnDate ? new Date(entry.returnDate).toLocaleDateString() : '-'}</td>
// //                                     <td><span class="badge ${entry.returnDate ? 'bg-success' : 'bg-warning'}">${
// //                                         entry.returnDate ? 'Returned' : 'Not returned'
// //                                     }</span></td>
// //                                 </tr>
// //                             `).join('')}
// //                         </tbody>
// //                     </table>
// //                 </div>`
// //             }
// //         `;
        
// //         historySection.innerHTML = historyHTML;

// //     // For librarians: 
// //     } else if (currentUser?.role === 'librarian') {
// //         const allHistories = JSON.parse(localStorage.getItem('allBorrowingHistories')) || {};
        
// //         const historyHTML = `
// //             <div class="history-section-header">
// //                 <h3>All Users' Borrowing Histories</h3>
// //             </div>
// //             <div class="librarian-history-view">
// //                 ${Object.keys(allHistories).length === 0 ? 
// //                     '<p class="text-muted">No borrowing histories found.</p>' : 
// //                     Object.entries(allHistories).map(([user, entries]) => `
// //                         <div class="user-history mb-4">
// //                             <h5 class="user-history-header">${user}</h5>
// //                             <div class="table-responsive">
// //                                 <table class="table table-sm table-striped">
// //                                     <thead>
// //                                         <tr>
// //                                             <th>Book</th>
// //                                             <th>Borrowed</th>
// //                                             <th>Returned</th>
// //                                             <th>Status</th>
// //                                         </tr>
// //                                     </thead>
// //                                     <tbody>
// //                                         ${entries.map(entry => `
// //                                             <tr>
// //                                                 <td>${entry.bookTitle}</td>
// //                                                 <td>${new Date(entry.borrowDate).toLocaleDateString()}</td>
// //                                                 <td>${entry.returnDate ? new Date(entry.returnDate).toLocaleDateString() : '-'}</td>
// //                                                 <td><span class="badge ${
// //                                                     entry.returnDate ? 'bg-success' : 'bg-warning'
// //                                                 }">${entry.returnDate ? 'Returned' : 'Not returned'}</span></td>
// //                                             </tr>
// //                                         `).join('')}
// //                                     </tbody>
// //                                 </table>
// //                             </div>
// //                         </div>
// //                     `).join('')}
// //             </div>
// //         `;
        
// //         historySection.innerHTML = historyHTML;
// //     }
// // }

// // Display public search results for non-logged-in users
// function displayPublicSearchResults(filteredProducts) {
//     const publicSearchResults = document.getElementById('publicSearchResults');
//     if (!publicSearchResults) {
//         console.error('Public search results container not found');
//         return;
//     }

//     publicSearchResults.innerHTML = '';

//     if (!filteredProducts || filteredProducts.length === 0) {
//         publicSearchResults.innerHTML = '<p class="text-muted">No product found. Try a different search term or check back later.</p>';
//         return;
//     }

//     const validProducts = filteredProducts.filter(product => product.name && product.price);
//     if (validProducts.length === 0) {
//         publicSearchResults.innerHTML = '<p class="text-muted">No valid products found in the store</p>';
//         return;
//     }

//     const sortedResults = [...validProducts].sort((a, b) => {
//         if (a.isAvailable && !b.isAvailable) return -1;
//         if (!a.isAvailable && b.isAvailable) return 1;
//         return 0;
//     });

//     sortedResults.forEach(product => {
//         const productCard = createProductCard(product, false, true);
//         publicSearchResults.appendChild(productCard);
//     });
// }

// // Handle public search
// function setupPublicSearch() {
//     const publicSearchButton = document.getElementById('publicSearchButton');
//     const publicSearchInput = document.getElementById('publicSearchInput');

//     if (publicSearchButton && publicSearchInput) {
//         publicSearchButton.addEventListener('click', async () => {
//             if (currentUser) return;
//             await loadLibraryData();
//             const searchTerm = publicSearchInput.value.trim().toLowerCase();
//             const filteredProducts = products.filter(product =>
//                 searchTerm === '' ||
//                 product.name?.toLowerCase().includes(searchTerm) 
//                 // book.author?.toLowerCase().includes(searchTerm) ||
//                 // book.genre?.toLowerCase().includes(searchTerm)
//             );
//             displayPublicSearchResults(filteredProducts);
//         });

//         publicSearchInput.addEventListener('keypress', async (e) => {
//             if (e.key === 'Enter' && !currentUser) {
//                 await loadLibraryData();
//                 const searchTerm = publicSearchInput.value.trim().toLowerCase();
//                 const filteredProducts = products.filter(product =>
//                     searchTerm === '' ||
//                     product.name?.toLowerCase().includes(searchTerm)
//                     // book.author?.toLowerCase().includes(searchTerm) ||
//                     // book.genre?.toLowerCase().includes(searchTerm)
//                 );
//                 displayPublicSearchResults(filteredProducts);
//             }
//         });
//     }
// }

// // Handle book actions
// function handleProductAction(productId, action) {
//     const product = products.find(b => p.id === productId);
//     if (!product) return;

//     if (action === 'delete' && currentUser?.role === 'admin') {
//         if (!product.isAvailable) {
//             showAlert(`Cannot delete "${product.name}" because it's out of stock.`, 'danger');
//             return;
//         }
//         if (confirm('Are you sure you want to delete this product?')) {
//             products = products.filter(b => p.id !== productId);
//             saveProducts();
//             storeAllSoldHistories();
//             displayProducts();
//             showAlert(`"${product.title}" has been deleted from the store.`, 'danger');
//         }
//         return;
//     }

//     if (action === 'sold' && product.isAvailable) {
//         const now = new Date();
//         const dueDate = new Date(now);
//         dueDate.setDate(now.getDate() + 14);
    
//         product.isAvailable = false;
//         product.soldTo = currentUser.username;
//         product.soldDate = now.toISOString();
//         // book.dueDate = dueDate.toISOString();
        
//         if (!book.borrowHistory) book.borrowHistory = [];
//         book.borrowHistory.push({
//             user: currentUser.username,
//             borrowDate: now.toISOString()
//         });
    
//         saveBooks();
//         storeAllBorrowingHistories();
//         displayBooks();
//         showAlert(`You borrowed "${book.title}". Due on ${dueDate.toLocaleDateString()}`, 'success');
//     } else if (action === 'return' && !book.isAvailable && book.borrowedBy === currentUser.username) {
//         book.isAvailable = true;
        
//         const historyEntry = book.borrowHistory?.find(
//             entry => entry.user === currentUser.username && !entry.returnDate
//         );
//         if (historyEntry) {
//             historyEntry.returnDate = new Date().toISOString();
//         }
        
//         delete book.borrowedBy;
//         delete book.borrowDate;
//         delete book.dueDate;
        
//         saveBooks();
//         storeAllBorrowingHistories();
//         displayBooks();
//         showAlert(`You have successfully returned "${book.title}".`, 'warning');
//     }
// }

// // Show alert notification
// function showAlert(message, type = 'info') {
//     const alertContainer = document.getElementById('alertContainer');
//     if (!alertContainer) {
//         console.warn('Alert container not found');
//         return;
//     }

//     const alert = document.createElement('div');
//     alert.className = `alert alert-${type} alert-dismissible fade show`;
//     alert.role = 'alert';
//     alert.innerHTML = `
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//     `;

//     alertContainer.appendChild(alert);

//     setTimeout(() => {
//         alert.classList.remove('show');
//         setTimeout(() => alert.remove(), 100);
//     }, 3000);
// }

// // Show/hide sections based on login state and page
// async function updateUI() {
//     const currentPage = getCurrentPage();
    
//     await loadLibraryData();

//     // Redirect logic based on user role and current page
//     if (currentUser) {
//         if (currentPage === 'login') {
//             // Redirect to appropriate dashboard
//             if (currentUser.role === 'librarian') {
//                 window.location.href = 'librarian-dashboard.html';
//             } else {
//                 window.location.href = 'user-dashboard.html';
//             }
//             return;
//         }
        
//         if (currentPage === 'landing') {
//             // Redirect from landing page if logged in
//             if (currentUser.role === 'librarian') {
//                 window.location.href = 'librarian-dashboard.html';
//             } else {
//                 window.location.href = 'user-dashboard.html';
//             }
//             return;
//         }

//         // Page-specific logic for dashboards
//         if (currentPage === 'user-dashboard' && currentUser.role !== 'user') {
//             window.location.href = 'librarian-dashboard.html';
//             return;
//         }

//         if (currentPage === 'librarian-dashboard' && currentUser.role !== 'librarian') {
//             window.location.href = 'user-dashboard.html';
//             return;
//         }

//         // Update dashboard UI
//         const welcomeMessage = document.getElementById('welcomeMessage');
//         if (welcomeMessage) {
//             welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
//         }

//         // Display appropriate content
//         if (currentPage === 'user-dashboard' || currentPage === 'librarian-dashboard') {
//             displayBooks();
//             if (currentUser.role === 'librarian') {
//                 displayLibraryStatistics();
//             }
//         }

//     } else {
//         // Not logged in - redirect from dashboard pages
//         if (currentPage === 'user-dashboard' || currentPage === 'librarian-dashboard') {
//             window.location.href = 'login.html';
//             return;
//         }

//         // Setup public search on landing page
//         if (currentPage === 'landing') {
//             setupPublicSearch();
//         }
//     }
// }

// // Handle login form - FIXED VERSION
// function setupLoginForm() {
//     const loginForm = document.getElementById('loginForm');
//     const showRegister = document.getElementById('showRegister');
//     const showLogin = document.getElementById('showLogin');
//     const registerCard = document.getElementById('registerCard');

//     if (loginForm) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('loginUsername').value.trim();
//             const password = document.getElementById('loginPassword').value;
//             const userType = document.getElementById('userType').value;
//             const loginError = document.getElementById('loginError');

//             console.log('Login attempt:', { username, password, userType });

//             // Load users from localStorage
//             const users = JSON.parse(localStorage.getItem('users')) || [];
//             console.log('Available users:', users);

//             // Find user - check username and password first, then verify role
//             const user = users.find(u => 
//                 u.username === username && 
//                 u.password === password
//             );

//             console.log('Found user:', user);

//             if (user) {
//                 // Check if user type matches
//                 if (user.role !== userType) {
//                     if (loginError) {
//                         loginError.textContent = `This account is registered as a ${user.role}, not ${userType}. Please select the correct user type.`;
//                         loginError.style.display = 'block';
//                     }
//                     return;
//                 }

//                 currentUser = user;
//                 localStorage.setItem('currentUser', JSON.stringify(user));
//                 if (loginError) loginError.style.display = 'none';
                
//                 showAlert(`Welcome back, ${username}!`, 'success');
                
//                 // Redirect based on role
//                 setTimeout(() => {
//                     if (user.role === 'librarian') {
//                         window.location.href = 'librarian-dashboard.html';
//                     } else {
//                         window.location.href = 'user-dashboard.html';
//                     }
//                 }, 1000);
//             } else {
//                 if (loginError) {
//                     loginError.textContent = 'Invalid username or password. Please try again.';
//                     loginError.style.display = 'block';
//                 }
//             }
//         });
//     }

//     // Toggle between login and register forms
//     if (showRegister && registerCard) {
//         showRegister.addEventListener('click', (e) => {
//             e.preventDefault();
//             registerCard.style.display = 'block';
//             if (loginForm) loginForm.style.display = 'none';
//         });
//     }

//     if (showLogin && registerCard) {
//         showLogin.addEventListener('click', (e) => {
//             e.preventDefault();
//             registerCard.style.display = 'none';
//             if (loginForm) loginForm.style.display = 'block';
//         });
//     }
// }

// // Handle registration form
// function setupRegisterForm() {
//     const registerForm = document.getElementById('registerForm');
//     if (registerForm) {
//         registerForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('registerUsername').value.trim();
//             const password = document.getElementById('registerPassword').value;
//             const userType = document.getElementById('registerUserType').value;
//             const registerError = document.getElementById('registerError');

//             if (!username || !password) {
//                 if (registerError) {
//                     registerError.textContent = 'Please enter a username and password.';
//                     registerError.style.display = 'block';
//                 }
//                 return;
//             }

//             if (username.length < 3) {
//                 if (registerError) {
//                     registerError.textContent = 'Username must be at least 3 characters long.';
//                     registerError.style.display = 'block';
//                 }
//                 return;
//             }

//             if (password.length < 3) {
//                 if (registerError) {
//                     registerError.textContent = 'Password must be at least 3 characters long.';
//                     registerError.style.display = 'block';
//                 }
//                 return;
//             }

//             const users = JSON.parse(localStorage.getItem('users')) || [];

//             if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
//                 if (registerError) {
//                     registerError.textContent = 'Username already exists. Please choose another one.';
//                     registerError.style.display = 'block';
//                 }
//                 return;
//             }

//             const newUser = { 
//                 username: username, 
//                 password: password, 
//                 role: userType 
//             };
//             users.push(newUser);
//             localStorage.setItem('users', JSON.stringify(users));

//             console.log('New user registered:', newUser);
//             console.log('All users:', users);

//             if (registerError) registerError.style.display = 'none';
//             showAlert('Registration successful! You can now log in.', 'success');

//             // Switch back to login form
//             const registerCard = document.getElementById('registerCard');
//             const loginForm = document.getElementById('loginForm');
//             if (registerCard && loginForm) {
//                 registerCard.style.display = 'none';
//                 loginForm.style.display = 'block';
//             }

//             registerForm.reset();
//         });
//     }
// }

// // Handle add book form
// function setupAddBookForm() {
//     const addBookForm = document.getElementById('addBookForm');
//     if (addBookForm) {
//         addBookForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             if (currentUser?.role !== 'librarian') return;

//             const title = document.getElementById('bookTitle').value.trim();
//             const author = document.getElementById('bookAuthor').value.trim();
//             const genre = document.getElementById('bookGenre').value.trim();
//             const bookImage = document.getElementById('bookCover').value.trim();

//             if (title && author && genre) {
//                 const newId = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
//                 books.push({ 
//                     id: newId, 
//                     title, 
//                     author, 
//                     genre, 
//                     isAvailable: true, 
//                     bookImage: bookImage || '/images/default-book.jpg',
//                     borrowHistory: [] 
//                 });
//                 saveBooks();
//                 displayBooks();
//                 showAlert(`"${title}" has been added to the library.`, 'success');
//                 addBookForm.reset();
//             }
//         });
//     }
// }

// // Handle logout
// function setupLogout() {
//     const logoutButton = document.getElementById('logoutButton');
//     if (logoutButton) {
//         logoutButton.addEventListener('click', () => {
//             currentUser = null;
//             localStorage.removeItem('currentUser');
//             window.location.href = 'index.html';
//         });
//     }
// }

// // Statistics for librarian dashboard
// function getLibraryStatistics() {
//     const totalBooks = books.length;
//     const availableBooks = books.filter(book => book.isAvailable).length;
//     const borrowedBooks = totalBooks - availableBooks;
    
//     // Find most borrowed book
//     let mostBorrowedBook = null;
//     let maxBorrows = 0;
    
//     books.forEach(book => {
//         const borrowCount = book.borrowHistory?.length || 0;
//         if (borrowCount > maxBorrows) {
//             maxBorrows = borrowCount;
//             mostBorrowedBook = book;
//         }
//     });
    
//     return {
//         totalBooks,
//         availableBooks,
//         borrowedBooks,
//         mostBorrowedBook: mostBorrowedBook ? {
//             title: mostBorrowedBook.title,
//             borrowCount: maxBorrows
//         } : null
//     };
// }

// function displayLibraryStatistics() {
//     const statsContainer = document.getElementById('libraryStatistics');
//     if (!statsContainer || currentUser?.role !== 'librarian') {
//         return;
//     }

//     const stats = getLibraryStatistics();
    
//     statsContainer.innerHTML = `
//         <div class="row g-4">
//             <div class="col-md-3">
//                 <div class="stat-card card h-100">
//                     <div class="card-body">
//                         <h5 class="card-title">Total Books</h5>
//                         <p class="stat-value">${stats.totalBooks}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="stat-card card h-100">
//                     <div class="card-body">
//                         <h5 class="card-title">Available</h5>
//                         <p class="stat-value text-success">${stats.availableBooks}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="stat-card card h-100">
//                     <div class="card-body">
//                         <h5 class="card-title">Borrowed</h5>
//                         <p class="stat-value text-warning">${stats.borrowedBooks}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-md-3">
//                 <div class="stat-card card h-100">
//                     <div class="card-body">
//                         <h5 class="card-title">Most Popular</h5>
//                         <p class="stat-value">${stats.mostBorrowedBook ? 
//                             `${stats.mostBorrowedBook.title} (${stats.mostBorrowedBook.borrowCount} borrows)` : 
//                             'No data'}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Debug function to check current state
// function debugState() {
//     console.log('Current User:', currentUser);
//     console.log('Books:', books);
//     console.log('Users:', JSON.parse(localStorage.getItem('users')) || []);
//     console.log('Current Page:', getCurrentPage());
// }

// // Initialize everything when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM loaded, initializing application...');
    
//     // Setup page-specific functionality
//     const currentPage = getCurrentPage();
//     console.log('Current page:', currentPage);
    
//     setupLogout();
    
//     if (currentPage === 'login') {
//         setupLoginForm();
//         setupRegisterForm();
//     } else if (currentPage === 'librarian-dashboard') {
//         setupAddBookForm();
//     }
    
//     // Initialize Bootstrap tooltips
//     const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     tooltipTriggerList.map(element => new bootstrap.Tooltip(element));
    
//     // Update UI
//     updateUI();
    
//     // Debug info
//     debugState();
// });























(() => {
  const STORAGE_KEYS = {
    PRODUCTS: 'hs_products',
    USERS: 'hs_users',
    CURRENT_USER: 'hs_currentUser',
    SALES: 'hs_sales'
  };

  const $ = id => document.getElementById(id);
  const safeParse = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch(e) { return fallback; }
  };

  // ---------- State ----------
  let products = safeParse(STORAGE_KEYS.PRODUCTS, []);
  let users = safeParse(STORAGE_KEYS.USERS, []);
  let currentUser = safeParse(STORAGE_KEYS.CURRENT_USER, null);
  let sales = safeParse(STORAGE_KEYS.SALES, {});

  // ---------- Persistence ----------
  function saveAll() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    if (currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // ---------- Utilities ----------
  function uid(prefix='') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  function showAlert(msg, type='info') {
    const container = $('alertContainer');
    if (!container) return console.log(type, msg);
    const el = document.createElement('div');
    el.className = `alert alert-${type} alert-dismissible`;
    el.role = 'alert';
    el.innerHTML = `${msg}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    container.appendChild(el);
    setTimeout(() => { el.classList.add('fade'); setTimeout(()=>el.remove(), 400); }, 2200);
  }

  // ---------- Auth ----------
  function registerUser(username, password, role='user') {
    if (!username || !password) return { ok:false, message:'Provide username and password' };
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return { ok:false, message:'Username exists' };
    const newUser = { username, password, role };
    users.push(newUser);
    saveAll();
    return { ok:true, user: newUser };
  }

  function loginUser(username, password, role) {
    const u = users.find(x=>x.username===username && x.password===password);
    if (!u) return { ok:false, message:'Invalid credentials' };
    if (role && u.role !== role) return { ok:false, message:`This account is ${u.role}` };
    currentUser = u;
    saveAll();
    return { ok:true, user: u };
  }

  function logout() {
    currentUser = null;
    saveAll();
    render();
  }

  // ---------- Product operations ----------
  function addProduct({ name, price, image, quantity=1 }) {
    const id = uid('p_');
    products.push({ id, name, price, image:image||'/images/default-product.jpg', quantity:Number(quantity)||1, createdAt:new Date().toISOString() });
    saveAll(); render(); return id;
  }

  function deleteProduct(id) {
    products = products.filter(p => p.id!==id);
    saveAll(); render();
  }

  function sellProduct(id) {
    if (!currentUser) return { ok:false, message:'Login required' };
    const p = products.find(p=>p.id===id);
    if (!p) return { ok:false, message:'Product not found' };
    if (p.quantity <= 0) return { ok:false, message:'Out of stock' };
    p.quantity--;
    sales[currentUser.username] = sales[currentUser.username]||[];
    sales[currentUser.username].push({ id: uid('s_'), productId: p.id, productName: p.name, price: p.price, date:new Date().toISOString() });
    saveAll(); render();
    return { ok:true };
  }

  // ---------- Rendering ----------
  function createProductCardElement(product, { forAdmin=false }={}) {
    const card = document.createElement('div');
    card.className = 'product-card card p-2 mb-2 col-md-4';
    card.dataset.id = product.id;
    card.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${product.image}" alt="${product.name}" style="width:72px;height:72px;object-fit:cover;border-radius:.5rem;margin-right:.75rem">
        <div style="flex:1">
          <div class="fw-semibold">${product.name}</div>
          <div class="text-muted small">₦${product.price} • ${product.quantity} in stock</div>
          <div class="mt-2">
            ${forAdmin ? `
              <button data-action="delete" class="btn btn-sm btn-danger">Delete</button>
              <button data-action="addStock" class="btn btn-sm btn-outline-secondary ms-2">+Stock</button>
            ` : `
              <button data-action="sell" class="btn btn-sm btn-primary" ${product.quantity<=0?'disabled':''}>Sell</button>
            `}
          </div>
        </div>
      </div>
    `;
    return card;
  }

  function renderSalesHistory(containerId, username) {
    const container = $(containerId);
    if (!container) return;
    const entries = username ? (sales[username]||[]) : Object.values(sales).flat();
    container.innerHTML = '';
    if (!entries.length) { container.innerHTML='<p class="text-muted">No sales yet.</p>'; return; }
    const tbl = document.createElement('table');
    tbl.className = 'table table-sm';
    tbl.innerHTML = `
      <thead><tr><th>When</th><th>Product</th><th>Price</th><th>Buyer</th></tr></thead>
      <tbody>${entries.map(e=>`<tr>
        <td>${new Date(e.date).toLocaleString()}</td>
        <td>${e.productName}</td>
        <td>₦${e.price}</td>
        <td>${username||e.username||'—'}</td>
      </tr>`).join('')}</tbody>
    `;
    container.appendChild(tbl);
  }

  function renderProductsForUser() {
    const term = ($('searchInput')?.value||'').trim().toLowerCase();
    let filtered = term ? products.filter(p=>p.name.toLowerCase().includes(term)) : products;
    const available = filtered.filter(p=>p.quantity>0);
    const out = filtered.filter(p=>p.quantity<=0);

    if ($('userBookList')) {
      $('userBookList').innerHTML='';
      available.length ? available.forEach(p=>$('userBookList').appendChild(createProductCardElement(p))) : $('userBookList').innerHTML='<p class="text-muted">No available products.</p>';
    }

    if ($('outOfStock')) {
      $('outOfStock').innerHTML='';
      out.length ? out.forEach(p=>$('outOfStock').appendChild(createProductCardElement(p))) : $('outOfStock').innerHTML='<p class="text-muted">All products in stock.</p>';
    }
  }

  function render() {
    if ($('welcomeMessage')) $('welcomeMessage').textContent = currentUser ? `Welcome, ${currentUser.username}` : 'Welcome, guest';
    if ($('logoutButton')) $('logoutButton').style.display = currentUser ? 'inline-block' : 'none';
    if (currentUser?.role==='user') renderProductsForUser();
  }

  // ---------- Event Delegation ----------
  document.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    const action = btn.dataset.action;

    if (action==='sell') {
      const res = sellProduct(id);
      !res.ok ? showAlert(res.message,'danger') : showAlert('Product sold','success');
    } else if (action==='delete') {
      if (!confirm('Delete this product?')) return;
      deleteProduct(id); showAlert('Product deleted','danger');
    } else if (action==='addStock') {
      const qty = Number(prompt('Add quantity:','1'))||0;
      if (qty<=0) return;
      const p = products.find(p=>p.id===id);
      p.quantity += qty; saveAll(); render(); showAlert('Stock updated','success');
    }
  });

  $('searchButton')?.addEventListener('click', ()=>renderProductsForUser());
  $('clearSearch')?.addEventListener('click', ()=>{
    if ($('searchInput')) $('searchInput').value='';
    renderProductsForUser();
  });

  $('logoutButton')?.addEventListener('click', ()=>{ logout(); showAlert('Logged out','info'); });

  // ---------- Demo Data ----------
  function initDemoData() {
    if (!products.length && !users.length) {
      users = [
        {username:'admin',password:'admin',role:'admin'}, 
        {username:'seller',password:'seller',role:'user'}
      ];
      products = [
        {id: uid('p_'), name:'Coconut Oil - 250ml', price:1200, image:'/images/oil.jpg', quantity:10},
        {id: uid('p_'), name:'Edge Control Gel', price:800, image:'/images/edge.jpg', quantity:6},
        {id: uid('p_'), name:'Hair Growth Serum', price:1500, image:'/images/serum.jpg', quantity:4}
      ];
      saveAll();
    }
  }

  // ---------- Login/Register Form Handlers ----------
  function setupAuthForms() {
    $('#showRegister')?.addEventListener('click', e=>{
      e.preventDefault();
      $('#loginCard').style.display='none';
      $('#registerCard').style.display='block';
    });
    $('#showLogin')?.addEventListener('click', e=>{
      e.preventDefault();
      $('#registerCard').style.display='none';
      $('#loginCard').style.display='block';
    });

    $('#loginForm')?.addEventListener('submit', e=>{
      e.preventDefault();
      const username = $('#loginUsername').value.trim();
      const password = $('#loginPassword').value;
      const role = $('#loginRole').value;
      const res = loginUser(username, password, role);
      if (!res.ok) {
        $('#loginError').textContent = res.message;
        $('#loginError').style.display='block';
      } else {
        $('#loginError').style.display='none';
        alert(`Welcome, ${username}!`);
        location.href = 'dashboard.html';
      }
    });

    $('#registerForm')?.addEventListener('submit', e=>{
      e.preventDefault();
      const username = $('#registerUsername').value.trim();
      const password = $('#registerPassword').value;
      const role = $('#registerUserType')?.value || 'user';
      const res = registerUser(username, password, role);
      if (!res.ok) {
        $('#registerError').textContent = res.message;
        $('#registerError').style.display='block';
      } else {
        $('#registerError').style.display='none';
        alert('Registration successful! Please login.');
        $('#registerForm').reset();
        $('#registerCard').style.display='none';
        $('#loginCard').style.display='block';
      }
    });
  }

  // ---------- Boot ----------
  function boot() {
    initDemoData();
    render();
    setupAuthForms();
  }

  document.addEventListener('DOMContentLoaded', boot);

  // ---------- Expose API ----------
  window.HS = { addProduct, deleteProduct, sellProduct, registerUser, loginUser, logout, debug:()=>({products, users, currentUser, sales}) };
})();


















































