// Menu management module
const Menu = {
    // Sample menu data
    items: [
        { id: 1, name: "Espresso", price: 2500.50, description: "Strong and bold coffee", category: "coffee" },
        { id: 2, name: "Cappuccino", price: 5000.50, description: "Espresso with steamed milk foam", category: "coffee" },
        { id: 3, name: "Green Tea", price: 1500.50, description: "Refreshing green tea", category: "tea" },
        { id: 4, name: "Croissant", price: 4500.00, description: "Buttery and flaky pastry", category: "pastry" },
        { id: 5, name: "Ham & Cheese Sandwich", price: 9890.50, description: "Fresh bread with ham and cheese", category: "sandwich" }
    ],
    // Get all menu items
    getAllItems: function() {
        return this.items;
    },
    // Get items by category
    getItemsByCategory: function(category) {
        if (category === 'all') return this.items;
        return this.items.filter(item => item.category === category);
    },
    // Add new menu item
    addItem: function(name, price, description, category) {
        const newItem = {
            id: this.items.length > 0 ? Math.max(...this.items.map(item => item.id)) + 1 : 1,
            name,
            price: parseFloat(price),
            description,
            category
        };
        this.items.push(newItem);
        return newItem;
    },
    // Remove menu item
    removeItem: function(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    },
    // Update menu item
    updateItem: function(itemId, updates) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.items[itemIndex] = { ...this.items[itemIndex], ...updates };
            return this.items[itemIndex];
        }
        return null;
    },
    // Get item by ID
    getItemById: function(itemId) {
        return this.items.find(item => item.id === itemId);
    }
};
