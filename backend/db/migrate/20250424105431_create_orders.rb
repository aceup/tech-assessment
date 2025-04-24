class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.string :customer_email, null: false
      t.decimal :total_amount, precision: 15, scale: 2, null: false
      t.integer :status, default: 0, null: false
      t.text :notes
      t.timestamps
    end

    add_index :orders, :customer_email
    add_index :orders, :status
  end
end 