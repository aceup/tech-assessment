require 'ostruct'

module OrderService
  class Base
    def initialize(params)
      @params = params
      @order = nil
    end

    def create
      @order = build_order

      if @order.save
        run_after_creation_callbacks
        OpenStruct.new(success?: true, order: @order, errors: nil)
      else
        OpenStruct.new(success?: false, order: nil, errors: @order.errors.full_messages)
      end
    end

    def update(order, params)
      @order = order
      if @order.update(params)
        OpenStruct.new(success?: true, order: @order, errors: nil)
      else
        OpenStruct.new(success?: false, order: @order, errors: @order.errors.full_messages)
      end
    end

    def self.after_creation(method_name = nil, &block)
      after_creation_callbacks << (method_name || block)
    end

    private

    def self.after_creation_callbacks
      @after_creation_callbacks ||= []
    end

    def run_after_creation_callbacks
      self.class.after_creation_callbacks.each do |callback|
        if callback.is_a?(Proc)
          instance_exec(&callback)
        else
          send(callback)
        end
      end
    end

    def build_order
      raise NotImplementedError, "You must implement build_order in subclass"
    end
  end
end