class OrderMailer < ApplicationMailer
  def confirmation_email(order)
    @order = order
    mail(
      to: @order.customer_email,
      subject: 'Order Confirmation'
    )
  end
end 