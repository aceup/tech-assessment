class Order::Transfer < Order
  validates :type, presence: true
end
