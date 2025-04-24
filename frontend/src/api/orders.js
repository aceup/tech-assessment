const API_BASE_URL = 'http://localhost:3000/api/v1';

export const ordersApi = {
  // Get all orders
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order statistics
  async getStatistics() {
    try {
      const orders = await this.getOrders();
      const countByStatuses = (statuses) => {
        return orders.filter(order => statuses.includes(order.status)).length;
      }
      return {
        total: orders.length,
        inProgress: countByStatuses(['pending', 'processing']),
        completed: countByStatuses(['completed']),
        cancelled: countByStatuses(['cancelled']),
        totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      throw error;
    }
  }
};