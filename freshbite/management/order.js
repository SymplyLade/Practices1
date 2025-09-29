// Order management module
const Orders = {
    // Current order
    currentOrder: [],
    // Add item to order
    addToOrder: function(itemId) {
        const item = Menu.getItemById(itemId);
        if (item) {
            // Check if item already exists in order
            const existingItem = this.currentOrder.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.currentOrder.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                });
            }
            return true;
        }
        return false;
    },
    // Remove item from order
    removeFromOrder: function(itemId) {
        this.currentOrder = this.currentOrder.filter(item => item.id !== itemId);
    },
    // Update item quantity in order
    updateQuantity: function(itemId, quantity) {
        const item = this.currentOrder.find(i => i.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromOrder(itemId);
            } else {
                item.quantity = quantity;
            }
            return true;
        }
        return false;
    },
    // Get current order
    getCurrentOrder: function() {
        return this.currentOrder;
    },
    // Calculate order total
    calculateTotal: function() {
        return this.currentOrder.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    // Clear current order
    clearOrder: function() {
        this.currentOrder = [];
    },
    // Place order
    placeOrder: function() {
        if (this.currentOrder.length === 0) {
            return false;
        }
        // In a real application, you would send this to a server
        const order = {
            items: [...this.currentOrder],
            total: this.calculateTotal(),
            timestamp: new Date().toISOString()
        };
        // Clear current order after placing
        this.clearOrder();
        return order;
    }
};
