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

  def self.update_status(order, new_status)
    begin
      if order.update(status: new_status)
        OpenStruct.new(success?: true, order: order, errors: nil)
      else
        OpenStruct.new(success?: false, order: order, errors: order.errors.full_messages)
      end
    rescue ArgumentError
      OpenStruct.new(success?: false, order: order, errors: ["Invalid status: #{new_status}"])
    end
  end
end 