const API_URL = 'http://localhost:3000';

const orderService = {
  async getAll() {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error('Error fetching orders');
    }
    return response.json();
  },

  async create(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order: orderData }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors?.join(', ') || 'Error creating order');
    }
    
    return response.json();
  },
};

export default orderService;
