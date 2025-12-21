class OrdersController < ApplicationController
    def index
        orders = ::OrderService.list_orders
        render json: orders, status: :ok
    end

    def create
        new_order = ::OrderService.create_order(order_params)
        render json: new_order, status: :created
    end

    def destroy
        ::OrderService.delete_order(params[:id])
        render status: :ok
    end

    def update
        updated_order = ::OrderService.update_order(params[:id], order_params)
        render json: updated_order, status: :ok
    end

    private

    def order_params
        params.require(:order).permit(:title, :description, :due, :status, :client)
    end

end
