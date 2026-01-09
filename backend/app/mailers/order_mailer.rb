class OrderMailer < ApplicationMailer
    default from: "notifications@example.com"

  def order_created_email
    @order = params[:order]
    mail(to: "admin@ordersapp.com", subject: "Order has been created")
  end
end
