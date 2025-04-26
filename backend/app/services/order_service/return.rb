module OrderService
  class Return < Base
    after_creation :notify_finance

    private

    def build_order
      Order::Return.new(@params)
    end

    def notify_finance
      puts "Notificando a Finanzas del Return: #{@order.id}"
    end
  end
end