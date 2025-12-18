require "test_helper"

class OrdersControllerTest < ActionDispatch::IntegrationTest
    fixtures :orders

    test "should get index" do
        get orders_url
        assert_response :success

        json_response = JSON.parse(response.body)
        assert_equal 2, json_response.length
    end

    test "should get index in order created_at desc" do
        get orders_url
        assert_response :success

        json_response = JSON.parse(response.body)
        timestamps = json_response.map { |t| t["created_at"]}
        assert_equal timestamps.sort.reverse, timestamps
    end

    test "should create order" do
        assert_difference("Order.count", 1) do
            post orders_url, params: {order:{title:"A new order", status: "pending"}}
        end
        assert_response :created
    end

    test "should delete order" do
        assert_difference("Order.count", -1) do
            delete order_url(1)
        end
        assert_response :success
    end

    test "should update order" do
        patch order_url(2), params: {order:{title:"Updated Title"}}
        assert_response :success

        json_response = JSON.parse(response.body)
        assert_equal "Updated Title", json_response["title"]
    end

end