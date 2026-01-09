class AddClientToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :client, :string
  end
end
