module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: [:show, :update, :destroy]
      before_action :set_orders_service, only: [:create, :update]

      def index
        @orders = Order.all
        render json: @orders
      end

      def show
        render json: @order
      end

      def create
        result = @orders_service.create(order_params)
        
        if result.success?
          render json: result.order, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      def update
        result = @orders_service.update(@order, order_params)
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

      def set_orders_service
        case params[:type]
        when 'transfer'
          @orders_service = OrderService::Transfer.new(params)
        when 'return'
          @orders_service = OrderService::Return.new(params)
        end
      end
  
      def order_params
        params.require(:order).permit(:type, :customer_email, :total_amount, :status, :notes)
      end
    end
  end
end 