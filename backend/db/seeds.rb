puts "🌱 Starting seeding process..."

# Clear existing data
puts "Cleaning database..."
Order.destroy_all

# Create sample orders
puts "Creating orders..."

# Sample customer data
customers = [
  { name: "John Smith", email: "john.smith@example.com" },
  { name: "Emma Wilson", email: "emma.wilson@example.com" },
  { name: "Michael Chen", email: "michael.chen@example.com" },
  { name: "Sarah Johnson", email: "sarah.j@example.com" },
  { name: "David Brown", email: "david.brown@example.com" }
]

# Create orders with different statuses
20.times do |i|
  order = Order.create!(
    customer_email: customers.sample[:email],
    total_amount: [1500.00, 5000.50, 10000.00].sample,
    status: Order.statuses.keys.sample,
    notes: Faker::Lorem.sentence
  )
  
  puts "Created order ##{order.id} for #{order.customer_email}"
end

puts "✅ Seeding completed! Created #{Order.count} orders."
