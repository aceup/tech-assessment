require 'ostruct'

class OrderService
  def self.create(params)
    order = Order.new(params)
    
    if order.save
      OrderMailer.confirmation_email(order).deliver_later
      
      OpenStruct.new(success?: true, order: order, errors: nil)
    else
      OpenStruct.new(success?: false, order: nil, errors: order.errors.full_messages)
    end
  end

  def self.update(order, params)
    begin
      if order.update(params)
        OpenStruct.new(success?: true, order: order, errors: nil)
      else
        OpenStruct.new(success?: false, order: order, errors: order.errors.full_messages)
      end
    rescue ArgumentError => e
      OpenStruct.new(success?: false, order: order, errors: [e.message])
    end
  end
end 