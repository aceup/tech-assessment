require "test_helper"

class OrderTest < ActiveSupport::TestCase
    test "should not create order without title" do
        order = Order.new(description: "a description")
        assert_not order.save
    end
    
    test "should save order with default status pending" do
        order = Order.new({title: "A new order", description: "a description"})
        assert order.save
        assert_equal "pending", order.status
    end
end
    
    