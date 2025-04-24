module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: [:show, :update, :destroy]

      def index
        @orders = Order.all
        render json: @orders
      end

      def show
        render json: @order
      end

      def create
        result = OrderService.create(order_params)
        
        if result.success?
          render json: result.order, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      def update
        result = OrderService.update(@order, order_params)
        if result.success?
          render json: result.order, status: :ok
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @order.destroy
        head :no_content
      end

      private

      def set_order
        @order = Order.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Order not found' }, status: :not_found
      end

      def order_params
        params.require(:order).permit(:customer_email, :total_amount, :status, :notes)
      end
    end
  end
end 