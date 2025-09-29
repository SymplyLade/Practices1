// Main application module
const App = {
    // DOM Elements
    dom: {},
    // Initialize the application
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.renderMenuItems();
        this.renderCustomerMenuItems();
    },
    // Cache DOM elements
    cacheDom: function() {
        this.dom = {
            // Pages
            loginPage: document.getElementById('login-page'),
            staffDashboard: document.getElementById('staff-dashboard'),
            customerMenu: document.getElementById('customer-menu'),
            // Forms
            loginForm: document.getElementById('login-form'),
            addItemForm: document.getElementById('add-item-form'),
            // Messages
            loginError: document.getElementById('login-error'),
            addSuccess: document.getElementById('add-success'),
            // Containers
            menuItemsContainer: document.getElementById('menu-items'),
            customerMenuItemsContainer: document.getElementById('customer-menu-items'),
            orderItemsContainer: document.getElementById('order-items'),
            // Order elements
            orderTotal: document.getElementById('order-total'),
            totalAmount: document.getElementById('total-amount'),
            placeOrderBtn: document.getElementById('place-order-btn'),
            // Navigation
            customerLink: document.getElementById('customer-link'),
            staffLink: document.getElementById('staff-link'),
            logoutLink: document.getElementById('logout-link'),
            // Category buttons
            categoryButtons: document.querySelectorAll('.category-btn')
        };
    },
    // Bind event listeners
    bindEvents: function() {
        // Form submissions
        this.dom.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.dom.addItemForm.addEventListener('submit', this.handleAddItem.bind(this));
        // Navigation
        this.dom.customerLink.addEventListener('click', this.showCustomerMenu.bind(this));
        this.dom.staffLink.addEventListener('click', this.showStaffLogin.bind(this));
        this.dom.logoutLink.addEventListener('click', this.handleLogout.bind(this));
        // Orders
        this.dom.placeOrderBtn.addEventListener('click', this.placeOrder.bind(this));
        // Category filters
        this.dom.categoryButtons.forEach(button => {
            button.addEventListener('click', this.handleCategoryFilter.bind(this));
        });
    },
    // Handle login
    handleLogin: function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (!username || !password) {
            this.showError(this.dom.loginError, 'Please enter both username and password');
            return;
        }
        if (Auth.login(username, password)) {
            this.dom.loginPage.style.display = 'none';
            this.dom.staffDashboard.style.display = 'block';
            this.dom.customerMenu.style.display = 'none';
            this.dom.logoutLink.style.display = 'block';
            this.dom.loginForm.reset();
        } else {
            this.showError(this.dom.loginError, 'Invalid username or password');
        }
    },
    // Handle logout
    handleLogout: function() {
        Auth.logout();
        this.dom.loginPage.style.display = 'block';
        this.dom.staffDashboard.style.display = 'none';
        this.dom.customerMenu.style.display = 'none';
        this.dom.logoutLink.style.display = 'none';
    },
    // Handle adding new menu item
    handleAddItem: function(e) {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const price = document.getElementById('item-price').value;
        const description = document.getElementById('item-description').value;
        const category = document.getElementById('item-category').value;
        if (!name || !price || !category) {
            alert('Please fill in all required fields');
            return;
        }
        Menu.addItem(name, price, description, category);
        this.dom.addItemForm.reset();
        this.showSuccess(this.dom.addSuccess, 'Menu item added successfully!');
        this.renderMenuItems();
        this.renderCustomerMenuItems();
    },
    // Render menu items in staff dashboard
    renderMenuItems: function() {
        this.dom.menuItemsContainer.innerHTML = '';
        const items = Menu.getAllItems();
        if (items.length === 0) {
            this.dom.menuItemsContainer.innerHTML = '<p>No menu items available</p>';
            return;
        }
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="description">${item.description}</div>
                <div class="category">Category: ${item.category}</div>
                <div class="actions">
                    <button onclick="App.editItem(${item.id})">Edit</button>
                    <button onclick="App.removeItem(${item.id})" style="background-color: #d9534f;">Remove</button>
                </div>
            `;
            this.dom.menuItemsContainer.appendChild(itemElement);
        });
    },
    // Render menu items for customers
    renderCustomerMenuItems: function() {
        this.dom.customerMenuItemsContainer.innerHTML = '';
        const items = Menu.getAllItems();
        if (items.length === 0) {
            this.dom.customerMenuItemsContainer.innerHTML = '<p>No menu items available</p>';
            return;
        }
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <div class="price">₦${item.price.toFixed(2)}</div>
                <div class="description">${item.description}</div>
                <button onclick="App.addToOrder(${item.id})">Add to Order</button>
            `;
            this.dom.customerMenuItemsContainer.appendChild(itemElement);
        });
    },
    // Handle category filtering
    handleCategoryFilter: function(e) {
        const category = e.target.dataset.category;
        // Update active button
        this.dom.categoryButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        // Filter items
        this.filterMenuItems(category);
    },
    // Filter menu items by category
    filterMenuItems: function(category) {
        const items = category === 'all' ? Menu.getAllItems() : Menu.getItemsByCategory(category);
        this.dom.customerMenuItemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <div class="price">₦${item.price.toFixed(2)}</div>
                <div class="description">${item.description}</div>
                <button onclick="App.addToOrder(${item.id})">Add to Order</button>
            `;
            this.dom.customerMenuItemsContainer.appendChild(itemElement);
        });
    },
    // Add item to order
    addToOrder: function(itemId) {
        if (Orders.addToOrder(itemId)) {
            this.updateOrderSummary();
        }
    },
    // Update order summary
    updateOrderSummary: function() {
        this.dom.orderItemsContainer.innerHTML = '';
        const order = Orders.getCurrentOrder();
        if (order.length === 0) {
            this.dom.orderItemsContainer.innerHTML = '<div class="empty-order">Your order is empty</div>';
            this.dom.orderTotal.style.display = 'none';
            this.dom.placeOrderBtn.style.display = 'none';
            return;
        }
        order.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const orderItemElement = document.createElement('div');
            orderItemElement.className = 'order-item';
            orderItemElement.innerHTML = `
                <div>
                    <div>${item.name}</div>
                    <div style="font-size: 0.9em; color: #7a6852;">
                        $${item.price.toFixed(2)} × ${item.quantity}
                    </div>
                </div>
                <div>$${itemTotal.toFixed(2)}</div>
            `;
            this.dom.orderItemsContainer.appendChild(orderItemElement);
        });
        this.dom.totalAmount.textContent = `₦${Orders.calculateTotal().toFixed(2)}`;
        this.dom.orderTotal.style.display = 'flex';
        this.dom.placeOrderBtn.style.display = 'block';
    },
    // Place order
    placeOrder: function() {
        const order = Orders.placeOrder();
        if (order) {
            alert(`Order placed successfully! Total: ₦${order.total.toFixed(2)}`);
            this.updateOrderSummary();
        } else {
            alert('Your order is empty');
        }
    },
    // Remove menu item
    removeItem: function(itemId) {
        if (confirm('Are you sure you want to remove this item?')) {
            Menu.removeItem(itemId);
            this.renderMenuItems();
            this.renderCustomerMenuItems();
        }
    },
    // Edit menu item
    editItem: function(itemId) {
        const item = Menu.getItemById(itemId);
        if (item) {
            const newPrice = prompt(`Enter new price for ${item.name}:`, item.price);
            if (newPrice && !isNaN(parseFloat(newPrice))) {
                Menu.updateItem(itemId, { price: parseFloat(newPrice) });
                this.renderMenuItems();
                this.renderCustomerMenuItems();
            }
        }
    },
    // Show customer menu
    showCustomerMenu: function() {
        this.dom.loginPage.style.display = 'none';
        this.dom.staffDashboard.style.display = 'none';
        this.dom.customerMenu.style.display = 'block';
        this.dom.logoutLink.style.display = 'none';
    },
    // Show staff login
    showStaffLogin: function() {
        this.dom.loginPage.style.display = 'block';
        this.dom.staffDashboard.style.display = 'none';
        this.dom.customerMenu.style.display = 'none';
        this.dom.logoutLink.style.display = 'none';
    },
    // Show error message
    showError: function(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 3000);
    },
    // Show success message
    showSuccess: function(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 3000);
    }
};
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
