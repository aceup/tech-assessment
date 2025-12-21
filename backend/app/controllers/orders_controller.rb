class OrdersController < ApplicationController
    def index
        orders = Order.all.order(created_at: :desc)
        render json: orders, status: :ok
    end

    def create
        new_order = Order.new(order_params)
        new_order.save!
        OrderMailer.with(order: new_order).order_created_email.deliver_later
        render json: new_order, status: :created
    end

    def destroy
        order_to_delete = Order.find(params[:id])
        order_to_delete.destroy!
        render status: :ok
    end

    def update
        order_to_change = Order.find(params[:id])
        order_to_change.update!(order_params)
        render json: order_to_change, status: :ok
    end

    private

    def order_params
        params.require(:order).permit(:title, :description, :due, :status, :client)
    end

end
