module OrderService
  class Transfer < Base
    after_creation :validate_existance

    private

    def build_order
      Order::Transfer.new(@params)
    end

    def validate_existance
      puts "Validando existencia del Transfer: #{@order.id}"
    end
  end
end