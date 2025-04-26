class AddTypeToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :type, :string
  end
end
