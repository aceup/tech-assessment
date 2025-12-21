class OrderService
  def self.create_order(order_params)
    order = Order.new(order_params)
    order.save!
    OrderMailer.with(order: order).order_created_email.deliver_later
    order
  end

  def self.update_order(order_id, order_params)
    order = Order.find(order_id)
    order.update!(order_params)
    order
  end

  def self.delete_order(order_id)
    order = Order.find(order_id)
    order.destroy!
  end

  def self.list_orders
    Order.all.order(created_at: :desc)
  end
end
