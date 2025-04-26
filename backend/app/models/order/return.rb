class Order::Return < Order
  validates :type, presence: true
end

